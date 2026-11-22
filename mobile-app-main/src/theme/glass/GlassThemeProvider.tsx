/**
 * The one place that knows the device. It measures the signals, picks the
 * treatment (see capability.ts), applies the student's override from
 * Settings, and hands every component a resolved theme. Components read
 * `useGlassTheme()` and never check the device themselves.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import {
  decideTier,
  isEffectsPreference,
  resolveTier,
  type CapabilitySignals,
  type EffectsPreference,
  type TierDecision,
} from './capability';
import {
  blur,
  elevation,
  motion,
  palettes,
  surfaces,
  type ColorScheme,
  type GlassTier,
} from './tokens';

export const EFFECTS_STORAGE_KEY = 'build-visual-effects';

export type GlassTheme = {
  scheme: ColorScheme;
  tier: GlassTier;
  /** What "Automatic" would choose on this device, and why. */
  auto: TierDecision;
  preference: EffectsPreference;
  setPreference: (next: EffectsPreference) => void;
  /** False until the OS accessibility settings have been read. */
  ready: boolean;
  reduceMotion: boolean;
  colors: (typeof palettes)[ColorScheme];
  surface: (typeof surfaces)[ColorScheme][GlassTier];
  shadow: (typeof elevation)[ColorScheme][GlassTier];
  blur: (typeof blur)[GlassTier];
  /** Motion durations, all 0 when the OS asks for reduced motion. */
  duration: { fast: number; base: number; slow: number };
};

/** Before any measurement, assume the cheapest treatment. */
const SAFE_DECISION: TierDecision = { tier: 'opaque', reason: 'Checking what this phone can do.' };

export function buildTheme(input: {
  scheme: ColorScheme;
  tier: GlassTier;
  auto: TierDecision;
  preference: EffectsPreference;
  setPreference: (next: EffectsPreference) => void;
  ready: boolean;
  reduceMotion: boolean;
}): GlassTheme {
  const { scheme, tier, reduceMotion } = input;
  return {
    ...input,
    colors: palettes[scheme],
    surface: surfaces[scheme][tier],
    shadow: elevation[scheme][tier],
    blur: blur[tier],
    duration: reduceMotion ? { fast: 0, base: 0, slow: 0 } : motion.duration,
  };
}

const fallbackTheme = buildTheme({
  scheme: 'light',
  tier: 'opaque',
  auto: SAFE_DECISION,
  preference: 'auto',
  setPreference: () => {},
  ready: true,
  reduceMotion: false,
});

const GlassThemeContext = createContext<GlassTheme>(fallbackTheme);

function platformName(): CapabilitySignals['platform'] {
  const os = Platform.OS;
  return os === 'android' || os === 'ios' || os === 'web' || os === 'windows' || os === 'macos' ? os : 'web';
}

/**
 * Not every platform implements every query (react-native-web has no
 * reduce-transparency API, for example). A missing or failing query reads as
 * "off" so the theme always resolves instead of crashing the app.
 */
function readFlag(query: (() => Promise<boolean>) | undefined): Promise<boolean> {
  if (typeof query !== 'function') return Promise.resolve(false);
  try {
    return query.call(AccessibilityInfo).then(Boolean, () => false);
  } catch {
    return Promise.resolve(false);
  }
}

function listen(
  event: 'reduceMotionChanged' | 'reduceTransparencyChanged',
  handler: (value: boolean) => void,
): { remove: () => void } | null {
  try {
    return AccessibilityInfo.addEventListener(event, handler) ?? null;
  } catch {
    return null;
  }
}

type Props = {
  children: React.ReactNode;
  scheme: ColorScheme;
  /** Tests and the gallery can pin the signals instead of reading the device. */
  signals?: Partial<CapabilitySignals>;
  initialPreference?: EffectsPreference;
};

export function GlassThemeProvider({ children, scheme, signals, initialPreference }: Props) {
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(signals?.reduceMotion ?? null);
  const [reduceTransparency, setReduceTransparency] = useState<boolean | null>(
    signals?.reduceTransparency ?? null,
  );
  const [preference, setPreferenceState] = useState<EffectsPreference>(initialPreference ?? 'auto');
  const [preferenceLoaded, setPreferenceLoaded] = useState(initialPreference !== undefined);

  useEffect(() => {
    if (signals?.reduceMotion !== undefined && signals?.reduceTransparency !== undefined) return;
    let alive = true;
    readFlag(AccessibilityInfo.isReduceMotionEnabled).then((v) => alive && setReduceMotion(v));
    readFlag(AccessibilityInfo.isReduceTransparencyEnabled).then((v) => alive && setReduceTransparency(v));
    const subs = [
      listen('reduceMotionChanged', setReduceMotion),
      listen('reduceTransparencyChanged', setReduceTransparency),
    ];
    return () => {
      alive = false;
      subs.forEach((sub) => sub?.remove());
    };
  }, [signals?.reduceMotion, signals?.reduceTransparency]);

  useEffect(() => {
    if (initialPreference !== undefined) return;
    let alive = true;
    AsyncStorage.getItem(EFFECTS_STORAGE_KEY)
      .then((saved) => {
        if (alive && isEffectsPreference(saved)) setPreferenceState(saved);
      })
      .catch(() => {})
      .finally(() => alive && setPreferenceLoaded(true));
    return () => {
      alive = false;
    };
  }, [initialPreference]);

  const setPreference = useCallback((next: EffectsPreference) => {
    if (!isEffectsPreference(next)) return;
    setPreferenceState(next);
    AsyncStorage.setItem(EFFECTS_STORAGE_KEY, next).catch(() => {
      // The choice still applies for this session; it just won't survive a restart.
    });
  }, []);

  const ready = reduceMotion !== null && reduceTransparency !== null && preferenceLoaded;

  const value = useMemo(() => {
    const measured: CapabilitySignals = {
      platform: signals?.platform ?? platformName(),
      totalMemoryBytes: signals && 'totalMemoryBytes' in signals ? signals.totalMemoryBytes ?? null : Device.totalMemory,
      androidApiLevel:
        signals && 'androidApiLevel' in signals ? signals.androidApiLevel ?? null : Device.platformApiLevel,
      reduceMotion: reduceMotion ?? false,
      reduceTransparency: reduceTransparency ?? false,
    };
    const auto = ready ? decideTier(measured) : SAFE_DECISION;
    return buildTheme({
      scheme,
      tier: ready ? resolveTier(preference, auto) : 'opaque',
      auto,
      preference,
      setPreference,
      ready,
      reduceMotion: reduceMotion ?? false,
    });
  }, [scheme, signals, reduceMotion, reduceTransparency, preference, setPreference, ready]);

  return <GlassThemeContext.Provider value={value}>{children}</GlassThemeContext.Provider>;
}

/** Override part of the theme for a subtree (the gallery uses this to show all three treatments side by side). */
export function GlassThemeOverride({
  tier,
  scheme,
  children,
}: {
  tier?: GlassTier;
  scheme?: ColorScheme;
  children: React.ReactNode;
}) {
  const parent = useContext(GlassThemeContext);
  const value = useMemo(
    () =>
      buildTheme({
        ...parent,
        tier: tier ?? parent.tier,
        scheme: scheme ?? parent.scheme,
      }),
    [parent, tier, scheme],
  );
  return <GlassThemeContext.Provider value={value}>{children}</GlassThemeContext.Provider>;
}

export function useGlassTheme(): GlassTheme {
  return useContext(GlassThemeContext);
}
