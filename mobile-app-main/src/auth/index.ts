import { randomUUID } from 'expo-crypto';

import { apiConfig } from '@/api/config';
import { SessionManager } from './sessionManager';
import { createSecureTokenStore } from './tokenStore';

const signOutHandlers = new Set<() => void>();

/**
 * Registers a function that runs on every sign-out (chosen, expired or
 * revoked). Per-student caches belong here: nothing a signed-out device holds
 * may belong to the previous student.
 */
export function onSignedOut(handler: () => void): () => void {
  signOutHandlers.add(handler);
  return () => signOutHandlers.delete(handler);
}

let manager: SessionManager | null = null;

export function getSessionManager(): SessionManager {
  if (!manager) {
    const config = apiConfig();
    manager = new SessionManager({
      baseUrl: config.baseUrl,
      timeoutMs: config.timeoutMs,
      store: createSecureTokenStore(randomUUID),
      onSignedOut: () => {
        for (const handler of [...signOutHandlers]) handler();
      },
    });
  }
  return manager;
}

/** The authenticated API client every feature uses. */
export function api() {
  return getSessionManager().client;
}
