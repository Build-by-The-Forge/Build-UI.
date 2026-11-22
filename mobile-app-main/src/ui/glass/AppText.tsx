import React from 'react';
import { Text, type TextProps } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { type as typeScale, type TypeVariant } from '@/theme/glass/tokens';

export type TextTone = 'primary' | 'secondary' | 'accent' | 'onAccent' | 'danger' | 'success' | 'warning';

type Props = TextProps & {
  variant?: TypeVariant;
  tone?: TextTone;
  /** Centre, end-align, etc. */
  align?: 'auto' | 'left' | 'center' | 'right';
};

/** Big display sizes cap their scaling so a 200% font setting still fits a phone. */
const MAX_SCALE: Partial<Record<TypeVariant, number>> = { display: 1.4, title1: 1.6, title2: 1.8 };
const HEADINGS: TypeVariant[] = ['display', 'title1', 'title2', 'title3'];

/**
 * All text in the app goes through here: it applies the type scale and a
 * tone that is proven to pass WCAG AA on every glass surface. Text scales
 * with the phone's font size setting.
 */
export function AppText({ variant = 'body', tone = 'primary', align, style, ...rest }: Props) {
  const { colors } = useGlassTheme();
  const t = typeScale[variant];
  return (
    <Text
      accessibilityRole={HEADINGS.includes(variant) ? 'header' : undefined}
      maxFontSizeMultiplier={MAX_SCALE[variant]}
      {...rest}
      style={[
        t,
        variant === 'overline' && { textTransform: 'uppercase' },
        { color: colors.text[tone] },
        align && { textAlign: align },
        style,
      ]}
    />
  );
}
