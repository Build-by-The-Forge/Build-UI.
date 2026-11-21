/**
 * WCAG 2.x contrast maths, used by the tests to prove that every text colour
 * meets AA over the worst background it can sit on, in every treatment.
 *
 * Colours are `#RRGGBB` or `rgba(r, g, b, a)` strings. Translucent colours are
 * composited over an opaque backdrop before measuring, which is how the eye
 * sees a glass surface over whatever is behind it.
 */

export type Rgb = { r: number; g: number; b: number };
export type Rgba = Rgb & { a: number };

export function parseColor(color: string): Rgba {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = color
    .trim()
    .match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  throw new Error(`Unsupported colour: ${color}`);
}

/** Source-over compositing of `top` on an opaque `bottom`. */
export function composite(top: string, bottom: string): Rgb {
  const t = parseColor(top);
  const b = parseColor(bottom);
  if (b.a !== 1) throw new Error(`Backdrop must be opaque: ${bottom}`);
  return {
    r: t.r * t.a + b.r * (1 - t.a),
    g: t.g * t.a + b.g * (1 - t.a),
    b: t.b * t.a + b.b * (1 - t.a),
  };
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Contrast of `text` on a stack of layers, top first, ending in an opaque
 * backdrop. Example: text on a glass fill over the worst page colour:
 * `contrastOnLayers('#0F172A', ['rgba(255,255,255,0.8)', '#000000'])`.
 */
export function contrastOnLayers(text: string, layers: string[]): number {
  if (layers.length === 0) throw new Error('Need at least a backdrop');
  let base = parseColor(layers[layers.length - 1]);
  if (base.a !== 1) throw new Error('Last layer must be opaque');
  let rgb: Rgb = base;
  for (let i = layers.length - 2; i >= 0; i -= 1) {
    rgb = composite(layers[i], toHex(rgb));
  }
  base = { ...rgb, a: 1 };
  const t = parseColor(text);
  const textRgb = t.a === 1 ? t : composite(text, toHex(base));
  return contrastRatio(textRgb, base);
}

export function toHex({ r, g, b }: Rgb): string {
  const h = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** WCAG AA: 4.5:1 for body text, 3:1 for large text (>= 24px, or >= 18.66px bold) and UI glyphs. */
export const AA_BODY = 4.5;
export const AA_LARGE = 3;
