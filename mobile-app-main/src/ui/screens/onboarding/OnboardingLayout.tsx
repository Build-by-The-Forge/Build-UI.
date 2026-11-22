import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space } from '@/theme/glass/tokens';
import { AppText, GlassIconButton, GlassScreen, GlassSurface, useChromeInsets } from '@/ui/glass';

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  /** Sticky bottom actions: the primary GlassButton and an optional secondary one. */
  actions: React.ReactNode;
  testID?: string;
};

/** Segmented progress, announced as "Step 2 of 5". */
export function StepProgress({ step, total }: { step: number; total: number }) {
  const { colors, surface } = useGlassTheme();
  return (
    <View
      style={styles.progress}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${step} of ${total}`}
      accessibilityValue={{ min: 1, max: total, now: step, text: `Step ${step} of ${total}` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.segment, { backgroundColor: i < step ? colors.accent.pressed : surface.edge }]}
        />
      ))}
    </View>
  );
}

/**
 * Frame for every onboarding step: glass header with back and progress, a
 * scrolling body, and a glass action bar pinned to the bottom (the screen's
 * two live blur layers when the treatment allows them).
 */
export function OnboardingLayout({ step, total, title, subtitle, onBack, children, actions, testID }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <GlassScreen
      testID={testID}
      header={
        <GlassSurface kind="chrome" blur radius={0} elevation="chrome">
          <View style={[styles.header, { paddingTop: insets.top + space.sm }]}>
            {onBack ? (
              <GlassIconButton icon="chevron-back" accessibilityLabel="Back" onPress={onBack} />
            ) : (
              <View style={styles.backSpacer} />
            )}
            <View style={styles.headerMid}>
              <AppText variant="caption" tone="secondary">
                Step {step} of {total}
              </AppText>
              <StepProgress step={step} total={total} />
            </View>
            <View style={styles.backSpacer} />
          </View>
        </GlassSurface>
      }
      footer={
        <GlassSurface kind="chrome" blur radius={radius.xxl} corners={{ topLeft: true, topRight: true }} elevation="chrome">
          <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>{actions}</View>
        </GlassSurface>
      }
    >
      <Body>
        <View style={styles.heading}>
          <AppText variant="title1">{title}</AppText>
          {subtitle ? <AppText tone="secondary">{subtitle}</AppText> : null}
        </View>
        {children}
      </Body>
    </GlassScreen>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  const chrome = useChromeInsets();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.body, { paddingTop: chrome.top + space.xl, paddingBottom: chrome.bottom + space.xl }]}
      scrollIndicatorInsets={{ top: chrome.top, bottom: chrome.bottom }}
    >
      {children}
    </ScrollView>
  );
}

/** Section label above a choice list ("School", "Department"). */
export function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="overline" tone="secondary" style={styles.section}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingBottom: space.md, gap: space.sm },
  headerMid: { flex: 1, gap: space.xs, alignItems: 'center' },
  backSpacer: { width: 48 },
  progress: { flexDirection: 'row', gap: space.xs, alignSelf: 'stretch' },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  body: { paddingHorizontal: space.gutter, gap: space.lg },
  heading: { gap: space.sm, marginBottom: space.sm },
  section: { marginTop: space.md },
  actions: { paddingHorizontal: space.gutter, paddingTop: space.lg, gap: space.sm },
});
