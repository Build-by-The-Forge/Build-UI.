import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space, TOUCH_TARGET } from '@/theme/glass/tokens';

import { AppText } from './AppText';

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Plain-text label read by screen readers. */
  label: string;
  /** Optional rich content shown instead of the plain label (links, bold). */
  children?: React.ReactNode;
  error?: string | null;
  disabled?: boolean;
  testID?: string;
};

/** 24dp box inside a 48dp row target; state shown by a check mark, not colour alone. */
export function GlassCheckbox({ checked, onChange, label, children, error, disabled, testID }: Props) {
  const { colors, surface } = useGlassTheme();
  return (
    <View style={styles.wrap}>
      <Pressable
        testID={testID}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled: !!disabled }}
        accessibilityLabel={label}
        accessibilityHint={error ?? undefined}
        disabled={disabled}
        onPress={() => onChange(!checked)}
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }, disabled && { opacity: 0.5 }]}
      >
        <View
          style={[
            styles.box,
            {
              backgroundColor: checked ? colors.accent.pressed : surface.input,
              borderColor: error ? colors.text.danger : checked ? colors.accent.pressed : colors.text.secondary,
            },
          ]}
        >
          {checked ? <Ionicons name="checkmark" size={18} color={colors.text.onAccent} /> : null}
        </View>
        <View style={styles.label}>{children ?? <AppText variant="callout">{label}</AppText>}</View>
      </Pressable>
      {error ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  row: { minHeight: TOUCH_TARGET, flexDirection: 'row', alignItems: 'center', gap: space.md },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.xs - 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
});
