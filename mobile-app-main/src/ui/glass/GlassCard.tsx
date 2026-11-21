import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { motion, radius, space } from '@/theme/glass/tokens';

import { GlassSurface } from './GlassSurface';

type Props = {
  children: React.ReactNode;
  /** Makes the whole card one button. Give it an accessibilityLabel. */
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Content card. Never blurs, so it is safe inside scrolling lists: its glass
 * look comes from the translucent fill over the ambient background.
 */
export function GlassCard({ children, onPress, accessibilityLabel, accessibilityHint, padding = space.xl, style, testID }: Props) {
  const { reduceMotion } = useGlassTheme();
  const body = (
    <GlassSurface kind="card" radius={radius.xl} style={style}>
      <View style={{ padding }}>{children}</View>
    </GlassSurface>
  );
  if (!onPress) return <View testID={testID}>{body}</View>;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) =>
        pressed
          ? [styles.pressed, !reduceMotion && { transform: [{ scale: motion.pressedScale }] }]
          : undefined
      }
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: motion.pressedOpacity },
});
