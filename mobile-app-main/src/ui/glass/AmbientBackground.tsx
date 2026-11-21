import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * The calm page backdrop that gives glass something to show: a three-stop
 * gradient and three soft colour fields, drawn with native gradients (no
 * images, nothing to download). Static: it never animates.
 * The contrast tests assume exactly these colours at these strengths.
 */
export function AmbientBackground() {
  const { colors } = useGlassTheme();
  const bg = colors.background;
  const [g0, g1, g2] = bg.gradient;
  const [f0, f1, f2] = bg.fields.map((f) => withAlpha(f, bg.fieldOpacity));
  const image = [
    `radial-gradient(circle at 12% 8%, ${f0} 0%, transparent 45%)`,
    `radial-gradient(circle at 92% 30%, ${f1} 0%, transparent 40%)`,
    `radial-gradient(circle at 30% 85%, ${f2} 0%, transparent 45%)`,
    `linear-gradient(170deg, ${g0} 0%, ${g1} 55%, ${g2} 100%)`,
  ].join(', ');
  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, { backgroundColor: bg.base, experimental_backgroundImage: image }]}
    />
  );
}
