import { createApiClient } from '@/api/client';
import { createAcademicApi, fetchAll, levelsFor, MAX_ITEMS } from '../api';

const page = <T,>(items: T[], total: number, limit = 100, offset = 0) => ({
  items,
  pagination: { total, limit, offset },
});

describe('fetchAll', () => {
  it('reads every page in order', async () => {
    const load = jest.fn(async (_limit: number, offset: number) =>
      offset === 0 ? page([1, 2], 3) : page([3], 3, 100, offset),
    );
    // PAGE_SIZE is 100, so a total of 3 fits one page: a second call must not happen.
    await expect(fetchAll(load)).resolves.toEqual([1, 2]);
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(100, 0);
  });

  it('continues while the total says there is more', async () => {
    const all = Array.from({ length: 230 }, (_, i) => i);
    const load = jest.fn(async (limit: number, offset: number) => page(all.slice(offset, offset + limit), all.length, limit, offset));
    const result = await fetchAll(load);
    expect(result).toHaveLength(230);
    expect(load.mock.calls.map((c) => c[1])).toEqual([0, 100, 200]);
  });

  it('stops on an empty page even if the total is wrong', async () => {
    const load = jest.fn(async () => page<number>([], 999));
    await expect(fetchAll(load)).resolves.toEqual([]);
    expect(load).toHaveBeenCalledTimes(1);
  });
});

describe('fetchAll limits', () => {
  it('fails instead of returning a cut-short list when the backend has more than the limit', async () => {
    const load = jest.fn(async (limit: number, offset: number) =>
      page(Array.from({ length: limit }, (_, i) => offset + i), MAX_ITEMS + 1, limit, offset),
    );
    await expect(fetchAll(load)).rejects.toMatchObject({ code: 'INTERNAL_ERROR', message: expect.stringContaining('too long') });
    expect(load).toHaveBeenCalledTimes(1); // it says so at once, without reading 2,000 items first
  });

  it('still returns a list exactly at the limit, in full', async () => {
    const all = Array.from({ length: MAX_ITEMS }, (_, i) => i);
    const load = jest.fn(async (limit: number, offset: number) => page(all.slice(offset, offset + limit), all.length, limit, offset));
    await expect(fetchAll(load)).resolves.toHaveLength(MAX_ITEMS);
  });
});

describe('createAcademicApi', () => {
  const envelope = (data: unknown, pagination?: unknown) =>
    new Response(
      JSON.stringify({ success: true, data, error: null, meta: { request_id: 'r', ...(pagination ? { pagination } : {}) } }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );

  function setup(respond: (request: Request) => Response) {
    const seen: Request[] = [];
    const fake = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      seen.push(request);
      return respond(request);
    }) as typeof fetch;
    const client = createApiClient({ baseUrl: 'https://api.test', timeoutMs: 1000, fetch: fake });
    return { api: createAcademicApi(client, 'futa'), seen };
  }

  it('asks for a department\'s programmes with the tenant header and filter', async () => {
    const { api, seen } = setup(() => envelope([], { total: 0, limit: 100, offset: 0 }));
    await api.programmes('dep-1');
    const url = new URL(seen[0].url);
    expect(url.pathname).toBe('/catalogue/programmes');
    expect(url.searchParams.get('department_id')).toBe('dep-1');
    expect(url.searchParams.get('limit')).toBe('100');
    expect(seen[0].headers.get('X-Tenant-Slug')).toBe('futa');
  });

  it('puts the whole profile as one body', async () => {
    const profile = { programme: null, department: null, faculty: null, level: 300, courses: [], complete: false, updated_at: null };
    const { api, seen } = setup(() => envelope(profile));
    const saved = await api.saveProfile({ programme_id: 'p1', level: 300, course_ids: ['c1', 'c2'] });
    expect(saved.level).toBe(300);
    expect(seen[0].method).toBe('PUT');
    expect(await seen[0].json()).toEqual({ programme_id: 'p1', level: 300, course_ids: ['c1', 'c2'] });
  });

  it('surfaces VALIDATION_FAILED from a rejected profile', async () => {
    const { api } = setup(
      () =>
        new Response(
          JSON.stringify({
            success: false,
            data: null,
            error: { code: 'VALIDATION_FAILED', message: 'x', details: { fields: [{ field: 'body.course_ids', code: 'invalid', message: 'A course is not available' }] } },
            meta: { request_id: 'r' },
          }),
          { status: 422, headers: { 'Content-Type': 'application/json' } },
        ),
    );
    await expect(api.saveProfile({ programme_id: 'p', level: 100, course_ids: ['gone'] })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      fieldErrors: [{ field: 'body.course_ids', message: 'A course is not available' }],
    });
  });
});

describe('levelsFor', () => {
  it('offers one level per year of the programme', () => {
    expect(levelsFor({ duration_years: 5 })).toEqual([100, 200, 300, 400, 500]);
    expect(levelsFor({ duration_years: 4 })).toEqual([100, 200, 300, 400]);
  });
  it('offers the full range when the programme is unknown', () => {
    expect(levelsFor(null)).toEqual([100, 200, 300, 400, 500, 600]);
  });
  it('never offers a level outside the contract range', () => {
    expect(levelsFor({ duration_years: 9 })).toHaveLength(6);
    expect(levelsFor({ duration_years: 0 })).toEqual([100]);
  });
});
