import { ConfigError, readApiConfig } from '../config';

describe('readApiConfig', () => {
  it('reads the base URL and defaults the tenant to futa', () => {
    expect(readApiConfig({ EXPO_PUBLIC_API_BASE_URL: 'https://api.example/' }, false)).toEqual({
      baseUrl: 'https://api.example',
      tenantSlug: 'futa',
      useMocks: false,
      timeoutMs: 20_000,
    });
  });

  it('refuses mocks in a production build', () => {
    expect(() =>
      readApiConfig({ EXPO_PUBLIC_USE_MOCKS: 'true', EXPO_PUBLIC_API_BASE_URL: 'https://api.example' }, false),
    ).toThrow(ConfigError);
  });

  it('allows mocks in development without a base URL', () => {
    expect(readApiConfig({ EXPO_PUBLIC_USE_MOCKS: 'true' }, true).useMocks).toBe(true);
  });

  it('requires a base URL when mocks are off', () => {
    expect(() => readApiConfig({}, true)).toThrow(ConfigError);
  });

  it('refuses plain http in production but allows it in development', () => {
    expect(() => readApiConfig({ EXPO_PUBLIC_API_BASE_URL: 'http://10.0.2.2:8000' }, false)).toThrow(ConfigError);
    expect(readApiConfig({ EXPO_PUBLIC_API_BASE_URL: 'http://10.0.2.2:8000' }, true).baseUrl).toBe(
      'http://10.0.2.2:8000',
    );
  });
});
