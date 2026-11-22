import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { motion, radius, space, TOUCH_TARGET } from '@/theme/glass/tokens';

import { AppText, type TextTone } from './AppText';
import { GlassSurface } from './GlassSurface';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  onPress: () => void;
  /** primary: gradient call to action. secondary: glass. ghost: text only. danger: destructive glass. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Extra context for screen readers when the label alone is ambiguous. */
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Height 56 (Figma), never below the 48dp touch target. */
export function GlassButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  accessibilityHint,
  style,
  testID,
}: Props) {
  const theme = useGlassTheme();
  const inactive = disabled || loading;
  const tone: TextTone = variant === 'primary' ? 'onAccent' : variant === 'danger' ? 'danger' : 'accent';
  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={theme.colors.text[tone]} accessibilityElementsHidden />
      ) : icon ? (
        <Ionicons name={icon} size={20} color={theme.colors.text[tone]} />
      ) : null}
      <AppText variant="bodyStrong" tone={tone} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        inactive && styles.disabled,
        pressed && {
          opacity: motion.pressedOpacity,
          transform: theme.reduceMotion ? undefined : [{ scale: motion.pressedScale }],
        },
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={theme.colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { boxShadow: theme.shadow.raised }]}
        >
          {content}
        </LinearGradient>
      ) : variant === 'ghost' ? (
        <View style={styles.fill}>{content}</View>
      ) : (
        <GlassSurface kind="card" radius={radius.lg} elevation="none" style={styles.fill}>
          {content}
        </GlassSurface>
      )}
    </Pressable>
  );
}

type IconButtonProps = {
  icon: IconName;
  /** Required: an icon has no visible text for screen readers. */
  accessibilityLabel: string;
  onPress: () => void;
  variant?: 'glass' | 'plain';
  disabled?: boolean;
  testID?: string;
};

/** 48x48 icon button (back, close, more). */
export function GlassIconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'glass',
  disabled,
  testID,
}: IconButtonProps) {
  const { colors } = useGlassTheme();
  const glyph = <Ionicons name={icon} size={22} color={colors.text.primary} />;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, disabled && styles.disabled, pressed && { opacity: 0.7 }]}
    >
      {variant === 'glass' ? (
        <GlassSurface kind="card" radius={radius.pill} elevation="none" style={styles.iconFill}>
          {glyph}
        </GlassSurface>
      ) : (
        glyph
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 56, borderRadius: radius.lg },
  fill: { minHeight: 56, borderRadius: radius.lg, justifyContent: 'center' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
  },
  disabled: { opacity: 0.5 },
  iconButton: { width: TOUCH_TARGET, height: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' },
  iconFill: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
