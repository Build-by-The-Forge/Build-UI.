import { SessionManager } from '../sessionManager';
import type { StoredSession, TokenStore } from '../tokenStore';

// --- a small fake backend with the refresh rules from the conventions --------

const envelope = (data: unknown) => ({ success: true, data, error: null, meta: { request_id: 'r' } });
const failure = (code: string) => ({
  success: false,
  data: null,
  error: { code, message: 'x', details: null },
  meta: { request_id: 'r' },
});
const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

class FakeBackend {
  /** access token -> valid until (ms) */
  accessTokens = new Map<string, number>();
  currentRefresh = 'rt-1';
  revoked = false;
  counter = 1;
  refreshCalls = 0;
  refreshDelay: Promise<void> | null = null;
  refreshFails: 'network' | null = null;
  logoutCalls = 0;
  logoutFails = false;
  now = 1_000_000;
  seen: string[] = [];

  issue(userId = 'u1') {
    this.counter += 1;
    const access = `at-${this.counter}`;
    this.accessTokens.set(access, this.now + 900_000);
    this.currentRefresh = `rt-${this.counter}`;
    return {
      user_id: userId,
      session_id: 's1',
      device_id: null,
      access_token: access,
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: this.currentRefresh,
    };
  }

  fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init);
    const path = new URL(request.url).pathname;
    this.seen.push(`${request.method} ${path}`);
    if (path === '/identity/authenticate') {
      const body = (await request.json()) as { password: string };
      if (body.password !== 'right') return reply(401, failure('AUTH_INVALID_CREDENTIALS'));
      this.revoked = false;
      return reply(200, envelope(this.issue()));
    }
    if (path === '/identity/refresh') {
      this.refreshCalls += 1;
      if (this.refreshFails === 'network') throw new TypeError('Network request failed');
      if (this.refreshDelay) await this.refreshDelay;
      const body = (await request.json()) as { refresh_token: string };
      if (this.revoked || body.refresh_token !== this.currentRefresh) {
        this.revoked = true; // a reused token revokes the whole session
        return reply(401, failure('AUTH_REFRESH_INVALID'));
      }
      return reply(200, envelope(this.issue()));
    }
    if (path === '/identity/logout') {
      this.logoutCalls += 1;
      if (this.logoutFails) throw new TypeError('offline');
      return reply(200, envelope({}));
    }
    // Any other route needs a live access token.
    const token = (request.headers.get('Authorization') ?? '').replace('Bearer ', '');
    const expires = this.accessTokens.get(token);
    if (this.revoked || expires === undefined || expires <= this.now) {
      return reply(401, failure('AUTH_TOKEN_INVALID'));
    }
    return reply(200, envelope({ id: 'u1', email: 's@x.ng', status: 'active', email_verified: true }));
  }) as typeof fetch;
}

class MemoryStore implements TokenStore {
  session: StoredSession | null = null;
  saves: string[] = [];
  failSave = false;
  device = 'device-1';
  async load() {
    return this.session;
  }
  async save(session: StoredSession) {
    if (this.failSave) throw new Error('keystore full');
    this.saves.push(session.refreshToken);
    this.session = session;
  }
  async clear() {
    this.session = null;
  }
  async deviceId() {
    return this.device;
  }
}

function setup() {
  const backend = new FakeBackend();
  const store = new MemoryStore();
  const signedOut = jest.fn();
  const manager = new SessionManager({
    baseUrl: 'https://api.test',
    timeoutMs: 1_000,
    store,
    fetch: backend.fetch,
    now: () => backend.now,
    onSignedOut: signedOut,
  });
  return { backend, store, manager, signedOut };
}

const me = (m: SessionManager) => m.client.GET('/identity/me');

describe('signing in', () => {
  it('stores the refresh token, keeps the access token in memory and signs in', async () => {
    const { manager, store } = setup();
    await manager.signIn('s@x.ng', 'right');
    expect(manager.getSnapshot()).toMatchObject({ status: 'signedIn', userId: 'u1' });
    expect(store.session?.refreshToken).toBe('rt-2');
    expect(JSON.stringify(store.session)).not.toContain('at-');
  });

  it('leaves the student signed out on bad credentials', async () => {
    const { manager, store } = setup();
    await manager.bootstrap();
    await expect(manager.signIn('s@x.ng', 'wrong')).rejects.toMatchObject({ code: 'AUTH_INVALID_CREDENTIALS' });
    expect(manager.getSnapshot().status).toBe('signedOut');
    expect(store.session).toBeNull();
  });
});

describe('authenticated requests', () => {
  it('sends the bearer token', async () => {
    const { manager } = setup();
    await manager.signIn('s@x.ng', 'right');
    const { response } = await me(manager);
    expect(response.status).toBe(200);
  });

  it('refreshes once and retries when the access token is rejected', async () => {
    const { manager, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.accessTokens.clear(); // server forgets the token (rotated key, revoked access)
    const { response } = await me(manager);
    // The refresh issued a token the server accepts, so the retry succeeds.
    expect(response.status).toBe(200);
    expect(backend.refreshCalls).toBe(1);
    expect(backend.seen.filter((s) => s === 'GET /identity/me')).toHaveLength(2);
  });

  it('refreshes before sending when the token is about to expire', async () => {
    const { manager, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.now += 880_000; // 20 s left, inside the 30 s margin
    const { response } = await me(manager);
    expect(response.status).toBe(200);
    expect(backend.refreshCalls).toBe(1);
    expect(backend.seen.filter((s) => s === 'GET /identity/me')).toHaveLength(1);
  });

  it('does not retry a second 401 forever', async () => {
    const { manager, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.accessTokens.clear();
    const realIssue = backend.issue.bind(backend);
    backend.issue = () => {
      const session = realIssue();
      backend.accessTokens.clear(); // every token it hands out is rejected
      return session;
    };
    const { response } = await me(manager);
    expect(response.status).toBe(401);
    expect(backend.seen.filter((s) => s === 'GET /identity/me')).toHaveLength(2);
  });

  it('fails a request with no session without calling the backend', async () => {
    const { manager, backend } = setup();
    await manager.bootstrap();
    await expect(me(manager)).rejects.toMatchObject({ code: 'AUTH_TOKEN_INVALID' });
    expect(backend.seen).toHaveLength(0);
  });
});

describe('single-flight refresh', () => {
  it('shares one refresh between concurrent 401s', async () => {
    const { manager, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.accessTokens.clear();
    let release!: () => void;
    backend.refreshDelay = new Promise<void>((resolve) => (release = resolve));
    const calls = [me(manager), me(manager), me(manager)];
    await new Promise((r) => setTimeout(r, 20));
    release();
    const results = await Promise.all(calls);
    expect(results.map((r) => r.response.status)).toEqual([200, 200, 200]);
    expect(backend.refreshCalls).toBe(1); // a second use would have revoked the session
    expect(backend.revoked).toBe(false);
  });

  it('saves the rotated refresh token before it hands out the access token', async () => {
    const { manager, backend, store } = setup();
    await manager.signIn('s@x.ng', 'right');
    const token = await manager.refresh();
    expect(token).toMatch(/^at-/);
    expect(store.session?.refreshToken).toBe(backend.currentRefresh);
  });

  it('keeps working in memory when the new token cannot be written', async () => {
    const { manager, store } = setup();
    await manager.signIn('s@x.ng', 'right');
    store.failSave = true;
    await expect(manager.refresh()).resolves.toMatch(/^at-/);
    expect(manager.getSnapshot().status).toBe('signedIn');
  });
});

describe('a refresh the backend refuses', () => {
  it('signs out, clears storage and never retries that token', async () => {
    const { manager, backend, store, signedOut } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.revoked = true;
    backend.accessTokens.clear();
    await expect(me(manager)).rejects.toMatchObject({ code: 'AUTH_REFRESH_INVALID' });
    expect(manager.getSnapshot()).toMatchObject({ status: 'signedOut', reason: 'expired' });
    expect(store.session).toBeNull();
    expect(signedOut).toHaveBeenCalledTimes(1);
    await expect(me(manager)).rejects.toMatchObject({ code: 'AUTH_TOKEN_INVALID' });
    expect(backend.refreshCalls).toBe(1);
  });

  it('logs out when a reused refresh token comes back from another install', async () => {
    const { manager, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.currentRefresh = 'rt-someone-else-rotated'; // the token we hold is now stale
    await expect(manager.refresh()).rejects.toMatchObject({ code: 'AUTH_REFRESH_INVALID' });
    expect(manager.getSnapshot().status).toBe('signedOut');
  });

  it('does not sign out on a network failure, so a bad connection is not a logout', async () => {
    const { manager, backend, store } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.refreshFails = 'network';
    await expect(manager.refresh()).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
    expect(manager.getSnapshot().status).toBe('signedIn');
    expect(store.session).not.toBeNull();
    backend.refreshFails = null;
    await expect(manager.refresh()).resolves.toMatch(/^at-/);
  });

  it('does not let a refresh finishing after sign-out bring the session back', async () => {
    const { manager, backend, store } = setup();
    await manager.signIn('s@x.ng', 'right');
    let release!: () => void;
    backend.refreshDelay = new Promise<void>((resolve) => (release = resolve));
    const pending = manager.refresh().catch((e: unknown) => e);
    await new Promise((r) => setTimeout(r, 20));
    await manager.signOut();
    release();
    await pending;
    expect(manager.getSnapshot().status).toBe('signedOut');
    expect(store.session).toBeNull();
  });
});

describe('launch', () => {
  it('starts signed out with nothing stored', async () => {
    const { manager } = setup();
    await manager.bootstrap();
    expect(manager.getSnapshot()).toMatchObject({ status: 'signedOut', reason: null });
  });

  it('restores a stored session by refreshing', async () => {
    const { manager, store, backend } = setup();
    store.session = { refreshToken: backend.currentRefresh, userId: 'u1', sessionId: 's1' };
    await manager.bootstrap();
    expect(manager.getSnapshot()).toMatchObject({ status: 'signedIn', userId: 'u1' });
    expect(store.session?.refreshToken).not.toBe('rt-1');
  });

  it('says the session ended when the stored token is no longer valid', async () => {
    const { manager, store } = setup();
    store.session = { refreshToken: 'rt-stale', userId: 'u1', sessionId: 's1' };
    await manager.bootstrap();
    expect(manager.getSnapshot()).toMatchObject({ status: 'signedOut', reason: 'expired' });
    expect(store.session).toBeNull();
  });

  it('keeps the stored session when the backend cannot be reached', async () => {
    const { manager, store, backend } = setup();
    store.session = { refreshToken: backend.currentRefresh, userId: 'u1', sessionId: 's1' };
    backend.refreshFails = 'network';
    await manager.bootstrap();
    expect(manager.getSnapshot().status).toBe('unreachable');
    expect(store.session).not.toBeNull();
    backend.refreshFails = null;
    await manager.retry();
    expect(manager.getSnapshot().status).toBe('signedIn');
  });
});

describe('signing out', () => {
  it('clears local state first and tells the backend', async () => {
    const { manager, store, backend, signedOut } = setup();
    await manager.signIn('s@x.ng', 'right');
    await manager.signOut();
    expect(manager.getSnapshot()).toMatchObject({ status: 'signedOut', reason: null });
    expect(store.session).toBeNull();
    expect(backend.logoutCalls).toBe(1);
    expect(signedOut).toHaveBeenCalledTimes(1);
  });

  it('still signs out when the backend cannot be reached', async () => {
    const { manager, store, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.logoutFails = true;
    await manager.signOut();
    expect(store.session).toBeNull();
    expect(manager.getSnapshot().status).toBe('signedOut');
  });

  it('skips the backend call when the access token has already expired', async () => {
    const { manager, backend } = setup();
    await manager.signIn('s@x.ng', 'right');
    backend.now += 2_000_000;
    await manager.signOut();
    expect(backend.logoutCalls).toBe(0);
    expect(manager.getSnapshot().status).toBe('signedOut');
  });
});

describe('registration', () => {
  it('accepts the bodyless 202', async () => {
    const backend = new FakeBackend();
    const base = backend.fetch;
    backend.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      if (new URL(request.url).pathname === '/identity/users') return new Response(null, { status: 202 });
      return base(input, init);
    }) as typeof fetch;
    const manager = new SessionManager({
      baseUrl: 'https://api.test',
      timeoutMs: 1_000,
      store: new MemoryStore(),
      fetch: backend.fetch,
    });
    await expect(manager.signUp('new@x.ng', 'a-long-password')).resolves.toBeUndefined();
    expect(manager.getSnapshot().status).toBe('loading'); // registration signs nobody in
  });
});
