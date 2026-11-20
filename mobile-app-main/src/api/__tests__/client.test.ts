import { call, callNoContent, callPage, createApiClient, tenantHeader } from '../client';
import { ApiError } from '../errors';

type Handler = (request: Request) => Response | Promise<Response>;

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function clientWith(handler: Handler, timeoutMs = 1_000) {
  const seen: Request[] = [];
  const fakeFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init);
    seen.push(request);
    if (init?.signal) {
      return await new Promise<Response>((resolve, reject) => {
        init.signal!.addEventListener('abort', () => reject(new Error('aborted')));
        Promise.resolve(handler(request)).then(resolve, reject);
      });
    }
    return handler(request);
  }) as typeof fetch;
  return { client: createApiClient({ baseUrl: 'https://api.test', timeoutMs, fetch: fakeFetch }), seen };
}

const user = { id: 'u1', email: 's@futa.edu.ng', status: 'active', email_verified: true };
const ok = (data: unknown, meta: Record<string, unknown> = { request_id: 'r1' }) => ({
  success: true,
  data,
  error: null,
  meta,
});
const fail = (code: string, message = 'Nope', details: unknown = null) => ({
  success: false,
  data: null,
  error: { code, message, details },
  meta: { request_id: 'r-err' },
});

describe('call', () => {
  it('returns the envelope data and sends a request id', async () => {
    const { client, seen } = clientWith(() => json(200, ok(user)));
    await expect(call(client.GET('/identity/me'))).resolves.toEqual(user);
    expect(seen[0].url).toBe('https://api.test/identity/me');
    expect(seen[0].headers.get('X-Request-ID')).toMatch(/^[A-Za-z0-9._:-]{1,128}$/);
  });

  it('sends the tenant header the contract requires', async () => {
    const { client, seen } = clientWith(() => json(200, ok({ programme: null })));
    await call(client.GET('/academic/profile', { params: { header: tenantHeader('futa') } }));
    expect(seen[0].headers.get('X-Tenant-Slug')).toBe('futa');
  });

  it('turns an error envelope into an ApiError with field errors', async () => {
    const details = { fields: [{ field: 'body.email', code: 'invalid_format', message: 'Enter a valid email' }] };
    const { client } = clientWith(() => json(422, fail('VALIDATION_FAILED', 'Check the form', details)));
    const error = await call(client.GET('/identity/me')).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: 'VALIDATION_FAILED',
      message: 'Check the form',
      status: 422,
      requestId: 'r-err',
      fieldErrors: details.fields,
    });
  });

  it('reads an unknown code as INTERNAL_ERROR and hides its message', async () => {
    const { client } = clientWith(() => json(409, fail('SOMETHING_NEW', 'internal detail')));
    await expect(call(client.GET('/identity/me'))).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again.',
    });
  });

  it('never surfaces a non-envelope error body', async () => {
    const { client } = clientWith(
      () => new Response('<html>Bad gateway at 10.0.0.3</html>', { status: 502, headers: { 'X-Request-ID': 'h1' } }),
    );
    const error = (await call(client.GET('/identity/me')).catch((e: unknown) => e)) as ApiError;
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.message).not.toContain('10.0.0.3');
    expect(error.requestId).toBe('h1');
  });

  it('treats a 2xx without a success envelope as a failure', async () => {
    const { client } = clientWith(() => json(200, { reply: 'hi' }));
    await expect(call(client.GET('/identity/me'))).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
  });

  it('reads Retry-After on RATE_LIMITED', async () => {
    const { client } = clientWith(() => json(429, fail('RATE_LIMITED'), { 'Retry-After': '30' }));
    await expect(call(client.GET('/identity/me'))).rejects.toMatchObject({ code: 'RATE_LIMITED', retryAfter: 30 });
  });

  it('maps a transport failure to NETWORK_ERROR', async () => {
    const { client } = clientWith(() => {
      throw new TypeError('Network request failed');
    });
    const error = (await call(client.GET('/identity/me')).catch((e: unknown) => e)) as ApiError;
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.isNetwork).toBe(true);
  });

  it('times out a request that never answers', async () => {
    const { client } = clientWith(() => new Promise<Response>(() => {}), 20);
    await expect(call(client.GET('/identity/me'))).rejects.toMatchObject({ code: 'TIMEOUT' });
  });
});

describe('callPage', () => {
  it('returns items with pagination', async () => {
    const faculty = { id: 'f1', name: 'Computing', slug: 'soc' };
    const { client } = clientWith(() =>
      json(200, ok([faculty], { request_id: 'r', pagination: { total: 1, limit: 50, offset: 0 } })),
    );
    const page = await callPage(client.GET('/catalogue/faculties', { params: { header: tenantHeader('futa') } }));
    expect(page).toEqual({ items: [faculty], pagination: { total: 1, limit: 50, offset: 0 } });
  });

  it('rejects a list without pagination', async () => {
    const { client } = clientWith(() => json(200, ok([])));
    await expect(
      callPage(client.GET('/catalogue/faculties', { params: { header: tenantHeader('futa') } })),
    ).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
  });
});

describe('callNoContent', () => {
  it('accepts the bodyless 202 from registration', async () => {
    const { client } = clientWith(() => new Response(null, { status: 202 }));
    await expect(
      callNoContent(
        client.POST('/identity/users', { body: { email: 'a@b.co', password: 'pw' }, parseAs: 'text' }),
      ),
    ).resolves.toBeUndefined();
  });

  it('still reads the error envelope', async () => {
    const { client } = clientWith(() => json(429, fail('RATE_LIMITED')));
    await expect(
      callNoContent(
        client.POST('/identity/users', { body: { email: 'a@b.co', password: 'pw' }, parseAs: 'text' }),
      ),
    ).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });
});
