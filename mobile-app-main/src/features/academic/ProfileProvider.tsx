import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { apiConfig } from '@/api/config';
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
  /** Replaces the profile on the backend and keeps what it returns. Throws ApiError. */
  readonly save: (update: AcademicProfileUpdate) => Promise<AcademicProfile>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Holds the student's academic profile, read from /academic/profile once they
 * are in the app and dropped the moment they sign out.
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { gate } = useSession();
  const api = useMemo(() => createAcademicApi(getSessionManager().client, apiConfig().tenantSlug), []);
  const [status, setStatus] = useState<ProfileStatus>('idle');
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const inApp = gate === 'app';

  useEffect(() => {
    if (!inApp) {
      setStatus('idle');
      setProfile(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api.getProfile().then(
      (value) => {
        if (cancelled) return;
        setProfile(value);
        setStatus('ready');
      },
      (e: unknown) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e : new ApiError('INTERNAL_ERROR', 'Something went wrong. Please try again.', null, null));
        setStatus('error');
      },
    );
    return () => {
      cancelled = true;
    };
  }, [inApp, api, attempt]);

  const save = useCallback(
    async (update: AcademicProfileUpdate) => {
      const saved = await api.saveProfile(update);
      setProfile(saved);
      setStatus('ready');
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
