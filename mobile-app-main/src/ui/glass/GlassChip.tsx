import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space, TOUCH_TARGET } from '@/theme/glass/tokens';

import { AppText } from './AppText';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** 'radio' inside a single-choice group, 'checkbox' for multi-select filters. */
  role?: 'radio' | 'checkbox' | 'button';
  disabled?: boolean;
  testID?: string;
};

/**
 * Filter or choice chip. The visible pill is 36dp; the touch area is 48dp.
 * Selection is shown by fill, a check icon and a border, never by colour alone.
 */
export function GlassChip({ label, selected = false, onPress, icon, role = 'checkbox', disabled, testID }: Props) {
  const { colors, surface } = useGlassTheme();
  const state = role === 'button' ? { disabled: !!disabled } : { checked: selected, disabled: !!disabled };
  return (
    <Pressable
      testID={testID}
      accessibilityRole={role}
      accessibilityState={state}
      accessibilityLabel={label}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.target, pressed && { opacity: 0.7 }, disabled && { opacity: 0.5 }]}
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: selected ? colors.accent.tint : surface.card,
            borderColor: selected ? colors.text.accent : surface.edge,
          },
        ]}
      >
        {selected ? (
          <Ionicons name="checkmark" size={16} color={colors.text.accent} />
        ) : icon ? (
          <Ionicons name={icon} size={16} color={colors.text.secondary} />
        ) : null}
        <AppText variant="label" tone={selected ? 'accent' : 'primary'} numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: { minHeight: TOUCH_TARGET, justifyContent: 'center' },
  pill: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
