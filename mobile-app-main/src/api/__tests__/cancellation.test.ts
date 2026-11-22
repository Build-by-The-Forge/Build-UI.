import { call, createApiClient, isAbortError } from '../client';
import { ApiError } from '../errors';

const user = { id: 'u1', email: 's@futa.edu.ng', status: 'active', email_verified: true };

/** A fetch that honours the abort signal, like the real one. */
function clientWith(handler: (signal: AbortSignal) => Promise<Response>, timeoutMs = 1_000) {
  const fake = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init);
    const signal = init?.signal ?? request.signal;
    return new Promise<Response>((resolve, reject) => {
      const abort = () => reject(Object.assign(new Error('The operation was aborted'), { name: 'AbortError' }));
      if (signal.aborted) return abort();
      signal.addEventListener('abort', abort);
      handler(signal).then(resolve, reject);
    });
  }) as typeof fetch;
  return createApiClient({ baseUrl: 'https://api.test', timeoutMs, fetch: fake });
}

const pending = () => new Promise<Response>(() => {});

describe('request outcomes', () => {
  it('returns the data of a successful request', async () => {
    const client = clientWith(async () =>
      new Response(JSON.stringify({ success: true, data: user, error: null, meta: { request_id: 'r' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    await expect(call(client.GET('/identity/me'))).resolves.toEqual(user);
  });

  it('keeps a caller cancellation before the response as an abort, not a network error', async () => {
    const client = clientWith(pending);
    const controller = new AbortController();
    const outcome = call(client.GET('/identity/me', { signal: controller.signal })).catch((e: unknown) => e);
    controller.abort();
    const error = await outcome;
    expect(isAbortError(error)).toBe(true);
    expect(error).not.toBeInstanceOf(ApiError);
  });

  it('keeps a cancellation while the request is in flight as an abort', async () => {
    const client = clientWith(pending);
    const controller = new AbortController();
    const outcome = call(client.GET('/identity/me', { signal: controller.signal })).catch((e: unknown) => e);
    await new Promise((r) => setTimeout(r, 30)); // let the request reach fetch
    controller.abort();
    const error = await outcome;
    expect(isAbortError(error)).toBe(true);
    expect(error).not.toBeInstanceOf(ApiError);
  });

  it('keeps a signal that was already aborted as an abort', async () => {
    const client = clientWith(pending);
    const controller = new AbortController();
    controller.abort();
    const error = await call(client.GET('/identity/me', { signal: controller.signal })).catch((e: unknown) => e);
    expect(isAbortError(error)).toBe(true);
  });

  it('reports a timeout-triggered abort as TIMEOUT', async () => {
    const client = clientWith(pending, 20);
    const error = (await call(client.GET('/identity/me')).catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('TIMEOUT');
  });

  it('still reports a genuine network failure as NETWORK_ERROR', async () => {
    const client = clientWith(async () => {
      throw new TypeError('Network request failed');
    });
    const error = (await call(client.GET('/identity/me')).catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('NETWORK_ERROR');
  });
});
