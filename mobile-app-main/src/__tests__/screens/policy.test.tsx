import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';

import { PolicyAgreement } from '@/components/auth/PolicyAgreement';

jest.mock('@expo/vector-icons', () => ({ Feather: () => null }));
jest.mock('@/constants/theme', () => ({ Fonts: new Proxy({}, { get: () => 'System' }) }));

const TERMS = 'https://build.example/terms';
const PRIVACY = 'https://build.example/privacy';

let openURL: jest.SpyInstance;
beforeEach(() => {
  openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
});
afterEach(() => openURL.mockRestore());

describe('PolicyAgreement', () => {
  it('opens the Terms of Service at its configured address', async () => {
    render(<PolicyAgreement termsUrl={TERMS} privacyUrl={PRIVACY} agreed={false} onToggle={jest.fn()} />);
    fireEvent.press(screen.getByLabelText('Open the Terms of Service'));
    await waitFor(() => expect(openURL).toHaveBeenCalledWith(TERMS));
    expect(openURL).toHaveBeenCalledTimes(1);
  });

  it('opens the Privacy Policy at its configured address', async () => {
    render(<PolicyAgreement termsUrl={TERMS} privacyUrl={PRIVACY} agreed={false} onToggle={jest.fn()} />);
    fireEvent.press(screen.getByLabelText('Open the Privacy Policy'));
    await waitFor(() => expect(openURL).toHaveBeenCalledWith(PRIVACY));
    expect(openURL).toHaveBeenCalledTimes(1);
  });

  it('exposes both as links and the box as a checkbox', () => {
    const toggle = jest.fn();
    render(<PolicyAgreement termsUrl={TERMS} privacyUrl={PRIVACY} agreed={false} onToggle={toggle} />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
    fireEvent.press(screen.getByRole('checkbox'));
    expect(toggle).toHaveBeenCalled();
  });

  it('says so when a page cannot be opened', async () => {
    openURL.mockRejectedValue(new Error('no browser'));
    render(<PolicyAgreement termsUrl={TERMS} privacyUrl={PRIVACY} agreed={false} onToggle={jest.fn()} />);
    fireEvent.press(screen.getByLabelText('Open the Terms of Service'));
    expect(await screen.findByText(/Could not open the page/)).toBeTruthy();
  });

  it('shows a labelled notice and no checkbox when the policies are not configured (development)', () => {
    render(<PolicyAgreement termsUrl={null} privacyUrl={null} agreed={false} onToggle={jest.fn()} />);
    expect(screen.getByText(/not yet published/)).toBeTruthy();
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('treats a single missing document as not configured', () => {
    render(<PolicyAgreement termsUrl={TERMS} privacyUrl={null} agreed={false} onToggle={jest.fn()} />);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });
});
