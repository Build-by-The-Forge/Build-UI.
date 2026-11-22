import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { space, TOUCH_TARGET } from '@/theme/glass/tokens';

import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';

type Props = {
  title: string;
  subtitle?: string;
  /** Usually a GlassIconButton (back, close). */
  left?: React.ReactNode;
  right?: React.ReactNode;
  /** Large title for top-level screens; compact for pushed screens. */
  size?: 'large' | 'compact';
};

/** Top navigation bar: one of the screen's (at most two) live blur layers. */
export function GlassHeader({ title, subtitle, left, right, size = 'compact' }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <GlassSurface kind="chrome" blur radius={0} elevation="chrome">
      <View style={[styles.row, { paddingTop: insets.top + space.sm }]}>
        <View style={styles.side}>{left}</View>
        <View style={styles.titles}>
          {subtitle ? (
            <AppText variant="label" tone="secondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
          <AppText variant={size === 'large' ? 'title1' : 'title3'} numberOfLines={1}>
            {title}
          </AppText>
        </View>
        <View style={[styles.side, styles.right]}>{right}</View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    gap: space.sm,
  },
  side: { minWidth: TOUCH_TARGET, minHeight: TOUCH_TARGET, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  titles: { flex: 1 },
});
