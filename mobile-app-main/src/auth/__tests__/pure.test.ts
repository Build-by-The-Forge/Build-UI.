import type { ApiClient } from '@/api/client';
import { ApiError } from '@/api/errors';
import { describeAuthError } from '../errorMessages';
import { gateFor } from '../routeGate';
import { ensureTenantAccess } from '../tenant';

describe('gateFor', () => {
  it('waits while the session is being restored or unreachable', () => {
    expect(gateFor('loading', 'idle')).toBe('wait');
    expect(gateFor('unreachable', 'idle')).toBe('wait');
  });
  it('keeps signed-out students in the auth screens', () => {
    expect(gateFor('signedOut', 'idle')).toBe('auth');
    expect(gateFor('signedOut', 'ready')).toBe('auth'); // a stale access state never opens the app
  });
  it('opens the app only once tenant access is confirmed', () => {
    expect(gateFor('signedIn', 'idle')).toBe('wait');
    expect(gateFor('signedIn', 'checking')).toBe('wait');
    expect(gateFor('signedIn', 'error')).toBe('wait');
    expect(gateFor('signedIn', 'verify-email')).toBe('verify-email');
    expect(gateFor('signedIn', 'denied')).toBe('denied');
    expect(gateFor('signedIn', 'ready')).toBe('app');
  });
});

describe('describeAuthError', () => {
  const apiError = (code: ConstructorParameters<typeof ApiError>[0], retry: number | null = null) =>
    new ApiError(code, 'backend text', 400, 'r', [], retry);

  it('does not reveal whether an account exists', () => {
    expect(describeAuthError(apiError('AUTH_INVALID_CREDENTIALS')).general).toContain('match');
  });
  it('maps field errors to their form fields', () => {
    const e = new ApiError('VALIDATION_FAILED', 'm', 422, 'r', [
      { field: 'body.email', code: 'invalid_format', message: 'Enter a valid email' },
    ]);
    expect(describeAuthError(e)).toEqual({ fields: { email: 'Enter a valid email' }, general: null });
  });
  it('tells the student how long to wait', () => {
    expect(describeAuthError(apiError('RATE_LIMITED', 29.2)).general).toContain('30 seconds');
  });
  it('shows network messages and hides unknown ones', () => {
    expect(describeAuthError(new ApiError('NETWORK_ERROR', 'Cannot reach BUILD.', null, null)).general).toBe('Cannot reach BUILD.');
    expect(describeAuthError(new Error('boom at 10.0.0.1')).general).toBe('Something went wrong. Please try again.');
  });
});

describe('ensureTenantAccess', () => {
  const ok = (data: unknown) => ({
    data: { success: true, data, error: null, meta: { request_id: 'r' } },
    response: new Response(null, { status: 200 }),
  });
  const fail = (code: string) => ({
    error: { success: false, data: null, error: { code, message: 'm', details: null }, meta: { request_id: 'r' } },
    response: new Response(null, { status: 403 }),
  });
  const user = (verified: boolean) => ({ id: 'u', email: 's@x.ng', status: 'active', email_verified: verified });
  const membership = { tenant_slug: 'futa', tenant_name: 'FUTA', membership_id: 'm', role: 'student' };
  const client = (over: { me?: unknown; memberships?: unknown; join?: unknown }) =>
    ({
      GET: jest.fn(async (path: string) => (path === '/identity/me' ? over.me : over.memberships)),
      POST: jest.fn(async () => over.join),
    }) as unknown as ApiClient;

  it('asks for verification before touching tenants', async () => {
    const c = client({ me: ok(user(false)) });
    await expect(ensureTenantAccess(c, 'futa')).resolves.toEqual({ access: 'verify-email', email: 's@x.ng' });
    expect(c.POST).not.toHaveBeenCalled();
  });
  it('is ready when the membership exists, without joining again', async () => {
    const c = client({ me: ok(user(true)), memberships: ok([membership]) });
    await expect(ensureTenantAccess(c, 'futa')).resolves.toMatchObject({ access: 'ready' });
    expect(c.POST).not.toHaveBeenCalled();
  });
  it('joins a new student', async () => {
    const c = client({ me: ok(user(true)), memberships: ok([]), join: ok(membership) });
    await expect(ensureTenantAccess(c, 'futa')).resolves.toMatchObject({ access: 'ready' });
    expect(c.POST).toHaveBeenCalledTimes(1);
  });
  it('reports a refused join as denied', async () => {
    const c = client({ me: ok(user(true)), memberships: ok([]), join: fail('TENANT_ACCESS_DENIED') });
    await expect(ensureTenantAccess(c, 'futa')).resolves.toMatchObject({ access: 'denied' });
  });
  it('sends a join that needs verification to the verification screen', async () => {
    const c = client({ me: ok(user(true)), memberships: ok([]), join: fail('EMAIL_VERIFICATION_REQUIRED') });
    await expect(ensureTenantAccess(c, 'futa')).resolves.toMatchObject({ access: 'verify-email' });
  });
  it('rethrows anything else so the screen can offer a retry', async () => {
    const c = client({ me: ok(user(true)), memberships: ok([]), join: fail('INTERNAL_ERROR') });
    await expect(ensureTenantAccess(c, 'futa')).rejects.toBeInstanceOf(ApiError);
  });
});
