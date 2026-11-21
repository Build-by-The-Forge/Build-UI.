import {
  AA_BODY,
  AA_LARGE,
  contrastOnLayers,
  composite,
  contrastRatio,
  luminance,
  parseColor,
  toHex,
} from '../contrast';
import { GLASS_TIERS, palettes, surfaces, type ColorScheme } from '../tokens';

const schemes: ColorScheme[] = ['light', 'dark'];

/**
 * Every colour the page background can show: the gradient stops, and each
 * soft colour field drawn at its opacity over every stop, alone or where two
 * fields overlap. AmbientBackground draws exactly this, so it is the honest
 * worst case for text and cards placed straight on the page.
 */
function pageColours(scheme: ColorScheme): string[] {
  const bg = palettes[scheme].background;
  const stops = [bg.base, ...bg.gradient];
  const field = (c: string) => c.replace(/^#(..)(..)(..)$/, (_m, r, g, b2) =>
    `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b2, 16)}, ${bg.fieldOpacity})`);
  const out = [...stops];
  for (const stop of stops) {
    for (const f1 of bg.fields) {
      out.push(toHex(composite(field(f1), stop)));
      for (const f2 of bg.fields) {
        if (f2 !== f1) out.push(toHex(composite(field(f2), toHex(composite(field(f1), stop)))));
      }
    }
  }
  return out;
}

function worstPageColour(scheme: ColorScheme): string {
  const byLum = pageColours(scheme).sort((a, b) => luminance(parseColor(a)) - luminance(parseColor(b)));
  return scheme === 'light' ? byLum[0] : byLum[byLum.length - 1];
}

describe('contrast maths', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio(parseColor('#000000'), parseColor('#FFFFFF'))).toBeCloseTo(21, 5);
    expect(contrastRatio(parseColor('#777777'), parseColor('#FFFFFF'))).toBeCloseTo(4.48, 2);
  });

  it('composites translucent layers before measuring', () => {
    // 50% white over black is mid grey (#808080 ≈ 3.95:1 against black).
    expect(contrastOnLayers('#000000', ['rgba(255,255,255,0.5)', '#000000'])).toBeCloseTo(5.28, 1);
  });
});

describe.each(schemes)('%s scheme', (scheme) => {
  const p = palettes[scheme];
  const bodyText = [p.text.primary, p.text.secondary, p.text.accent, p.text.danger, p.text.success, p.text.warning];

  it.each(bodyText)('text %s on the page background passes AA everywhere on the gradient', (text) => {
    for (const colour of pageColours(scheme)) {
      expect(contrastOnLayers(text, [colour])).toBeGreaterThanOrEqual(AA_BODY);
    }
  });

  describe.each(GLASS_TIERS)('%s treatment', (tier) => {
    const s = surfaces[scheme][tier];
    const page = worstPageColour(scheme);
    const underChrome = p.background.worstUnderChrome;

    it.each(bodyText)('text %s on a card over the worst page colour passes AA', (text) => {
      expect(contrastOnLayers(text, [s.card, page])).toBeGreaterThanOrEqual(AA_BODY);
    });

    it.each(bodyText)('text %s on chrome over the worst content passes AA', (text) => {
      expect(contrastOnLayers(text, [s.chrome, underChrome])).toBeGreaterThanOrEqual(AA_BODY);
    });

    it.each(bodyText)('text %s on a sheet over the worst content passes AA', (text) => {
      expect(contrastOnLayers(text, [s.sheet, underChrome])).toBeGreaterThanOrEqual(AA_BODY);
    });

    it('input text and placeholder pass AA over the worst page colour', () => {
      expect(contrastOnLayers(p.text.primary, [s.input, page])).toBeGreaterThanOrEqual(AA_BODY);
      expect(contrastOnLayers(p.text.secondary, [s.input, page])).toBeGreaterThanOrEqual(AA_BODY);
    });

    it('opaque treatment really is opaque', () => {
      if (tier !== 'opaque') return;
      for (const key of ['card', 'chrome', 'sheet', 'input'] as const) {
        expect(parseColor(s[key]).a).toBe(1);
      }
    });
  });

  it('white text passes AA on both stops of the primary button gradient', () => {
    for (const stop of p.accent.gradient) {
      expect(contrastOnLayers(p.text.onAccent, [stop])).toBeGreaterThanOrEqual(AA_BODY);
    }
  });

  it('status text passes AA on its own tint', () => {
    expect(contrastOnLayers(p.text.danger, [p.status.dangerTint])).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrastOnLayers(p.text.success, [p.status.successTint])).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrastOnLayers(p.text.warning, [p.status.warningTint])).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrastOnLayers(p.text.accent, [p.status.infoTint])).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrastOnLayers(p.text.primary, [p.accent.tint])).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrastOnLayers(p.text.accent, [p.accent.tint])).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('icon tile glyphs pass 3:1 on their tiles', () => {
    for (const key of ['blue', 'orange', 'purple', 'green'] as const) {
      expect(contrastOnLayers(p.tileGlyphs[key], [p.tiles[key]])).toBeGreaterThanOrEqual(AA_LARGE);
    }
  });
});
