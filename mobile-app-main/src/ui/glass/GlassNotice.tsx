import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space } from '@/theme/glass/tokens';

import { AppText } from './AppText';

export type NoticeTone = 'info' | 'danger' | 'success' | 'warning';

type Props = {
  tone?: NoticeTone;
  title?: string;
  message: string;
  /** Optional action, usually a ghost GlassButton ("Try again"). */
  action?: React.ReactNode;
  testID?: string;
};

const ICON = {
  info: 'information-circle',
  danger: 'alert-circle',
  success: 'checkmark-circle',
  warning: 'warning',
} as const;

/**
 * Inline message for errors, warnings and confirmations. Opaque status tint
 * in every treatment (status text must never depend on what is behind it),
 * an icon so meaning is not carried by colour alone, and announced to screen
 * readers: errors assertively, everything else politely.
 */
export function GlassNotice({ tone = 'info', title, message, action, testID }: Props) {
  const { colors } = useGlassTheme();
  const tint = {
    info: colors.status.infoTint,
    danger: colors.status.dangerTint,
    success: colors.status.successTint,
    warning: colors.status.warningTint,
  }[tone];
  const textTone = tone === 'info' ? 'accent' : tone;
  return (
    <View testID={testID} style={[styles.box, { backgroundColor: tint }]}>
      {/* Icon and text are one announcement; the action stays separately focusable. */}
      <View
        accessible
        accessibilityRole={tone === 'danger' ? 'alert' : 'text'}
        accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
        style={styles.row}
      >
        <Ionicons name={ICON[tone]} size={20} color={colors.text[textTone]} style={styles.icon} />
        <View style={styles.body}>
          {title ? (
            <AppText variant="label" tone={textTone}>
              {title}
            </AppText>
          ) : null}
          <AppText variant="callout" tone={textTone}>
            {message}
          </AppText>
        </View>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: space.sm, padding: space.lg, borderRadius: radius.md },
  row: { flexDirection: 'row', gap: space.md },
  icon: { marginTop: 1 },
  body: { flex: 1, gap: space.xs },
});
