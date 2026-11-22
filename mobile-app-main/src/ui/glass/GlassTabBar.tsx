import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space, TOUCH_TARGET } from '@/theme/glass/tokens';

import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';

export type TabItem = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  activeIcon?: React.ComponentProps<typeof Ionicons>['name'];
  /** Optional unread count; announced to screen readers. */
  badge?: number;
};

type Props = {
  items: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
};

/** Bottom tab bar: floating glass, the screen's main live blur layer. */
export function GlassTabBar({ items, activeKey, onSelect }: Props) {
  const { colors } = useGlassTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
      <GlassSurface kind="chrome" blur radius={radius.xl} elevation="chrome">
        <View style={styles.row} accessibilityRole="tablist">
          {items.map((item) => {
            const active = item.key === activeKey;
            const tone = active ? 'accent' : 'secondary';
            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item.badge ? `${item.label}, ${item.badge} new` : item.label}
                onPress={() => onSelect(item.key)}
                style={({ pressed }) => [styles.tab, pressed && { opacity: 0.7 }]}
              >
                <View style={[styles.pill, active && { backgroundColor: colors.accent.tint }]}>
                  <Ionicons
                    name={active ? item.activeIcon ?? item.icon : item.icon}
                    size={22}
                    color={colors.text[tone]}
                  />
                </View>
                <AppText variant="tab" tone={tone} numberOfLines={1} maxFontSizeMultiplier={1.3}>
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.md },
  row: { flexDirection: 'row', paddingVertical: space.xs, paddingHorizontal: space.xs },
  tab: {
    flex: 1,
    minHeight: TOUCH_TARGET + 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pill: { paddingHorizontal: space.lg, paddingVertical: 4, borderRadius: radius.pill },
});
