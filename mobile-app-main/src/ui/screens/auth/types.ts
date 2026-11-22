/**
 * Same shape as `FormErrors` in the mobile-client lane's src/auth/errorMessages.ts,
 * so a route can pass its state straight through.
 */
export type AuthFormErrors = {
  readonly fields: Readonly<Record<string, string | undefined>>;
  readonly general: string | null;
};

export const NO_AUTH_ERRORS: AuthFormErrors = { fields: {}, general: null };
