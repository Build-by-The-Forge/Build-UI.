import React from 'react';

import { AppText, GlassButton, GlassInput, GlassNotice } from '@/ui/glass';

import { AuthLayout } from './AuthLayout';
import { FooterLink } from './LoginView';
import type { AuthFormErrors } from './types';

export type VerifyEmailViewProps = {
  email: string;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
  busy: boolean;
  /** Seconds before another code may be requested; 0 means now. */
  resendInSeconds?: number;
  /** Shown after a resend succeeds. */
  resentNotice?: string | null;
  errors: AuthFormErrors;
};

/** Confirm the email address with the code the backend sent. */
export function VerifyEmailView(p: VerifyEmailViewProps) {
  const wait = p.resendInSeconds ?? 0;
  return (
    <AuthLayout
      testID="verify-view"
      title="Check your email"
      subtitle={`We sent a code to ${p.email}. Enter it to finish creating your account.`}
      footer={<FooterLink prompt="Wrong email?" action="Go back" onPress={p.onBack} />}
    >
      {p.errors.general ? <GlassNotice tone="danger" message={p.errors.general} /> : null}
      {p.resentNotice && !p.errors.general ? <GlassNotice tone="success" message={p.resentNotice} /> : null}
      <GlassInput
        label="Verification code"
        icon="key-outline"
        value={p.code}
        onChangeText={p.onCodeChange}
        error={p.errors.fields.token}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        onSubmitEditing={p.onSubmit}
        editable={!p.busy}
      />
      <GlassButton label="Verify email" onPress={p.onSubmit} loading={p.busy} testID="verify-submit" />
      <GlassButton
        label={wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
        variant="ghost"
        onPress={p.onResend}
        disabled={p.busy || wait > 0}
      />
      <AppText variant="caption" tone="secondary" align="center">
        Can&apos;t find it? Check your spam folder.
      </AppText>
    </AuthLayout>
  );
}
