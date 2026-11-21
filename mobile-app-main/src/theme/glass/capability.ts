/**
 * Chooses the visual treatment (full, reduced or opaque glass) from signals
 * the device can measure. Pure, so the whole heuristic is unit tested.
 *
 * Rules, first match wins. They err towards less effect: a mid-range phone
 * shown the reduced treatment loses a little polish; a low-end phone shown
 * full glass drops frames.
 *
 * 1. The user's choice in Settings (when not "Automatic") always wins.
 * 2. OS "reduce transparency" (iOS) or "remove animations" (Android, reported
 *    as reduce motion) on      -> opaque.
 * 3. Android below API 31 (Android 12), or API level unknown -> opaque.
 *    Live blur before API 31 is a software path and is slow; BUILD targets
 *    Android 14+ anyway, so this only guards side-loaded installs.
 * 4. Total RAM unknown        -> opaque.
 * 5. Total RAM < 5 GiB        -> opaque.   (4 GB phones report about 3.5-3.8 GiB)
 * 6. Total RAM < 7 GiB        -> reduced.  (6 GB phones report about 5.4-5.8 GiB)
 * 7. Otherwise                -> full.     (8 GB phones report about 7.2-7.6 GiB)
 *
 * Only measured signals are used: never brand, model name, price or marketing
 * tier. iOS and web skip rules 3-6 (not release targets; both blur natively).
 * A startup render-time probe was considered and left out: the first second
 * of an app's life is janky on every phone, so it would mostly downgrade good
 * devices. Revisit with frame data from physical low-end phones.
 */
import type { GlassTier } from './tokens';

export type CapabilitySignals = {
  platform: 'android' | 'ios' | 'web' | 'windows' | 'macos';
  /** Physical RAM in bytes, from expo-device `totalMemory`. */
  totalMemoryBytes: number | null;
  /** Android API level, from expo-device `platformApiLevel`. */
  androidApiLevel: number | null;
  reduceMotion: boolean;
  reduceTransparency: boolean;
};

export type EffectsPreference = 'auto' | GlassTier;
export const EFFECTS_PREFERENCES: readonly EffectsPreference[] = ['auto', 'full', 'reduced', 'opaque'] as const;

export type TierDecision = {
  tier: GlassTier;
  /** Plain-English reason, shown in Settings next to "Automatic". */
  reason: string;
};

const GIB = 1024 ** 3;
export const OPAQUE_BELOW_BYTES = 5 * GIB;
export const REDUCED_BELOW_BYTES = 7 * GIB;
export const MIN_BLUR_API_LEVEL = 31;

export function decideTier(s: CapabilitySignals): TierDecision {
  if (s.reduceTransparency) {
    return { tier: 'opaque', reason: 'Your phone is set to reduce transparency.' };
  }
  if (s.reduceMotion) {
    return { tier: 'opaque', reason: 'Your phone is set to remove animations.' };
  }
  if (s.platform !== 'android') {
    return s.platform === 'ios'
      ? { tier: 'full', reason: 'Your phone handles full effects.' }
      : { tier: 'reduced', reason: 'Reduced effects on this platform.' };
  }
  if (s.androidApiLevel === null || s.androidApiLevel < MIN_BLUR_API_LEVEL) {
    return { tier: 'opaque', reason: 'This Android version is too old for live blur.' };
  }
  if (s.totalMemoryBytes === null || !Number.isFinite(s.totalMemoryBytes) || s.totalMemoryBytes <= 0) {
    return { tier: 'opaque', reason: "We couldn't read this phone's memory, so effects are off to be safe." };
  }
  if (s.totalMemoryBytes < OPAQUE_BELOW_BYTES) {
    return { tier: 'opaque', reason: 'Effects are off to keep this phone fast.' };
  }
  if (s.totalMemoryBytes < REDUCED_BELOW_BYTES) {
    return { tier: 'reduced', reason: 'Lighter effects to keep this phone smooth.' };
  }
  return { tier: 'full', reason: 'Your phone handles full effects.' };
}

export function resolveTier(preference: EffectsPreference, auto: TierDecision): GlassTier {
  return preference === 'auto' ? auto.tier : preference;
}

export function isEffectsPreference(value: unknown): value is EffectsPreference {
  return typeof value === 'string' && (EFFECTS_PREFERENCES as readonly string[]).includes(value);
}
