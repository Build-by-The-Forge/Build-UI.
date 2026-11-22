import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space } from '@/theme/glass/tokens';
import { AppText, GlassButton, GlassNotice, GlassSurface } from '@/ui/glass';

import { OnboardingLayout } from './OnboardingLayout';

export type SummaryRow = { label: string; value: string };

type Props = {
  step: number;
  total: number;
  /** What the student chose, as saved by the backend. */
  summary: readonly SummaryRow[];
  onFinish: () => void;
  onBack?: () => void;
  saving: boolean;
  error?: string | null;
};

/** Last step: review what was chosen and save the academic profile. */
export function OnboardingDoneView({ step, total, summary, onFinish, onBack, saving, error }: Props) {
  const { colors } = useGlassTheme();
  return (
    <OnboardingLayout
      testID="onboarding-done"
      step={step}
      total={total}
      title="You're all set"
      subtitle="Check your details. You can change them later in Settings."
      onBack={saving ? undefined : onBack}
      actions={<GlassButton label="Save and go to my dashboard" onPress={onFinish} loading={saving} testID="onboarding-finish" />}
    >
      <View style={styles.hero} importantForAccessibility="no-hide-descendants">
        <View style={[styles.badge, { backgroundColor: colors.status.successTint }]}>
          <Ionicons name="checkmark" size={36} color={colors.text.success} />
        </View>
      </View>
      {error ? <GlassNotice tone="danger" message={error} /> : null}
      <GlassSurface kind="card" style={styles.card}>
        {summary.map((row, i) => (
          <View
            key={row.label}
            style={[styles.row, i > 0 && styles.divided]}
            accessible
            accessibilityLabel={`${row.label}: ${row.value}`}
          >
            <AppText variant="label" tone="secondary">
              {row.label}
            </AppText>
            <AppText variant="bodyStrong" style={styles.value}>
              {row.value}
            </AppText>
          </View>
        ))}
      </GlassSurface>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: space.sm },
  badge: { width: 72, height: 72, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  card: { paddingHorizontal: space.xl, paddingVertical: space.sm },
  row: { paddingVertical: space.md, gap: 2 },
  divided: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(100, 116, 139, 0.3)' },
  value: {},
});
