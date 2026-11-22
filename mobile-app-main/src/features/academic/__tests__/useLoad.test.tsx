import { act, renderHook, waitFor } from '@testing-library/react-native';

import { ApiError } from '@/api/errors';
import { useLoad } from '../useLoad';

const abortError = () => Object.assign(new Error('aborted'), { name: 'AbortError' });

describe('useLoad', () => {
  it('delivers the data of a successful load', async () => {
    const { result } = renderHook(() => useLoad('k', async () => 42));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.data).toBe(42);
  });

  it('shows a network failure as an error with its own message', async () => {
    const { result } = renderHook(() =>
      useLoad('k', async () => {
        throw new ApiError('NETWORK_ERROR', 'Cannot reach BUILD.', null, null);
      }),
    );
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error?.code).toBe('NETWORK_ERROR');
  });

  it('keeps a timeout distinct from a network failure', async () => {
    const { result } = renderHook(() =>
      useLoad('k', async () => {
        throw new ApiError('TIMEOUT', 'Too slow.', null, null);
      }),
    );
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error?.code).toBe('TIMEOUT');
  });

  it('aborts the request when the screen unmounts mid-request and never reports an error', async () => {
    let signal: AbortSignal | undefined;
    const loader = (s: AbortSignal) => {
      signal = s;
      return new Promise<number>((_, reject) => s.addEventListener('abort', () => reject(abortError())));
    };
    const { result, unmount } = renderHook(() => useLoad('k', loader));
    await waitFor(() => expect(signal).toBeDefined());
    expect(signal!.aborted).toBe(false);

    unmount();

    await waitFor(() => expect(signal!.aborted).toBe(true));
    expect(result.current.status).toBe('loading'); // last rendered state: no error was ever shown
    expect(result.current.error).toBeNull();
  });

  it('aborts the previous request when the key changes and shows only the new result', async () => {
    const signals: AbortSignal[] = [];
    const loader = (key: string) => (s: AbortSignal) => {
      signals.push(s);
      return key === 'a'
        ? new Promise<string>((_, reject) => s.addEventListener('abort', () => reject(abortError())))
        : Promise.resolve('b-data');
    };
    const { result, rerender } = renderHook(({ k }: { k: string }) => useLoad(k, loader(k)), { initialProps: { k: 'a' } });
    await waitFor(() => expect(signals).toHaveLength(1));
    act(() => rerender({ k: 'b' }));
    await waitFor(() => expect(result.current.data).toBe('b-data'));
    expect(signals[0].aborted).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('treats an abort that arrives for a live screen as cancelled, not as no connection', async () => {
    const { result } = renderHook(() =>
      useLoad('k', async () => {
        throw abortError();
      }),
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(result.current.status).toBe('loading');
    expect(result.current.error).toBeNull();
  });
});
