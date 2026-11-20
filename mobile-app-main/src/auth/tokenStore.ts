import * as SecureStore from 'expo-secure-store';

/**
 * What survives an app restart. The access token is deliberately not here: it
 * lives 15 minutes, is rebuilt from the refresh token at launch, and keeping it
 * out of storage leaves one secret to protect.
 */
export type StoredSession = {
  readonly refreshToken: string;
  readonly userId: string;
  readonly sessionId: string;
};

export interface TokenStore {
  load(): Promise<StoredSession | null>;
  save(session: StoredSession): Promise<void>;
  clear(): Promise<void>;
  /** A random ID for this install. It survives sign-out, not an uninstall. */
  deviceId(): Promise<string>;
}

const SESSION_KEY = 'build.session.v1';
const DEVICE_KEY = 'build.device.v1';

const OPTIONS: SecureStore.SecureStoreOptions = {
  // Readable only while the device is unlocked, and never copied to a backup
  // or another device.
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.refreshToken === 'string' &&
    v.refreshToken.length > 0 &&
    typeof v.userId === 'string' &&
    typeof v.sessionId === 'string'
  );
}

export function createSecureTokenStore(randomId: () => string): TokenStore {
  return {
    async load() {
      let raw: string | null;
      try {
        raw = await SecureStore.getItemAsync(SESSION_KEY, OPTIONS);
      } catch {
        // An unreadable keystore entry (restored backup, changed lock screen)
        // is a signed-out device, not a crash.
        return null;
      }
      if (!raw) return null;
      try {
        const parsed: unknown = JSON.parse(raw);
        return isStoredSession(parsed) ? parsed : null;
      } catch {
        return null;
      }
    },
    async save(session) {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), OPTIONS);
    },
    async clear() {
      await SecureStore.deleteItemAsync(SESSION_KEY, OPTIONS);
    },
    async deviceId() {
      try {
        const existing = await SecureStore.getItemAsync(DEVICE_KEY, OPTIONS);
        if (existing && /^[A-Za-z0-9._:-]{1,36}$/.test(existing)) return existing;
      } catch {
        // fall through and mint a new one
      }
      const created = randomId();
      try {
        await SecureStore.setItemAsync(DEVICE_KEY, created, OPTIONS);
      } catch {
        // The ID is optional context; sign-in works without it persisting.
      }
      return created;
    },
  };
}
