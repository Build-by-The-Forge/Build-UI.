import type { Assessment } from '@/api/types';
import { createApiClient } from '@/api/client';
import { createCbtApi } from '../api';
import {
  attemptsExhausted,
  describeAttempts,
  describeCbtError,
  describeResultTiming,
  formatClock,
  secondsRemaining,
} from '../present';

const ok = (data: unknown, extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ success: true, data, error: null, meta: { request_id: 'r', ...extra } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

function setup(respond: (request: Request) => Response) {
  const seen: Request[] = [];
  const fake = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(String(input), init);
    seen.push(request);
    return respond(request);
  }) as typeof fetch;
  const client = createApiClient({ baseUrl: 'https://api.test', timeoutMs: 1000, fetch: fake });
  return { api: createCbtApi(client, 'futa'), seen };
}

describe('createCbtApi', () => {
  it('lists published assessments for a course with the tenant header', async () => {
    const { api, seen } = setup(() => ok([], { pagination: { total: 0, limit: 100, offset: 0 } }));
    await api.assessments('course-1');
    const url = new URL(seen[0].url);
    expect(url.pathname).toBe('/assessment/assessments');
    expect(url.searchParams.get('course_id')).toBe('course-1');
    expect(seen[0].headers.get('X-Tenant-Slug')).toBe('futa');
  });

  it('starts an attempt with a POST and no body', async () => {
    const { api, seen } = setup(() => ok({ id: 'a1' }));
    await api.startAttempt('as-1');
    expect(seen[0].method).toBe('POST');
    expect(new URL(seen[0].url).pathname).toBe('/assessment/assessments/as-1/attempts');
  });

  it('saves one answer with a PUT to that question', async () => {
    const { api, seen } = setup(() => ok({ attempt_id: 'a1' }));
    await api.saveAnswer('a1', 'q9', 2);
    expect(seen[0].method).toBe('PUT');
    expect(new URL(seen[0].url).pathname).toBe('/assessment/attempts/a1/answers/q9');
    expect(await seen[0].json()).toEqual({ selected_option_index: 2 });
  });

  it('submits and reads the result from their own routes', async () => {
    const { api, seen } = setup(() => ok({}));
    await api.submit('a1');
    await api.result('a1');
    expect(seen.map((r) => `${r.method} ${new URL(r.url).pathname}`)).toEqual([
      'POST /assessment/attempts/a1/submit',
      'GET /assessment/attempts/a1/result',
    ]);
  });

  it('carries RESULT_NOT_RELEASED through as an ApiError', async () => {
    const { api } = setup(
      () =>
        new Response(
          JSON.stringify({ success: false, data: null, error: { code: 'RESULT_NOT_RELEASED', message: 'm', details: null }, meta: { request_id: 'r' } }),
          { status: 409, headers: { 'Content-Type': 'application/json' } },
        ),
    );
    await expect(api.result('a1')).rejects.toMatchObject({ code: 'RESULT_NOT_RELEASED', status: 409 });
  });
});

describe('time', () => {
  const end = '2026-11-20T10:00:00Z';
  const at = (iso: string) => Date.parse(iso);
  it('counts down to the server deadline', () => {
    expect(secondsRemaining(end, at('2026-11-20T09:58:30Z'))).toBe(90);
  });
  it('rounds a part second up so the clock never shows 00:00 early', () => {
    expect(secondsRemaining(end, at('2026-11-20T09:59:59.200Z'))).toBe(1);
  });
  it('is zero at and after the deadline, and for a bad date', () => {
    expect(secondsRemaining(end, at('2026-11-20T10:00:00Z'))).toBe(0);
    expect(secondsRemaining(end, at('2026-11-20T10:05:00Z'))).toBe(0);
    expect(secondsRemaining('nope', 0)).toBe(0);
  });
  it('formats minutes and hours', () => {
    expect(formatClock(75)).toBe('01:15');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(-4)).toBe('00:00');
  });
});

describe('policy wording', () => {
  const policy = (over: Partial<Assessment['attempt_policy']>): Assessment['attempt_policy'] => ({
    kind: 'practice',
    max_attempts: 1,
    retake_after_submission: false,
    result_visibility: 'immediate',
    feedback_timing: 'immediate',
    scoring_policy: 'best',
    ...over,
  });
  it('describes attempts', () => {
    expect(describeAttempts(policy({}), 0)).toBe('1 attempt');
    expect(describeAttempts(policy({ max_attempts: 3, retake_after_submission: true }), 1)).toBe('1 of 3 attempts used');
    expect(describeAttempts(policy({ max_attempts: null, retake_after_submission: true }), 0)).toBe('Unlimited attempts');
  });
  it('describes when the result shows', () => {
    expect(describeResultTiming(policy({}))).toContain('after you submit');
    expect(describeResultTiming(policy({ result_visibility: 'after_release' }))).toContain('released');
  });
  it('knows when attempts are used up, without being the authority', () => {
    const base = { id: 'a', course_id: 'c', title: 't', instructions: '', duration_minutes: 10, passing_score: 50, question_count: 5 };
    expect(attemptsExhausted({ ...base, attempt_policy: policy({}), attempts_used: 1 })).toBe(true);
    expect(attemptsExhausted({ ...base, attempt_policy: policy({ max_attempts: null, retake_after_submission: true }), attempts_used: 9 })).toBe(false);
  });
  it('words CBT errors for students and passes unknown ones through', () => {
    expect(describeCbtError('ATTEMPT_LIMIT_REACHED', 'x')).toContain('used all your attempts');
    expect(describeCbtError('SOMETHING', 'fallback')).toBe('fallback');
  });
});
