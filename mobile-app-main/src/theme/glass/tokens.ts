/**
 * BUILD design tokens: one source for colour, type, spacing, radius, elevation
 * and motion, in light and dark, for each of the three visual treatments.
 *
 * Colours start from the Figma file (see docs/UI_DESIGN_BRIEF.md section 4) and
 * are adjusted where Figma's values fail WCAG AA over glass. Every text colour
 * is checked against the worst background it can sit on by
 * src/theme/glass/__tests__/contrast.test.ts. Change a colour here, run the tests.
 */

export type ColorScheme = 'light' | 'dark';

/**
 * The three treatments. Components never pick one themselves; they read it
 * from the GlassThemeProvider (see capability.ts for how it is chosen).
 * - full:    live blur on up to two layers per screen, translucent surfaces.
 * - reduced: live blur on one layer only, weaker, and more opaque surfaces.
 * - opaque:  no blur anywhere, opaque tinted surfaces, minimal effects.
 * Layout, hierarchy and hit targets are identical in all three.
 */
export type GlassTier = 'full' | 'reduced' | 'opaque';
export const GLASS_TIERS: readonly GlassTier[] = ['full', 'reduced', 'opaque'] as const;

type Palette = {
  /** Static ambient page background: a gradient and soft colour fields. No images. */
  background: {
    base: string;
    gradient: readonly [string, string, string];
    /** Soft colour fields drawn behind content, at `fieldOpacity`. */
    fields: readonly [string, string, string];
    fieldOpacity: number;
    /**
     * Pessimistic colour assumed behind blurred chrome (bars, sheets), which
     * can sit over any content: black in light mode, white in dark mode.
     */
    worstUnderChrome: string;
  };
  text: {
    primary: string;
    secondary: string;
    /** Links, active tab labels, accent text: passes AA on every surface. */
    accent: string;
    onAccent: string;
    danger: string;
    success: string;
    warning: string;
  };
  accent: {
    /** Brand blue from Figma, for fills and large glyphs (not small text on glass). */
    brand: string;
    /** Primary button gradient. White text passes AA on both stops. */
    gradient: readonly [string, string];
    pressed: string;
    /** Pale tint behind selected chips and icon tiles. */
    tint: string;
  };
  status: {
    dangerTint: string;
    successTint: string;
    warningTint: string;
    infoTint: string;
  };
  /** Icon tile tints from the Figma quick-access cards. */
  tiles: { blue: string; orange: string; purple: string; green: string };
  tileGlyphs: { blue: string; orange: string; purple: string; green: string };
  focusRing: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: {
      base: '#EEF3FB',
      gradient: ['#EAF1FF', '#F2F4FA', '#F1ECFF'],
      fields: ['#BFDBFE', '#DDD6FE', '#C7D2FE'],
      fieldOpacity: 0.55,
      worstUnderChrome: '#000000',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      accent: '#1E40AF',
      onAccent: '#FFFFFF',
      danger: '#991B1B',
      success: '#14532D',
      warning: '#78350F',
    },
    accent: {
      brand: '#1976D2',
      gradient: ['#2563EB', '#4F46E5'],
      pressed: '#1D4ED8',
      tint: '#DBEAFE',
    },
    status: {
      dangerTint: '#FEE2E2',
      successTint: '#DCFCE7',
      warningTint: '#FEF3C7',
      infoTint: '#DBEAFE',
    },
    tiles: { blue: '#EFF6FF', orange: '#FFF7ED', purple: '#FAF5FF', green: '#F0FDF4' },
    tileGlyphs: { blue: '#1976D2', orange: '#C2410C', purple: '#7E22CE', green: '#15803D' },
    focusRing: '#1D4ED8',
  },
  dark: {
    background: {
      base: '#0B1020',
      gradient: ['#0B1020', '#10183A', '#181240'],
      fields: ['#1E3A8A', '#4C1D95', '#0E7490'],
      fieldOpacity: 0.4,
      worstUnderChrome: '#FFFFFF',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#B8C2D4',
      accent: '#93C5FD',
      onAccent: '#FFFFFF',
      danger: '#FCA5A5',
      success: '#86EFAC',
      warning: '#FCD34D',
    },
    accent: {
      brand: '#60A5FA',
      gradient: ['#2563EB', '#4F46E5'],
      pressed: '#1D4ED8',
      tint: '#1E3A8A',
    },
    status: {
      dangerTint: '#450A0A',
      successTint: '#052E16',
      warningTint: '#451A03',
      infoTint: '#172554',
    },
    tiles: { blue: '#172554', orange: '#431407', purple: '#3B0764', green: '#052E16' },
    tileGlyphs: { blue: '#93C5FD', orange: '#FDBA74', purple: '#D8B4FE', green: '#86EFAC' },
    focusRing: '#93C5FD',
  },
};

/**
 * Surface fills per scheme and treatment. `card` never blurs (safe in lists);
 * `chrome` (header, tab bar) and `sheet` (bottom sheet, modal) may blur when the
 * treatment allows it. In `opaque` every fill is fully opaque, and border
 * widths stay the same so nothing moves when effects are switched off.
 */
type SurfaceSet = {
  card: string;
  chrome: string;
  sheet: string;
  input: string;
  /** Hairline around every surface. */
  edge: string;
  /** Brighter top edge: the thin inner highlight that sells the glass. */
  highlight: string;
  /** Backdrop behind modals. */
  scrim: string;
};

export const surfaces: Record<ColorScheme, Record<GlassTier, SurfaceSet>> = {
  light: {
    full: {
      card: 'rgba(255, 255, 255, 0.58)',
      chrome: 'rgba(248, 250, 255, 0.82)',
      sheet: 'rgba(248, 250, 255, 0.86)',
      input: 'rgba(255, 255, 255, 0.78)',
      edge: 'rgba(255, 255, 255, 0.55)',
      highlight: 'rgba(255, 255, 255, 0.95)',
      scrim: 'rgba(15, 23, 42, 0.36)',
    },
    reduced: {
      card: 'rgba(255, 255, 255, 0.80)',
      chrome: 'rgba(248, 250, 255, 0.92)',
      sheet: 'rgba(248, 250, 255, 0.95)',
      input: 'rgba(255, 255, 255, 0.92)',
      edge: 'rgba(255, 255, 255, 0.70)',
      highlight: 'rgba(255, 255, 255, 0.95)',
      scrim: 'rgba(15, 23, 42, 0.45)',
    },
    opaque: {
      card: '#FFFFFF',
      chrome: '#F8FAFF',
      sheet: '#F8FAFF',
      input: '#FFFFFF',
      edge: '#DCE3EE',
      highlight: '#DCE3EE',
      scrim: 'rgba(15, 23, 42, 0.55)',
    },
  },
  dark: {
    full: {
      card: 'rgba(30, 41, 75, 0.55)',
      chrome: 'rgba(15, 20, 40, 0.82)',
      sheet: 'rgba(15, 20, 40, 0.88)',
      input: 'rgba(15, 23, 42, 0.70)',
      edge: 'rgba(255, 255, 255, 0.10)',
      highlight: 'rgba(255, 255, 255, 0.22)',
      scrim: 'rgba(0, 0, 0, 0.50)',
    },
    reduced: {
      card: 'rgba(30, 41, 75, 0.80)',
      chrome: 'rgba(15, 20, 40, 0.92)',
      sheet: 'rgba(15, 20, 40, 0.95)',
      input: 'rgba(15, 23, 42, 0.88)',
      edge: 'rgba(255, 255, 255, 0.12)',
      highlight: 'rgba(255, 255, 255, 0.22)',
      scrim: 'rgba(0, 0, 0, 0.58)',
    },
    opaque: {
      card: '#1A2242',
      chrome: '#121933',
      sheet: '#121933',
      input: '#0F172A',
      edge: '#2B3557',
      highlight: '#2B3557',
      scrim: 'rgba(0, 0, 0, 0.65)',
    },
  },
};

/** Live blur per treatment. Never animate `intensity`. */
export const blur: Record<GlassTier, { maxLayers: number; intensity: number }> = {
  full: { maxLayers: 2, intensity: 60 },
  reduced: { maxLayers: 1, intensity: 30 },
  opaque: { maxLayers: 0, intensity: 0 },
};

/** CSS-style box shadows (React Native new architecture). Outset shadows are not drawn under translucent fills. */
export const elevation: Record<ColorScheme, Record<GlassTier, { card: string; raised: string; chrome: string }>> = {
  light: {
    full: {
      card: '0px 8px 24px rgba(30, 41, 59, 0.10)',
      raised: '0px 16px 32px rgba(30, 41, 59, 0.16)',
      chrome: '0px 4px 30px rgba(30, 41, 59, 0.14)',
    },
    reduced: {
      card: '0px 4px 14px rgba(30, 41, 59, 0.10)',
      raised: '0px 10px 24px rgba(30, 41, 59, 0.14)',
      chrome: '0px 2px 18px rgba(30, 41, 59, 0.12)',
    },
    opaque: {
      card: '0px 1px 3px rgba(30, 41, 59, 0.10)',
      raised: '0px 4px 10px rgba(30, 41, 59, 0.12)',
      chrome: '0px 1px 4px rgba(30, 41, 59, 0.10)',
    },
  },
  dark: {
    full: {
      card: '0px 8px 24px rgba(0, 0, 0, 0.35)',
      raised: '0px 16px 32px rgba(0, 0, 0, 0.45)',
      chrome: '0px 4px 30px rgba(0, 0, 0, 0.40)',
    },
    reduced: {
      card: '0px 4px 14px rgba(0, 0, 0, 0.35)',
      raised: '0px 10px 24px rgba(0, 0, 0, 0.40)',
      chrome: '0px 2px 18px rgba(0, 0, 0, 0.35)',
    },
    opaque: {
      card: '0px 1px 3px rgba(0, 0, 0, 0.40)',
      raised: '0px 4px 10px rgba(0, 0, 0, 0.45)',
      chrome: '0px 1px 4px rgba(0, 0, 0, 0.40)',
    },
  },
};

/** 4-point spacing scale. */
export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  /** Page side gutter, from Figma. */
  gutter: 24,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

/** Minimum touch target (Android accessibility guidance). */
export const TOUCH_TARGET = 48;

/**
 * Type scale. One family (Nunito, already bundled); swapping to the system
 * font is a one-line change to `family` (open question in the brief).
 * Sizes are in dp and scale with the user's font size setting.
 */
// Same families as src/constants/theme.ts (loaded in the root layout). Kept
// here as plain names so the tokens can be imported without the CSS that
// module pulls in.
const family = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;
export const type = {
  display: { fontFamily: family.extraBold, fontSize: 34, lineHeight: 40 },
  title1: { fontFamily: family.bold, fontSize: 28, lineHeight: 34 },
  title2: { fontFamily: family.bold, fontSize: 22, lineHeight: 28 },
  title3: { fontFamily: family.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: family.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: family.semiBold, fontSize: 16, lineHeight: 24 },
  /** Long-form reading and tutor answers. */
  reading: { fontFamily: family.regular, fontSize: 17, lineHeight: 28 },
  callout: { fontFamily: family.medium, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: family.semiBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: family.medium, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: family.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.8 },
  tab: { fontFamily: family.semiBold, fontSize: 11, lineHeight: 14 },
} as const;
export type TypeVariant = keyof typeof type;

/** Motion. All durations collapse to 0 when the OS asks for reduced motion. */
export const motion = {
  duration: { fast: 120, base: 200, slow: 320 },
  /** Standard and emphasised easing, as cubic-bezier control points. */
  easing: { standard: [0.2, 0, 0, 1] as const, emphasized: [0.3, 0, 0, 1] as const },
  pressedScale: 0.98,
  pressedOpacity: 0.85,
} as const;
