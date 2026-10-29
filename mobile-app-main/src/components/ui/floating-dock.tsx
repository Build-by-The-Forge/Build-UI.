import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onPress?: () => void;
  isActive?: boolean;
  badge?: string | number;
  isSpecial?: boolean;
}

export interface FloatingDockProps {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showTooltips?: boolean;
}

export function FloatingDock({ items, style, containerStyle }: FloatingDockProps) {
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const { mode } = useTheme();
  const dark = mode === 'dark';
  const desktop = width >= 760;
  const compact = width < 360;
  const accent = dark ? '#8AB8FF' : '#2563EB';

  return <View style={[styles.outer, desktop && styles.outerDesktop, containerStyle]} pointerEvents="box-none">
    <View style={[styles.bar, desktop && styles.barDesktop, dark && styles.barDark, { paddingBottom: desktop ? 9 : Math.max(bottom, 8) }, style]}>
      {items.map((item) => {
        const selected = !!item.isActive;
        return <Pressable
          key={item.title}
          onPress={item.onPress}
          accessibilityRole="tab"
          accessibilityLabel={item.title}
          accessibilityState={{ selected }}
          style={({ pressed }) => [styles.item, desktop && styles.itemDesktop, pressed && styles.itemPressed]}
        >
          <View style={[styles.iconWrap, selected && (dark ? styles.iconActiveDark : styles.iconActive), item.isSpecial && (dark ? styles.aiWrapDark : styles.aiWrap)]}>
            {item.icon}
            {item.badge !== undefined && <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>}
          </View>
          <Text numberOfLines={1} style={[styles.label, compact && styles.labelCompact, dark && styles.labelDark, selected && { color: accent, fontWeight: '800' }]}>{item.title}</Text>
          {selected && <View style={[styles.indicator, { backgroundColor: accent }]} />}
        </Pressable>;
      })}
    </View>
  </View>;
}

export function FloatingDockDesktop(props: FloatingDockProps) { return <FloatingDock {...props} />; }
export function FloatingDockMobile(props: FloatingDockProps) { return <FloatingDock {...props} />; }

const styles = StyleSheet.create({
  outer: { width: '100%', alignItems: 'center' },
  outerDesktop: { paddingHorizontal: 20 },
  bar: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#E1E8F2', paddingTop: 7, paddingHorizontal: 5, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  barDark: { backgroundColor: '#172235', borderColor: '#304055' },
  barDesktop: { maxWidth: 680, borderWidth: 1, borderRadius: 20, paddingHorizontal: 13, paddingTop: 9 },
  item: { flex: 1, minWidth: 0, minHeight: 57, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 1, position: 'relative' },
  itemDesktop: { minHeight: 58 }, itemPressed: { opacity: 0.65 },
  iconWrap: { width: 43, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: '#EAF2FF' }, iconActiveDark: { backgroundColor: '#263F64' },
  aiWrap: { backgroundColor: '#F1F5FF' }, aiWrapDark: { backgroundColor: '#FFFFFF' },
  label: { marginTop: 4, color: '#62738A', fontSize: 10, lineHeight: 13, fontWeight: '700', textAlign: 'center' },
  labelCompact: { fontSize: 10 }, labelDark: { color: '#B5C3D5' },
  indicator: { position: 'absolute', bottom: 0, width: 19, height: 2, borderRadius: 1 },
  badge: { position: 'absolute', top: -3, right: -3, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: '#D74646', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
});

export default FloatingDock;
