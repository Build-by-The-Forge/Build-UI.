import type { Middleware } from 'openapi-fetch';

import { call, callNoContent, createApiClient, type ApiClient } from '@/api/client';
import { ApiError } from '@/api/errors';
import type { TokenStore } from './tokenStore';

/**
 * loading      reading the keystore and refreshing at launch
 * signedOut    no session; `reason` says why when it wasn't the student's choice
 * signedIn     an access token is held (or can be refreshed)
 * unreachable  a session is stored but the backend couldn't be reached at launch
 */
export type SessionStatus = 'loading' | 'signedOut' | 'signedIn' | 'unreachable';
export type SignedOutReason = 'expired' | null;

export type SessionSnapshot = {
  readonly status: SessionStatus;
  readonly userId: string | null;
  readonly reason: SignedOutReason;
};

export type SessionManagerOptions = {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly store: TokenStore;
  readonly fetch?: typeof fetch;
  readonly now?: () => number;
  /** Runs on every sign-out, whether chosen, expired or revoked. Clear caches here. */
  readonly onSignedOut?: () => void;
};

/** Paths that must not carry a bearer token, or be refreshed on a 401. */
const PUBLIC_PATHS: ReadonlySet<string> = new Set([
  '/identity/users',
  '/identity/authenticate',
  '/identity/refresh',
  '/identity/verify-email',
  '/identity/resend-verification',
  '/identity/forgot-password',
  '/identity/reset-password',
]);

/** Refresh this long before expiry so a request isn't sent with a dying token. */
const EXPIRY_MARGIN_MS = 30_000;

type Access = { readonly token: string; readonly expiresAt: number };
type Sent = { readonly clone: Request; readonly token: string };

export class SessionManager {
  /** Authenticated client for the whole app. Adds the bearer token and handles 401. */
  readonly client: ApiClient;

  private readonly raw: ApiClient;
  private readonly store: TokenStore;
  private readonly now: () => number;
  private readonly onSignedOut?: () => void;

  private snapshot: SessionSnapshot = { status: 'loading', userId: null, reason: null };
  private readonly listeners = new Set<() => void>();
  private access: Access | null = null;
  private stored: { refreshToken: string; userId: string; sessionId: string } | null = null;
  private refreshing: Promise<string> | null = null;
  /** Bumped on every sign-out so a refresh already in flight can't resurrect the session. */
  private generation = 0;
  private readonly sent = new Map<string, Sent>();

  constructor(options: SessionManagerOptions) {
    this.store = options.store;
    this.now = options.now ?? Date.now;
    this.onSignedOut = options.onSignedOut;
    this.raw = createApiClient({
      baseUrl: options.baseUrl,
      timeoutMs: options.timeoutMs,
      fetch: options.fetch,
    });
    this.client = createApiClient({
      baseUrl: options.baseUrl,
      timeoutMs: options.timeoutMs,
      fetch: options.fetch,
      middleware: [this.authMiddleware()],
    });
  }

  // --- state for the UI (useSyncExternalStore) -------------------------------

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): SessionSnapshot => this.snapshot;

  private setSnapshot(next: SessionSnapshot): void {
    this.snapshot = next;
    for (const listener of [...this.listeners]) listener();
  }

  // --- lifecycle -------------------------------------------------------------

  /** Restores a stored session at launch. Never throws. */
  async bootstrap(): Promise<void> {
    this.setSnapshot({ status: 'loading', userId: null, reason: null });
    const stored = await this.store.load();
    if (!stored) {
      this.setSnapshot({ status: 'signedOut', userId: null, reason: null });
      return;
    }
    this.stored = stored;
    try {
      await this.refresh();
      this.setSnapshot({ status: 'signedIn', userId: this.stored?.userId ?? stored.userId, reason: null });
    } catch {
      // A rejected token already signed the student out (status is no longer
      // 'loading'). Anything else, such as no connection or a 5xx, keeps the
      // stored session and lets them retry.
      if (this.snapshot.status === 'loading') {
        this.setSnapshot({ status: 'unreachable', userId: null, reason: null });
      }
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const deviceId = await this.store.deviceId();
    const session = await call(
      this.raw.POST('/identity/authenticate', {
        body: { email, password, device_id: deviceId },
      }),
    );
    this.generation += 1;
    const stored = { refreshToken: session.refresh_token, userId: session.user_id, sessionId: session.session_id };
    // The refresh token is saved before anything uses the access token.
    await this.persist(stored);
    this.stored = stored;
    this.access = { token: session.access_token, expiresAt: this.now() + session.expires_in * 1000 };
    this.setSnapshot({ status: 'signedIn', userId: session.user_id, reason: null });
  }

  /** Registers an account. A 202 doesn't say whether the account is new. */
  async signUp(email: string, password: string): Promise<void> {
    await callNoContent(this.raw.POST('/identity/users', { body: { email, password }, parseAs: 'text' }));
  }

  /** Signs out on this device, then asks the backend to revoke the session. */
  async signOut(): Promise<void> {
    const access = this.access;
    const usable = access && access.expiresAt - this.now() > 0 ? access.token : null;
    await this.endLocalSession(null);
    if (!usable) return; // an expired token can't revoke; the session lapses on its own
    try {
      await call(
        this.raw.POST('/identity/logout', { headers: { Authorization: `Bearer ${usable}` } }),
      );
    } catch {
      // Already signed out here, which is what matters on a flaky network.
    }
  }

  /** Re-runs the launch restore after `unreachable`. */
  retry = (): Promise<void> => this.bootstrap();

  // --- tokens ----------------------------------------------------------------

  /** A valid access token, refreshing first when it is missing or close to expiry. */
  async getAccessToken(): Promise<string | null> {
    if (this.access && this.access.expiresAt - this.now() > EXPIRY_MARGIN_MS) return this.access.token;
    if (!this.stored) return null;
    return this.refresh();
  }

  /**
   * One refresh at a time. Callers that arrive while one is running share its
   * result, because the backend treats a second use of a rotated token as theft
   * and revokes the whole session.
   */
  refresh(): Promise<string> {
    if (this.refreshing) return this.refreshing;
    const run: Promise<string> = this.doRefresh().finally(() => {
      if (this.refreshing === run) this.refreshing = null;
    });
    this.refreshing = run;
    return run;
  }

  private async doRefresh(): Promise<string> {
    const stored = this.stored;
    if (!stored) throw signedOutError();
    const generation = this.generation;
    let session;
    try {
      session = await call(
        this.raw.POST('/identity/refresh', { body: { refresh_token: stored.refreshToken } }),
      );
    } catch (error) {
      if (error instanceof ApiError && isRefreshRejection(error) && generation === this.generation) {
        // Expired, revoked and reused tokens look the same. Never retry this token.
        await this.endLocalSession('expired');
      }
      throw error;
    }
    if (generation !== this.generation) throw signedOutError(); // signed out meanwhile
    const next = { refreshToken: session.refresh_token, userId: session.user_id, sessionId: session.session_id };
    // The rotated token is held in memory at once and saved before the new
    // access token is handed out. A failed write isn't fatal: the session lives
    // on in memory and the student signs in again after a restart.
    this.stored = next;
    try {
      await this.store.save(next);
    } catch {
      // see above
    }
    this.access = { token: session.access_token, expiresAt: this.now() + session.expires_in * 1000 };
    return session.access_token;
  }

  private async persist(stored: { refreshToken: string; userId: string; sessionId: string }): Promise<void> {
    await this.store.save(stored);
  }

  private async endLocalSession(reason: SignedOutReason): Promise<void> {
    this.generation += 1;
    this.access = null;
    this.stored = null;
    this.sent.clear();
    this.setSnapshot({ status: 'signedOut', userId: null, reason });
    try {
      await this.store.clear();
    } catch {
      // A keystore that won't delete is reported by the next load() as empty or invalid.
    }
    this.onSignedOut?.();
  }

  // --- request middleware ----------------------------------------------------

  private authMiddleware(): Middleware {
    return {
      onRequest: async ({ request, schemaPath, id }) => {
        if (PUBLIC_PATHS.has(schemaPath) || request.headers.has('Authorization')) return request;
        const token = await this.getAccessToken();
        if (!token) throw signedOutError();
        request.headers.set('Authorization', `Bearer ${token}`);
        this.sent.set(id, { clone: request.clone(), token });
        return request;
      },
      onResponse: async ({ response, id, options }) => {
        const sent = this.sent.get(id);
        this.sent.delete(id);
        if (!sent || response.status !== 401) return undefined;
        if ((await errorCodeOf(response)) !== 'AUTH_TOKEN_INVALID') return undefined;
        // Refresh once and retry once. If another request already refreshed
        // since this one was sent, just use the newer token.
        const token = this.access && this.access.token !== sent.token ? this.access.token : await this.refresh();
        const retry = new Request(sent.clone, { headers: withBearer(sent.clone.headers, token) });
        return options.fetch(retry);
      },
      onError: ({ id }) => {
        this.sent.delete(id);
        return undefined;
      },
    };
  }
}

function signedOutError(): ApiError {
  return new ApiError('AUTH_TOKEN_INVALID', 'Please sign in again.', 401, null);
}

/**
 * The backend refused this refresh token for good: expired, revoked, reused
 * (all AUTH_REFRESH_INVALID) or malformed (VALIDATION_FAILED). Retrying it can
 * only make things worse.
 */
function isRefreshRejection(error: ApiError): boolean {
  return error.code === 'AUTH_REFRESH_INVALID' || error.code === 'VALIDATION_FAILED';
}

function withBearer(headers: Headers, token: string): Headers {
  const next = new Headers(headers);
  next.set('Authorization', `Bearer ${token}`);
  return next;
}

async function errorCodeOf(response: Response): Promise<string | null> {
  try {
    const body: unknown = await response.clone().json();
    if (typeof body === 'object' && body !== null && 'error' in body) {
      const error = (body as { error: unknown }).error;
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as { code: unknown }).code;
        return typeof code === 'string' ? code : null;
      }
    }
  } catch {
    // not JSON
  }
  return null;
}
