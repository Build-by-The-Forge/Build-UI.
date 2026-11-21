import { AppState } from 'react-native';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { apiConfig } from '@/api/config';
import { isAbortError } from '@/api/client';
import { getSessionManager } from './index';
import { gateFor, type AccessState, type Gate } from './routeGate';
import type { SessionStatus, SignedOutReason } from './sessionManager';
import { ensureTenantAccess } from './tenant';

type SessionContextValue = {
  readonly status: SessionStatus;
  readonly reason: SignedOutReason;
  readonly access: AccessState;
  readonly gate: Gate;
  /** The signed-in student's email, once known (for the verification screen). */
  readonly email: string | null;
  readonly signIn: (email: string, password: string) => Promise<void>;
  readonly signUp: (email: string, password: string) => Promise<void>;
  readonly signOut: () => Promise<void>;
  /** Re-run the launch restore, or the tenant check, after a failure. */
  readonly retry: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const manager = getSessionManager();
  const snapshot = useSyncExternalStore(manager.subscribe, manager.getSnapshot, manager.getSnapshot);
  const [access, setAccess] = useState<AccessState>('idle');
  const [email, setEmail] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    void manager.bootstrap();
  }, [manager]);

  // Check tenant membership whenever a session appears (sign-in or restore).
  const signedIn = snapshot.status === 'signedIn';
  useEffect(() => {
    if (!signedIn) {
      setAccess('idle');
      setEmail(null);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setAccess('checking');
    ensureTenantAccess(manager.client, apiConfig().tenantSlug, controller.signal).then(
      (result) => {
        if (cancelled) return;
        setEmail(result.email);
        setAccess(result.access);
      },
      (error: unknown) => {
        // A check we cancelled (signed out, unmounted) says nothing about the network.
        if (!cancelled && !isAbortError(error)) setAccess('error');
      },
    );
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [signedIn, manager, attempt, snapshot.userId]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void manager.resume();
    });
    return () => subscription.remove();
  }, [manager]);

  const retry = useCallback(() => {
    if (manager.getSnapshot().status === 'unreachable') void manager.retry();
    else setAttempt((n) => n + 1);
  }, [manager]);

  const value = useMemo<SessionContextValue>(
    () => ({
      status: snapshot.status,
      reason: snapshot.reason,
      access,
      gate: gateFor(snapshot.status, access),
      email,
      signIn: (e, p) => manager.signIn(e, p),
      signUp: (e, p) => manager.signUp(e, p),
      signOut: () => manager.signOut(),
      retry,
    }),
    [snapshot.status, snapshot.reason, access, email, manager, retry],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used within a SessionProvider');
  return value;
}
