import createClient, { type Client, type Middleware } from 'openapi-fetch';

import { ApiError, errorFromResponse, errorFromTransport } from './errors';
import type { paths } from './generated/schema';
import type { Page, Pagination } from './types';

export type ApiClient = Client<paths>;

export type CreateApiClientOptions = {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  /** Replaces global fetch; tests pass a fake. */
  readonly fetch?: typeof fetch;
  /** Runs after the request-ID middleware, in order. */
  readonly middleware?: readonly Middleware[];
};

const REQUEST_ID = /^[A-Za-z0-9._:-]{1,128}$/;

/** A correlation ID in the format the backend accepts. Not a secret. */
export function newRequestId(): string {
  const random = Math.random().toString(36).slice(2, 12);
  return `m-${Date.now().toString(36)}-${random}`;
}

const requestIdMiddleware: Middleware = {
  onRequest({ request }) {
    const existing = request.headers.get('X-Request-ID');
    if (!existing || !REQUEST_ID.test(existing)) {
      request.headers.set('X-Request-ID', newRequestId());
    }
    return request;
  },
};

/**
 * Wraps fetch with a per-request timeout. A timeout rejects with an ApiError
 * TIMEOUT; a caller's own abort still rejects as the caller expects.
 */
export function withTimeout(base: typeof fetch, timeoutMs: number): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const controller = new AbortController();
    // Duck-typed: the Request openapi-fetch builds can come from a different
    // implementation than the global one, so `instanceof Request` isn't reliable.
    const requestLike = typeof input === 'object' && input !== null ? (input as Partial<Request>) : null;
    const callerSignal = init?.signal ?? requestLike?.signal ?? undefined;
    // A signal that was aborted before the request got here never fires its
    // event, so check it first.
    if (callerSignal?.aborted) throw abortError();
    const onCallerAbort = () => controller.abort();
    callerSignal?.addEventListener('abort', onCallerAbort);
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      return await base(input, { ...init, signal: controller.signal });
    } catch (error) {
      if (timedOut) {
        const id = requestLike?.headers?.get?.('X-Request-ID') ?? null;
        throw new ApiError(
          'TIMEOUT',
          'The request took too long. Check your connection and try again.',
          null,
          id,
        );
      }
      throw error;
    } finally {
      clearTimeout(timer);
      callerSignal?.removeEventListener('abort', onCallerAbort);
    }
  }) as typeof fetch;
}

export function createApiClient(options: CreateApiClientOptions): ApiClient {
  const client = createClient<paths>({
    baseUrl: options.baseUrl,
    fetch: withTimeout(options.fetch ?? ((...args) => globalThis.fetch(...args)), options.timeoutMs),
  });
  client.use(requestIdMiddleware);
  for (const middleware of options.middleware ?? []) client.use(middleware);
  return client;
}

/** The X-Tenant-Slug header every tenant-scoped route requires. */
export function tenantHeader(slug: string): { 'X-Tenant-Slug': string } {
  return { 'X-Tenant-Slug': slug };
}

type FetchResult<D> = { readonly data?: D; readonly error?: unknown; readonly response: Response };

/** The `data` member of a success envelope type. */
export type EnvelopeData<D> = D extends { readonly data?: infer X } ? Exclude<X, undefined> : never;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function malformed(response: Response): ApiError {
  return new ApiError(
    'INTERNAL_ERROR',
    'Something went wrong. Please try again.',
    response.status,
    response.headers.get('X-Request-ID'),
  );
}

function abortError(): Error {
  return Object.assign(new Error('The request was cancelled.'), { name: 'AbortError' });
}

/** True for a fetch cancelled by its caller (a screen unmounting, say). */
export function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { name?: unknown }).name === 'AbortError';
}

async function settle<D>(pending: Promise<FetchResult<D>>): Promise<FetchResult<D>> {
  try {
    return await pending;
  } catch (error) {
    // A cancellation the caller asked for isn't a failure to reach BUILD, so it
    // passes through untouched. A timeout is already an ApiError by now.
    if (isAbortError(error)) throw error;
    throw errorFromTransport(error, null);
  }
}

/**
 * Resolves an openapi-fetch call to the envelope's `data`, or throws an
 * ApiError. A 2xx without a success envelope is a contract breach and throws
 * INTERNAL_ERROR rather than handing the screen something unexpected.
 */
export async function call<D>(pending: Promise<FetchResult<D>>): Promise<EnvelopeData<D>> {
  const { data, error, response } = await settle(pending);
  if (!response.ok) throw errorFromResponse(error, response);
  if (!isRecord(data) || data.success !== true || !('data' in data)) throw malformed(response);
  return data.data as EnvelopeData<D>;
}

/** Like call, for list routes: returns the items with meta.pagination. */
export async function callPage<D>(
  pending: Promise<FetchResult<D>>,
): Promise<Page<EnvelopeData<D> extends readonly (infer T)[] ? T : never>> {
  const { data, error, response } = await settle(pending);
  if (!response.ok) throw errorFromResponse(error, response);
  if (!isRecord(data) || data.success !== true || !Array.isArray(data.data)) throw malformed(response);
  const meta = isRecord(data.meta) ? data.meta : {};
  const pagination = isRecord(meta.pagination) ? (meta.pagination as Pagination) : null;
  if (!pagination) throw malformed(response);
  return { items: data.data, pagination };
}

/**
 * For bodyless successes such as registerUser's 202. The pending call must be
 * made with parseAs: 'text', since an empty body isn't JSON.
 */
export async function callNoContent(pending: Promise<FetchResult<unknown>>): Promise<void> {
  const { error, response } = await settle(pending);
  if (!response.ok) {
    let body: unknown = error;
    if (typeof error === 'string') {
      try {
        body = JSON.parse(error);
      } catch {
        body = null;
      }
    }
    throw errorFromResponse(body, response);
  }
}
