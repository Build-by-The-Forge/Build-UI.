import type { Assessment, AttemptPolicy } from '@/api/types';

/** Whole seconds left until the server's deadline, never negative. */
export function secondsRemaining(expiresAt: string, nowMs: number): number {
  const end = Date.parse(expiresAt);
  if (!Number.isFinite(end)) return 0;
  return Math.max(0, Math.ceil((end - nowMs) / 1000));
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** How many attempts the policy allows, in words. */
export function describeAttempts(policy: AttemptPolicy, used: number): string {
  if (policy.max_attempts === null) {
    return used === 0 ? 'Unlimited attempts' : `Unlimited attempts · ${used} used`;
  }
  if (policy.max_attempts === 1) return used >= 1 ? '1 attempt · used' : '1 attempt';
  return `${used} of ${policy.max_attempts} attempts used`;
}

/** When the student can read their result, in words. */
export function describeResultTiming(policy: AttemptPolicy): string {
  return policy.result_visibility === 'immediate'
    ? 'Your result is shown after you submit.'
    : 'Your result is shown once your results are released.';
}

/** True when the policy says another attempt can't be started. The server still decides. */
export function attemptsExhausted(assessment: Assessment): boolean {
  const { max_attempts: max } = assessment.attempt_policy;
  return max !== null && assessment.attempts_used >= max;
}

/** Student-facing wording for failures specific to CBT. */
export function describeCbtError(code: string, fallback: string): string {
  switch (code) {
    case 'ATTEMPT_LIMIT_REACHED':
      return 'You have used all your attempts for this assessment.';
    case 'ATTEMPT_EXPIRED':
      return 'Time is up for this attempt. Your saved answers are being marked.';
    case 'ATTEMPT_ALREADY_SUBMITTED':
      return 'This attempt has already been submitted.';
    case 'ATTEMPT_NOT_SUBMITTED':
      return 'Submit this attempt to see its result.';
    case 'RESULT_NOT_RELEASED':
      return 'Your result has not been released yet. Check back later.';
    case 'RESOURCE_NOT_FOUND':
      return 'This assessment is no longer available.';
    default:
      return fallback;
  }
}
