import { isAbortError } from '@/api/client';
import { ApiError } from '@/api/errors';

export type FormErrors = {
  /** Messages keyed by form field (`email`, `password`, `token`). */
  readonly fields: Readonly<Record<string, string>>;
  /** A message for the form as a whole, when no field explains it. */
  readonly general: string | null;
};

const NONE: FormErrors = { fields: {}, general: null };

/**
 * What to tell a student about a failed auth call. The backend's own message is
 * safe to show (the contract says so) but may change, so the wording here is
 * keyed on the stable code and only falls back to it.
 */
export function describeAuthError(error: unknown): FormErrors {
  // The student left the screen; there is nothing to tell them.
  if (isAbortError(error)) return NONE;
  if (!(error instanceof ApiError)) {
    return { fields: {}, general: 'Something went wrong. Please try again.' };
  }
  switch (error.code) {
    case 'AUTH_INVALID_CREDENTIALS':
      return {
        fields: {},
        general:
          "That email and password don't match. If you only just signed up, confirm your email first.",
      };
    case 'ACCOUNT_NOT_ACTIVE':
      return { fields: {}, general: "This account can't sign in right now." };
    case 'RATE_LIMITED':
      return {
        fields: {},
        general:
          error.retryAfter !== null
            ? `Too many attempts. Try again in ${Math.max(1, Math.ceil(error.retryAfter))} seconds.`
            : 'Too many attempts. Wait a moment and try again.',
      };
    case 'TOKEN_INVALID':
      return { fields: { token: 'That code has expired or was already used. Ask for a new one.' }, general: null };
    case 'VALIDATION_FAILED': {
      const fields: Record<string, string> = {};
      for (const f of error.fieldErrors) {
        const name = f.field.split('.').pop() ?? f.field;
        fields[name] ??= f.message;
      }
      return Object.keys(fields).length
        ? { fields, general: null }
        : { fields: {}, general: 'Check the details you entered and try again.' };
    }
    case 'NETWORK_ERROR':
    case 'TIMEOUT':
      return { fields: {}, general: error.message };
    default:
      return { fields: {}, general: error.message };
  }
}

export const noErrors = NONE;
