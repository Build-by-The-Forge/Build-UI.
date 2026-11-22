import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { EffectsPreference } from '@/theme/glass/capability';
import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { space } from '@/theme/glass/tokens';

import { AppText } from './AppText';
import { GlassChip } from './GlassChip';

const OPTIONS: { value: EffectsPreference; label: string }[] = [
  { value: 'auto', label: 'Automatic' },
  { value: 'full', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
  { value: 'opaque', label: 'Off' },
];

const TIER_NAMES = { full: 'full effects', reduced: 'reduced effects', opaque: 'effects off' } as const;

/**
 * "Visual effects" setting. Automatic follows the device heuristic; the
 * student can override it either way. Nothing else in the app changes:
 * effects only change how surfaces look, never what is on screen.
 */
export function EffectsSettingControl() {
  const { preference, setPreference, auto } = useGlassTheme();
  return (
    <View style={styles.wrap}>
      <AppText variant="title3">Visual effects</AppText>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Visual effects">
        {OPTIONS.map((o) => (
          <GlassChip
            key={o.value}
            role="radio"
            label={o.label}
            selected={preference === o.value}
            onPress={() => setPreference(o.value)}
            testID={`effects-${o.value}`}
          />
        ))}
      </View>
      <AppText variant="caption" tone="secondary">
        {preference === 'auto'
          ? `Automatic is using ${TIER_NAMES[auto.tier]}. ${auto.reason}`
          : 'Turn effects off if the app feels slow or the glass is hard to read.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
