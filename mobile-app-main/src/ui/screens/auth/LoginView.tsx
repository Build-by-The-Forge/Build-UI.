import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { space, TOUCH_TARGET } from '@/theme/glass/tokens';
import { AppText, GlassButton, GlassInput, GlassNotice } from '@/ui/glass';

import { AuthLayout } from './AuthLayout';
import type { AuthFormErrors } from './types';

export type LoginViewProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoToSignUp: () => void;
  busy: boolean;
  errors: AuthFormErrors;
  /** Informational line, e.g. "Your session ended. Sign in again to continue." */
  notice?: string | null;
};

/**
 * Sign in. Presentation only: the route owns the session call, validation
 * and navigation (mobile-client lane) and passes state in.
 */
export function LoginView({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoToSignUp,
  busy,
  errors,
  notice,
}: LoginViewProps) {
  return (
    <AuthLayout
      testID="login-view"
      title="Welcome back"
      subtitle="Continue your learning journey."
      footer={<FooterLink prompt="New to BUILD?" action="Create an account" onPress={onGoToSignUp} />}
    >
      {notice && !errors.general ? <GlassNotice tone="info" message={notice} /> : null}
      {errors.general ? <GlassNotice tone="danger" message={errors.general} testID="login-error" /> : null}
      <GlassInput
        label="Email address"
        icon="mail-outline"
        value={email}
        onChangeText={onEmailChange}
        error={errors.fields.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        textContentType="emailAddress"
        returnKeyType="next"
        editable={!busy}
      />
      <GlassInput
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={onPasswordChange}
        error={errors.fields.password}
        secret
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        editable={!busy}
      />
      <GlassButton label="Sign in" onPress={onSubmit} loading={busy} testID="login-submit" />
    </AuthLayout>
  );
}

export function FooterLink({ prompt, action, onPress }: { prompt: string; action: string; onPress: () => void }) {
  return (
    <View style={styles.footer}>
      <AppText tone="secondary">{prompt}</AppText>
      <Pressable accessibilityRole="link" accessibilityLabel={action} onPress={onPress} style={styles.link} hitSlop={4}>
        <AppText variant="bodyStrong" tone="accent">
          {action}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', columnGap: space.xs },
  link: { minHeight: TOUCH_TARGET, justifyContent: 'center', paddingHorizontal: space.xs },
});
