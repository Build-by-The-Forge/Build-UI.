import { useCallback, useEffect, useEffectEvent, useState } from 'react';

import { isAbortError } from '@/api/client';
import { ApiError } from '@/api/errors';

export type LoadState<T> =
  | { readonly status: 'loading'; readonly data: null; readonly error: null }
  | { readonly status: 'ready'; readonly data: T; readonly error: null }
  | { readonly status: 'error'; readonly data: null; readonly error: ApiError };

/**
 * Runs an async read when `key` changes and whenever `reload` is called, and
 * ignores a result that arrives after the key moved on. A null key waits.
 * Leaving the screen aborts the signal given to `load`, and a request that
 * ends in an abort is never reported as a failure.
 */
export function useLoad<T>(key: string | null, load: (signal: AbortSignal) => Promise<T>): LoadState<T> & { reload: () => void } {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  // Always the latest loader, without making it a dependency of the effect.
  const run = useEffectEvent((signal: AbortSignal) => load(signal));

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    const controller = new AbortController();
    setState({ status: 'loading', data: null, error: null });
    run(controller.signal).then(
      (data) => {
        if (!cancelled) setState({ status: 'ready', data, error: null });
      },
      (error: unknown) => {
        if (cancelled || isAbortError(error)) return;
        const apiError =
          error instanceof ApiError ? error : new ApiError('INTERNAL_ERROR', 'Something went wrong. Please try again.', null, null);
        setState({ status: 'error', data: null, error: apiError });
      },
    );
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
