import React from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme/glass/tokens';
import { GlassButton, GlassCheckbox, GlassInput, GlassNotice } from '@/ui/glass';

import { AuthLayout } from './AuthLayout';
import { FooterLink } from './LoginView';
import type { AuthFormErrors } from './types';

export type SignUpViewProps = {
  email: string;
  password: string;
  confirm: string;
  agreed: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onAgreedChange: (value: boolean) => void;
  onSubmit: () => void;
  onGoToLogin: () => void;
  /** Open the documents; when absent the names show as plain text. */
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  /** Password rule from the backend contract, if the route knows it. Never invented here. */
  passwordHint?: string;
  busy: boolean;
  errors: AuthFormErrors;
};

/** Create an account. Presentation only; the route owns sign-up and validation. */
export function SignUpView(p: SignUpViewProps) {
  return (
    <AuthLayout
      testID="signup-view"
      title="Create your account"
      subtitle="Study smarter with your own course materials."
      footer={<FooterLink prompt="Already have an account?" action="Sign in" onPress={p.onGoToLogin} />}
    >
      {p.errors.general ? <GlassNotice tone="danger" message={p.errors.general} testID="signup-error" /> : null}
      <GlassInput
        label="Email address"
        icon="mail-outline"
        value={p.email}
        onChangeText={p.onEmailChange}
        error={p.errors.fields.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        textContentType="emailAddress"
        editable={!p.busy}
      />
      <GlassInput
        label="Password"
        icon="lock-closed-outline"
        value={p.password}
        onChangeText={p.onPasswordChange}
        error={p.errors.fields.password}
        hint={p.passwordHint}
        secret
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!p.busy}
      />
      <GlassInput
        label="Confirm password"
        icon="lock-closed-outline"
        value={p.confirm}
        onChangeText={p.onConfirmChange}
        error={p.errors.fields.confirm}
        secret
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={p.onSubmit}
        editable={!p.busy}
      />
      <GlassCheckbox
        checked={p.agreed}
        onChange={p.onAgreedChange}
        label="I agree to the Terms of Service and Privacy Policy"
        error={p.errors.fields.agreed}
        disabled={p.busy}
        testID="signup-agree"
      />
      {p.onOpenTerms || p.onOpenPrivacy ? (
        <View style={styles.docs}>
          {p.onOpenTerms ? <GlassButton label="Read the Terms" variant="ghost" onPress={p.onOpenTerms} /> : null}
          {p.onOpenPrivacy ? <GlassButton label="Read the Privacy Policy" variant="ghost" onPress={p.onOpenPrivacy} /> : null}
        </View>
      ) : null}
      <GlassButton label="Create account" onPress={p.onSubmit} loading={p.busy} testID="signup-submit" />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  docs: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: -space.sm },
});
