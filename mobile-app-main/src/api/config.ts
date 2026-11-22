/**
 * Public runtime configuration for the API client.
 *
 * Every EXPO_PUBLIC_ value is bundled into the app and readable by anyone, so
 * nothing here is a secret. Mock adapters exist for development only: a
 * production build refuses to start with them enabled.
 */

export type ApiConfig = {
  /** build-backend origin, without a trailing slash. */
  readonly baseUrl: string;
  /** The tenant this build serves (FUTA for the first release, gap G-26). */
  readonly tenantSlug: string;
  /** Development-only contract mocks. */
  readonly useMocks: boolean;
  /** Per-request timeout. */
  readonly timeoutMs: number;
  /** Published Terms of Service and Privacy Policy. Both are required in production. */
  readonly termsUrl: string | null;
  readonly privacyUrl: string | null;
};

export class ConfigError extends Error {
  override name = 'ConfigError';
}

type Env = Readonly<Record<string, string | undefined>>;

function readPolicyUrl(name: string, raw: string | undefined, isDev: boolean): string | null {
  const value = (raw ?? '').trim();
  if (!value) {
    if (!isDev) throw new ConfigError(`${name} is not set. A production build must link the published policy.`);
    return null;
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new ConfigError(`${name} is not a valid URL.`);
  }
  if (parsed.protocol !== 'https:' && !(isDev && parsed.protocol === 'http:')) {
    throw new ConfigError(`${name} must be an https URL.`);
  }
  return value;
}

export function readApiConfig(env: Env, isDev: boolean): ApiConfig {
  const useMocks = env.EXPO_PUBLIC_USE_MOCKS === 'true';
  if (useMocks && !isDev) {
    throw new ConfigError(
      'EXPO_PUBLIC_USE_MOCKS is set in a production build. Mocks are for development only.',
    );
  }

  const rawBaseUrl = (env.EXPO_PUBLIC_API_BASE_URL ?? '').trim();
  if (!rawBaseUrl && !useMocks) {
    throw new ConfigError('EXPO_PUBLIC_API_BASE_URL is not set.');
  }
  if (rawBaseUrl && !isDev && !rawBaseUrl.startsWith('https://')) {
    throw new ConfigError('EXPO_PUBLIC_API_BASE_URL must use https in a production build.');
  }

  const timeout = Number(env.EXPO_PUBLIC_API_TIMEOUT_MS ?? '');
  return {
    baseUrl: rawBaseUrl.replace(/\/+$/, ''),
    tenantSlug: (env.EXPO_PUBLIC_TENANT_SLUG ?? '').trim() || 'futa',
    useMocks,
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 20_000,
    termsUrl: readPolicyUrl('EXPO_PUBLIC_TERMS_URL', env.EXPO_PUBLIC_TERMS_URL, isDev),
    privacyUrl: readPolicyUrl('EXPO_PUBLIC_PRIVACY_URL', env.EXPO_PUBLIC_PRIVACY_URL, isDev),
  };
}

let cached: ApiConfig | null = null;

/** The app's configuration, read once. Throws ConfigError if it is unsafe. */
export function apiConfig(): ApiConfig {
  if (!cached) {
    // Expo inlines EXPO_PUBLIC_ variables only when they're read by name.
    cached = readApiConfig(
      {
        EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
        EXPO_PUBLIC_TENANT_SLUG: process.env.EXPO_PUBLIC_TENANT_SLUG,
        EXPO_PUBLIC_USE_MOCKS: process.env.EXPO_PUBLIC_USE_MOCKS,
        EXPO_PUBLIC_API_TIMEOUT_MS: process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
        EXPO_PUBLIC_TERMS_URL: process.env.EXPO_PUBLIC_TERMS_URL,
        EXPO_PUBLIC_PRIVACY_URL: process.env.EXPO_PUBLIC_PRIVACY_URL,
      },
      typeof __DEV__ !== 'undefined' && __DEV__,
    );
  }
  return cached;
}
