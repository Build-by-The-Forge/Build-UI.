import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { GlassThemeProvider } from '@/theme/glass/GlassThemeProvider';
import { LoginView, NO_AUTH_ERRORS, SignUpView, VerifyEmailView } from '@/ui/screens/auth';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

const wrap = (ui: React.ReactElement) => (
  <GlassThemeProvider scheme="light" initialPreference="opaque" signals={{ reduceMotion: false, reduceTransparency: false }}>
    {ui}
  </GlassThemeProvider>
);

const loginProps = {
  email: '',
  password: '',
  onEmailChange: jest.fn(),
  onPasswordChange: jest.fn(),
  onSubmit: jest.fn(),
  onGoToSignUp: jest.fn(),
  busy: false,
  errors: NO_AUTH_ERRORS,
};

describe('LoginView', () => {
  it('labels both fields and submits', () => {
    const onSubmit = jest.fn();
    render(wrap(<LoginView {...loginProps} onSubmit={onSubmit} />));
    expect(screen.getByLabelText('Email address')).toBeTruthy();
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
    fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('passes typing straight to the route', () => {
    const onEmailChange = jest.fn();
    render(wrap(<LoginView {...loginProps} onEmailChange={onEmailChange} />));
    fireEvent.changeText(screen.getByLabelText('Email address'), 'ada@futa.edu.ng');
    expect(onEmailChange).toHaveBeenCalledWith('ada@futa.edu.ng');
  });

  it('shows the general error as an alert and hides the notice behind it', () => {
    render(
      wrap(
        <LoginView
          {...loginProps}
          notice="Your session ended. Sign in again to continue."
          errors={{ fields: { email: 'Enter a valid email.' }, general: "That email and password don't match." }}
        />,
      ),
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText("That email and password don't match.")).toBeTruthy();
    expect(screen.getByText('Enter a valid email.')).toBeTruthy();
    expect(screen.queryByText('Your session ended. Sign in again to continue.')).toBeNull();
  });

  it('locks the form while busy', () => {
    const onSubmit = jest.fn();
    render(wrap(<LoginView {...loginProps} busy onSubmit={onSubmit} />));
    const button = screen.getByRole('button', { name: 'Sign in' });
    expect(button.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
    expect(screen.getByLabelText('Email address').props.editable).toBe(false);
  });

  it('links to sign-up with a real target', () => {
    const onGoToSignUp = jest.fn();
    render(wrap(<LoginView {...loginProps} onGoToSignUp={onGoToSignUp} />));
    fireEvent.press(screen.getByRole('link', { name: 'Create an account' }));
    expect(onGoToSignUp).toHaveBeenCalled();
  });
});

describe('SignUpView', () => {
  const props = {
    email: '',
    password: '',
    confirm: '',
    agreed: false,
    onEmailChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onConfirmChange: jest.fn(),
    onAgreedChange: jest.fn(),
    onSubmit: jest.fn(),
    onGoToLogin: jest.fn(),
    busy: false,
    errors: NO_AUTH_ERRORS,
  };

  it('toggles agreement through an accessible checkbox', () => {
    const onAgreedChange = jest.fn();
    render(wrap(<SignUpView {...props} onAgreedChange={onAgreedChange} />));
    const box = screen.getByRole('checkbox');
    expect(box.props.accessibilityState).toMatchObject({ checked: false });
    fireEvent.press(box);
    expect(onAgreedChange).toHaveBeenCalledWith(true);
  });

  it('shows field errors under the right fields', () => {
    render(
      wrap(
        <SignUpView
          {...props}
          errors={{ fields: { confirm: 'Passwords do not match.', agreed: 'Agree to continue.' }, general: null }}
        />,
      ),
    );
    expect(screen.getByText('Passwords do not match.')).toBeTruthy();
    expect(screen.getByText('Agree to continue.')).toBeTruthy();
  });

  it('never shows a password rule the route did not supply', () => {
    render(wrap(<SignUpView {...props} />));
    expect(screen.queryByText(/at least/i)).toBeNull();
  });

  it('offers the legal documents only when the route can open them', () => {
    const { rerender } = render(wrap(<SignUpView {...props} />));
    expect(screen.queryByRole('button', { name: 'Read the Terms' })).toBeNull();
    rerender(wrap(<SignUpView {...props} onOpenTerms={jest.fn()} />));
    expect(screen.getByRole('button', { name: 'Read the Terms' })).toBeTruthy();
  });
});

describe('VerifyEmailView', () => {
  const props = {
    email: 'ada@futa.edu.ng',
    code: '',
    onCodeChange: jest.fn(),
    onSubmit: jest.fn(),
    onResend: jest.fn(),
    onBack: jest.fn(),
    busy: false,
    errors: NO_AUTH_ERRORS,
  };

  it('names the address the code went to', () => {
    render(wrap(<VerifyEmailView {...props} />));
    expect(screen.getByText(/ada@futa\.edu\.ng/)).toBeTruthy();
  });

  it('disables resend during the cooldown and says how long', () => {
    render(wrap(<VerifyEmailView {...props} resendInSeconds={30} />));
    const resend = screen.getByRole('button', { name: 'Send a new code in 30s' });
    expect(resend.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('shows an expired-code error on the code field', () => {
    render(wrap(<VerifyEmailView {...props} errors={{ fields: { token: 'That code has expired.' }, general: null }} />));
    expect(screen.getByText('That code has expired.')).toBeTruthy();
  });
});
