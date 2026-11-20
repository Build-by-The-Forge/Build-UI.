import type { SessionStatus } from './sessionManager';
import type { TenantAccess } from './tenant';

export type AccessState = 'idle' | 'checking' | TenantAccess | 'error';

/**
 * Which part of the app a student may be in. The navigator hides every other
 * part, so a signed-out student can't reach a dashboard route by a deep link
 * or the back button. This is navigation, not authorization: the backend
 * refuses what the student may not do regardless.
 */
export type Gate = 'wait' | 'auth' | 'verify-email' | 'denied' | 'app';

export function gateFor(status: SessionStatus, access: AccessState): Gate {
  if (status === 'loading' || status === 'unreachable') return 'wait';
  if (status === 'signedOut') return 'auth';
  if (access === 'ready') return 'app';
  if (access === 'verify-email') return 'verify-email';
  if (access === 'denied') return 'denied';
  return 'wait'; // idle, checking, or a failed check (shown with a retry)
}
