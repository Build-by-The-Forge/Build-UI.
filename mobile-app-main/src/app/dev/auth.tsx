/**
 * Development-only preview of the auth views in their states, with local
 * sample input. Release builds redirect away. Real screens get their state
 * from the session (mobile-client lane); nothing here talks to the backend.
 * Open /dev/auth?state=login-error (states listed in STATES).
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

import { LoginView, NO_AUTH_ERRORS, SignUpView, VerifyEmailView } from '@/ui/screens/auth';

const STATES = ['login', 'login-error', 'login-expired', 'login-busy', 'signup', 'signup-errors', 'verify', 'verify-wait'] as const;
type State = (typeof STATES)[number];

const noop = () => {};

export default function AuthPreview() {
  const params = useLocalSearchParams<{ state?: string }>();
  const state: State = (STATES as readonly string[]).includes(params.state ?? '') ? (params.state as State) : 'login';
  const [email, setEmail] = useState(state.startsWith('verify') ? '' : 'student@futa.edu.ng');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState('');
  if (!__DEV__) return <Redirect href="/" />;

  const go = (next: State) => router.setParams({ state: next });

  if (state.startsWith('signup')) {
    return (
      <SignUpView
        email={email}
        password={password}
        confirm={confirm}
        agreed={agreed}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmChange={setConfirm}
        onAgreedChange={setAgreed}
        onSubmit={() => go('verify')}
        onGoToLogin={() => go('login')}
        onOpenTerms={noop}
        onOpenPrivacy={noop}
        busy={false}
        errors={
          state === 'signup-errors'
            ? {
                fields: { confirm: 'The passwords do not match.', agreed: 'Agree to the Terms and Privacy Policy to continue.' },
                general: null,
              }
            : NO_AUTH_ERRORS
        }
      />
    );
  }
  if (state.startsWith('verify')) {
    return (
      <VerifyEmailView
        email="student@futa.edu.ng"
        code={code}
        onCodeChange={setCode}
        onSubmit={() => go('login')}
        onResend={noop}
        onBack={() => go('signup')}
        busy={false}
        resendInSeconds={state === 'verify-wait' ? 42 : 0}
        errors={NO_AUTH_ERRORS}
      />
    );
  }
  return (
    <LoginView
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={noop}
      onGoToSignUp={() => go('signup')}
      busy={state === 'login-busy'}
      notice={state === 'login-expired' ? 'Your session ended. Sign in again to continue.' : null}
      errors={
        state === 'login-error'
          ? { fields: {}, general: "That email and password don't match. If you only just signed up, confirm your email first." }
          : NO_AUTH_ERRORS
      }
    />
  );
}
