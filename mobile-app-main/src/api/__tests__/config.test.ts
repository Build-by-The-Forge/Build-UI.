import { ConfigError, readApiConfig } from '../config';

const POLICIES = {
  EXPO_PUBLIC_TERMS_URL: 'https://build.example/terms',
  EXPO_PUBLIC_PRIVACY_URL: 'https://build.example/privacy',
};

describe('readApiConfig', () => {
  it('reads the base URL and defaults the tenant to futa', () => {
    expect(readApiConfig({ EXPO_PUBLIC_API_BASE_URL: 'https://api.example/', ...POLICIES }, false)).toEqual({
      baseUrl: 'https://api.example',
      tenantSlug: 'futa',
      useMocks: false,
      timeoutMs: 20_000,
      termsUrl: 'https://build.example/terms',
      privacyUrl: 'https://build.example/privacy',
    });
  });

  it('refuses mocks in a production build', () => {
    expect(() =>
      readApiConfig({ EXPO_PUBLIC_USE_MOCKS: 'true', EXPO_PUBLIC_API_BASE_URL: 'https://api.example', ...POLICIES }, false),
    ).toThrow(ConfigError);
  });

  it('allows mocks in development without a base URL', () => {
    expect(readApiConfig({ EXPO_PUBLIC_USE_MOCKS: 'true' }, true).useMocks).toBe(true);
  });

  it('requires a base URL when mocks are off', () => {
    expect(() => readApiConfig({}, true)).toThrow(ConfigError);
  });

  it('refuses plain http in production but allows it in development', () => {
    expect(() => readApiConfig({ EXPO_PUBLIC_API_BASE_URL: 'http://10.0.2.2:8000', ...POLICIES }, false)).toThrow(ConfigError);
    expect(readApiConfig({ EXPO_PUBLIC_API_BASE_URL: 'http://10.0.2.2:8000' }, true).baseUrl).toBe('http://10.0.2.2:8000');
  });
});

describe('policy links', () => {
  const base = { EXPO_PUBLIC_API_BASE_URL: 'https://api.example' };

  it('refuses a production build without the Terms URL', () => {
    expect(() => readApiConfig({ ...base, EXPO_PUBLIC_PRIVACY_URL: POLICIES.EXPO_PUBLIC_PRIVACY_URL }, false)).toThrow(
      'EXPO_PUBLIC_TERMS_URL is not set. A production build must link the published policy.',
    );
  });

  it('refuses a production build without the Privacy URL', () => {
    expect(() => readApiConfig({ ...base, EXPO_PUBLIC_TERMS_URL: POLICIES.EXPO_PUBLIC_TERMS_URL }, false)).toThrow(
      'EXPO_PUBLIC_PRIVACY_URL is not set. A production build must link the published policy.',
    );
  });

  it('refuses a blank, invalid or non-https policy URL in production', () => {
    expect(() => readApiConfig({ ...base, ...POLICIES, EXPO_PUBLIC_TERMS_URL: '   ' }, false)).toThrow(ConfigError);
    expect(() => readApiConfig({ ...base, ...POLICIES, EXPO_PUBLIC_TERMS_URL: 'not a url' }, false)).toThrow('not a valid URL');
    expect(() => readApiConfig({ ...base, ...POLICIES, EXPO_PUBLIC_PRIVACY_URL: 'http://build.example/p' }, false)).toThrow('https');
    expect(() => readApiConfig({ ...base, ...POLICIES, EXPO_PUBLIC_TERMS_URL: 'javascript:alert(1)' }, false)).toThrow('https');
  });

  it('lets development start without them, reporting them as not configured', () => {
    const config = readApiConfig(base, true);
    expect(config.termsUrl).toBeNull();
    expect(config.privacyUrl).toBeNull();
  });
});
