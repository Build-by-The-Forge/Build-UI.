import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import { apiConfig } from '@/api/config';
import { isAbortError } from '@/api/client';
import { ApiError } from '@/api/errors';
import type { AcademicProfile, AcademicProfileUpdate } from '@/api/types';
import { getSessionManager } from '@/auth';
import { useSession } from '@/auth/SessionProvider';
import { createAcademicApi, type AcademicApi } from './api';

export type ProfileStatus = 'idle' | 'loading' | 'ready' | 'error';

type ProfileContextValue = {
  readonly status: ProfileStatus;
  /** The backend's profile for this student. Null until it has been read. */
  readonly profile: AcademicProfile | null;
  readonly error: ApiError | null;
  readonly api: AcademicApi;
  readonly reload: () => void;
  /**
   * Replaces the profile on the backend and keeps what it returns, but only if
   * the student who started the save is still the one signed in. Throws ApiError.
   */
  readonly save: (update: AcademicProfileUpdate) => Promise<AcademicProfile>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

type Owner = { readonly key: string | null; readonly controller: AbortController };

/**
 * Holds the student's academic profile, read from /academic/profile once they
 * are in the app and dropped the moment they sign out.
 *
 * Everything in flight belongs to the session that started it. When the
 * signed-in student changes (or signs out), that session's requests are
 * aborted and a late answer can no longer write into state, so one student's
 * profile can never land in the next student's session.
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { gate } = useSession();
  const manager = getSessionManager();
  const snapshot = useSyncExternalStore(manager.subscribe, manager.getSnapshot, manager.getSnapshot);
  const api = useMemo(() => createAcademicApi(manager.client, apiConfig().tenantSlug), [manager]);
  const [status, setStatus] = useState<ProfileStatus>('idle');
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const inApp = gate === 'app';
  const sessionKey = inApp ? snapshot.userId : null;
  const owner = useRef<Owner>({ key: null, controller: new AbortController() });

  // A new session key means a new owner: abort what the old one had in flight.
  useEffect(() => {
    owner.current.controller.abort();
    owner.current = { key: sessionKey, controller: new AbortController() };
    return () => owner.current.controller.abort();
  }, [sessionKey]);

  useEffect(() => {
    if (!sessionKey) {
      setStatus('idle');
      setProfile(null);
      setError(null);
      return;
    }
    const mine = owner.current;
    setStatus('loading');
    setProfile(null);
    setError(null);
    api.getProfile(mine.controller.signal).then(
      (value) => {
        if (owner.current !== mine) return;
        setProfile(value);
        setStatus('ready');
      },
      (e: unknown) => {
        if (owner.current !== mine || isAbortError(e)) return;
        setError(e instanceof ApiError ? e : new ApiError('INTERNAL_ERROR', 'Something went wrong. Please try again.', null, null));
        setStatus('error');
      },
    );
  }, [sessionKey, api, attempt]);

  const save = useCallback(
    async (update: AcademicProfileUpdate) => {
      const mine = owner.current;
      const saved = await api.saveProfile(update, mine.controller.signal);
      if (owner.current === mine) {
        setProfile(saved);
        setStatus('ready');
      }
      return saved;
    },
    [api],
  );
  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const value = useMemo(
    () => ({ status, profile, error, api, reload, save }),
    [status, profile, error, api, reload, save],
  );
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useAcademicProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useAcademicProfile must be used within a ProfileProvider');
  return value;
}
