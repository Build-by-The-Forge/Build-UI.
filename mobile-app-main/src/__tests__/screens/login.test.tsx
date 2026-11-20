import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ApiError } from '@/api/errors';
import LoginScreen from '@/app/(auth)/login';

const mockSignIn = jest.fn();
let mockReason: 'expired' | null = null;

jest.mock('@/auth/SessionProvider', () => ({
  useSession: () => ({ signIn: mockSignIn, reason: mockReason }),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-image', () => ({ Image: () => null }));
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@expo/vector-icons', () => ({ Feather: () => null }));
jest.mock('@/constants/theme', () => ({
  Fonts: new Proxy({}, { get: () => 'System' }),
}));

beforeEach(() => {
  mockSignIn.mockReset();
  mockReason = null;
});

describe('LoginScreen', () => {
  it('signs in with what was typed and does not navigate by itself', async () => {
    mockSignIn.mockResolvedValue(undefined);
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText('Email address'), '  s@futa.edu.ng ');
    fireEvent.changeText(screen.getByLabelText('Password'), 'secret-pass');
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('s@futa.edu.ng', 'secret-pass'));
  });

  it('does not call the backend with an empty form', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign In'));
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(screen.getByText('Enter your email and password.')).toBeTruthy();
  });

  it('shows a credentials error that does not say which part was wrong', async () => {
    mockSignIn.mockRejectedValue(new ApiError('AUTH_INVALID_CREDENTIALS', 'x', 401, 'r'));
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText('Email address'), 'a@b.co');
    fireEvent.changeText(screen.getByLabelText('Password'), 'nope');
    fireEvent.press(screen.getByText('Sign In'));
    expect(await screen.findByText(/don't match/)).toBeTruthy();
  });

  it('says so when the session ended', () => {
    mockReason = 'expired';
    render(<LoginScreen />);
    expect(screen.getByText('Your session ended. Sign in again to continue.')).toBeTruthy();
  });
});
