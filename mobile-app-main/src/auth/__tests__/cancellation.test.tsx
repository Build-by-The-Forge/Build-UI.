import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { createApiClient, isAbortError } from '@/api/client';
import { ApiError } from '@/api/errors';
import { VerifyEmailPanel } from '@/components/auth/VerifyEmailPanel';
import { describeAuthError } from '../errorMessages';
import { ensureTenantAccess } from '../tenant';

jest.setTimeout(30000);

/** A backend that never answers but honours the abort signal, like real fetch. */
function hangingClient(onStart?: (signal: AbortSignal) => void) {
  const fake = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const signal = (init?.signal ?? (input as Request).signal) as AbortSignal;
    onStart?.(signal);
    return new Promise<Response>((_, reject) => {
      const abort = () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
      if (signal.aborted) return abort();
      signal.addEventListener('abort', abort);
    });
  }) as typeof fetch;
  return createApiClient({ baseUrl: 'https://api.test', timeoutMs: 10_000, fetch: fake });
}

const mockClient = { current: hangingClient() };
jest.mock('@/auth', () => ({
  getSessionManager: () => ({ client: mockClient.current }),
}));
jest.mock('@/constants/theme', () => ({ Fonts: new Proxy({}, { get: () => 'System' }) }));

describe('a cancelled auth request', () => {
  it('is not described to the student', () => {
    const abort = Object.assign(new Error('x'), { name: 'AbortError' });
    expect(describeAuthError(abort)).toEqual({ fields: {}, general: null });
    // ...while a real network failure still is.
    expect(describeAuthError(new ApiError('NETWORK_ERROR', 'Cannot reach BUILD.', null, null)).general).toBe('Cannot reach BUILD.');
  });

  it('stays an abort when the tenant check is cancelled', async () => {
    const client = hangingClient();
    const controller = new AbortController();
    const pending = ensureTenantAccess(client, 'futa', controller.signal).catch((e: unknown) => e);
    await new Promise((r) => setTimeout(r, 20));
    controller.abort();
    const error = await pending;
    expect(isAbortError(error)).toBe(true);
    expect(error).not.toBeInstanceOf(ApiError);
  });
});

describe('VerifyEmailPanel unmounting mid-request', () => {
  it('cancels the request and shows nothing, not "Cannot reach BUILD"', async () => {
    let signal: AbortSignal | undefined;
    mockClient.current = hangingClient((s) => (signal = s));
    const onVerified = jest.fn();
    const view = render(<VerifyEmailPanel email="s@x.ng" onVerified={onVerified} />);
    fireEvent.changeText(screen.getByLabelText('Verification code'), 'abc123');
    fireEvent.press(screen.getByText('Confirm email'));
    await waitFor(() => expect(signal).toBeDefined());
    expect(signal!.aborted).toBe(false);

    view.unmount();

    await waitFor(() => expect(signal!.aborted).toBe(true));
    expect(onVerified).not.toHaveBeenCalled();
  });
});
