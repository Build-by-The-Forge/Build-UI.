import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { call, isAbortError } from '@/api/client';
import { Fonts } from '@/constants/theme';
import { getSessionManager } from '@/auth';
import { describeAuthError, noErrors, type FormErrors } from '@/auth/errorMessages';

const RESEND_COOLDOWN_S = 30;

type Props = {
  /** Where the code was sent. Shown to the student, and used to resend. */
  readonly email: string;
  readonly onVerified: () => void;
};

/**
 * Confirms an email address with the code from the verification email. Used
 * after signing up and when a signed-in student's email isn't confirmed yet.
 */
export function VerifyEmailPanel({ email, onVerified }: Props) {
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(noErrors);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  // Leaving the screen cancels a request in flight instead of updating a gone screen.
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    controller.current = new AbortController();
    const current = controller.current;
    return () => current.abort();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function verify() {
    if (busy) return;
    if (!token.trim()) {
      setErrors({ fields: { token: 'Enter the code from your email.' }, general: null });
      return;
    }
    setBusy(true);
    setErrors(noErrors);
    try {
      await call(getSessionManager().client.POST('/identity/verify-email', { body: { token: token.trim() }, signal: controller.current?.signal }));
      onVerified();
    } catch (error) {
      if (isAbortError(error)) return;
      setErrors(describeAuthError(error));
      setBusy(false);
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    setErrors(noErrors);
    setCooldown(RESEND_COOLDOWN_S);
    try {
      await call(getSessionManager().client.POST('/identity/resend-verification', { body: { email }, signal: controller.current?.signal }));
      setSent(true);
    } catch (error) {
      if (isAbortError(error)) return;
      setSent(false);
      setErrors(describeAuthError(error));
    }
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.body}>
        We sent a code to {email}. It usually arrives within a few seconds. Enter it here to confirm your address.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Code from your email"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        autoCorrect={false}
        value={token}
        onChangeText={setToken}
        editable={!busy}
        accessibilityLabel="Verification code"
      />
      {!!errors.fields.token && <Text accessibilityRole="alert" style={styles.error}>{errors.fields.token}</Text>}
      {!!errors.general && <Text accessibilityRole="alert" style={styles.error}>{errors.general}</Text>}
      {sent && cooldown > 0 && <Text style={styles.notice}>If an account exists for this address, a new code is on its way.</Text>}
      <Pressable style={styles.button} onPress={verify} disabled={busy} accessibilityRole="button" accessibilityState={{ busy }}>
        {busy ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Confirm email</Text>}
      </Pressable>
      <Pressable onPress={resend} disabled={cooldown > 0} accessibilityRole="button" style={styles.link}>
        <Text style={[styles.linkText, cooldown > 0 && styles.linkDisabled]}>
          {cooldown > 0 ? `Send a new code in ${cooldown}s` : 'Send a new code'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 12 },
  title: { fontFamily: Fonts.bold, fontSize: 18, color: '#1F2937' },
  body: { fontFamily: Fonts.regular, fontSize: 14, color: '#374151', lineHeight: 20 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 16,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#111827',
  },
  button: { height: 50, borderRadius: 20, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  link: { alignItems: 'center', paddingVertical: 6 },
  linkText: { fontFamily: Fonts.medium, fontSize: 14, color: '#1D4ED8' },
  linkDisabled: { color: '#6B7280' },
  error: { fontFamily: Fonts.medium, fontSize: 13, color: '#7F1D1D', backgroundColor: '#FEE2E2', borderRadius: 12, padding: 10 },
  notice: { fontFamily: Fonts.medium, fontSize: 13, color: '#1E3A8A', backgroundColor: '#DBEAFE', borderRadius: 12, padding: 10 },
});
