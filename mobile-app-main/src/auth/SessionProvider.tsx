import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { apiConfig } from '@/api/config';
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
    setAccess('checking');
    ensureTenantAccess(manager.client, apiConfig().tenantSlug).then(
      (result) => {
        if (cancelled) return;
        setEmail(result.email);
        setAccess(result.access);
      },
      () => {
        if (!cancelled) setAccess('error');
      },
    );
    return () => {
      cancelled = true;
    };
  }, [signedIn, manager, attempt, snapshot.userId]);

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
