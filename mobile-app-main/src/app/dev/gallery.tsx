/**
 * Component gallery: every glass primitive, in the current treatment, plus
 * the three treatments side by side. Development builds only: a release build
 * redirects away, and the route is not linked from anywhere in the app.
 * Open it with: npx uri-scheme open buildappmain://dev/gallery --android
 * (or type /dev/gallery in Expo Go's URL bar).
 */
import * as Device from 'expo-device';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useGlassTheme, GlassThemeOverride } from '@/theme/glass/GlassThemeProvider';
import { GLASS_TIERS, space, type as typeScale, type ColorScheme, type TypeVariant } from '@/theme/glass/tokens';
import {
  AppText,
  EffectsSettingControl,
  GlassButton,
  GlassCard,
  GlassChip,
  GlassHeader,
  GlassIconButton,
  GlassInput,
  GlassModal,
  GlassScreen,
  GlassSurface,
  GlassTabBar,
  useChromeInsets,
} from '@/ui/glass';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'courses', label: 'Courses', icon: 'school-outline', activeIcon: 'school' },
  { key: 'tutor', label: 'Tutor', icon: 'sparkles-outline', activeIcon: 'sparkles' },
  { key: 'cbt', label: 'CBT', icon: 'create-outline', activeIcon: 'create' },
  { key: 'me', label: 'Me', icon: 'person-outline', activeIcon: 'person' },
] as const;

const TIER_LABEL = { full: 'Full glass', reduced: 'Reduced', opaque: 'Effects off' } as const;

export default function GalleryRoute() {
  const [scheme, setScheme] = useState<ColorScheme | null>(null);
  if (!__DEV__) return <Redirect href="/" />;
  return (
    <GlassThemeOverride scheme={scheme ?? undefined}>
      <Gallery scheme={scheme} setScheme={setScheme} />
    </GlassThemeOverride>
  );
}

function Gallery({ scheme, setScheme }: { scheme: ColorScheme | null; setScheme: (s: ColorScheme | null) => void }) {
  const [tab, setTab] = useState('home');
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [chips, setChips] = useState<string[]>(['CSC 201']);
  const [email, setEmail] = useState('');
  const theme = useGlassTheme();

  return (
    <GlassScreen
      testID="gallery"
      header={
        <GlassHeader
          title="Glass gallery"
          subtitle={`Treatment: ${TIER_LABEL[theme.tier]} · ${theme.scheme}`}
          left={
            <GlassIconButton
              icon="chevron-back"
              accessibilityLabel="Back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          }
        />
      }
      footer={<GlassTabBar items={[...TABS]} activeKey={tab} onSelect={setTab} />}
    >
      <Body>
        <Section title="Treatment">
          <EffectsSettingControl />
          <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Colour scheme">
            {(['system', 'light', 'dark'] as const).map((s) => (
              <GlassChip
                key={s}
                role="radio"
                label={s === 'system' ? 'App setting' : s === 'light' ? 'Light' : 'Dark'}
                selected={(scheme ?? 'system') === s}
                onPress={() => setScheme(s === 'system' ? null : s)}
              />
            ))}
          </View>
          <AppText variant="caption" tone="secondary">
            Blur budget on this screen: {theme.blur.maxLayers} live layer(s). Header and tab bar ask for one each.
          </AppText>
        </Section>

        <Section title="Device signals (for on-device checks)">
          <GlassSurface kind="card" style={{ padding: space.lg, gap: space.xs }} testID="device-signals">
            <AppText variant="label">
              Total RAM reported: {Device.totalMemory === null ? 'unknown' : `${(Device.totalMemory / 1024 ** 3).toFixed(2)} GiB (${Device.totalMemory} bytes)`}
            </AppText>
            <AppText variant="label">Android API level: {Device.platformApiLevel ?? 'n/a'}</AppText>
            <AppText variant="label">Model: {Device.modelName ?? 'unknown'} · OS {Device.osVersion ?? '?'}</AppText>
            <AppText variant="label">
              Automatic tier: {theme.auto.tier} · in use: {theme.tier} · reduce motion: {String(theme.reduceMotion)}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {theme.auto.reason} RAM is physical memory from Android's ActivityManager; virtual RAM (swap, Samsung RAM Plus) is not counted.
            </AppText>
          </GlassSurface>
        </Section>

        <Section title="Three treatments side by side">
          <View style={styles.tiers}>
            {GLASS_TIERS.map((tier) => (
              <GlassThemeOverride key={tier} tier={tier}>
                <View style={styles.tierCard}>
                  <GlassCard padding={space.md}>
                    <AppText variant="label">{TIER_LABEL[tier]}</AppText>
                    <AppText variant="caption" tone="secondary">
                      Same layout
                    </AppText>
                  </GlassCard>
                </View>
              </GlassThemeOverride>
            ))}
          </View>
        </Section>

        <Section title="Buttons">
          <GlassButton label="Start CBT" icon="play" onPress={() => {}} />
          <GlassButton label="Secondary" variant="secondary" onPress={() => {}} />
          <GlassButton label="Ghost" variant="ghost" onPress={() => {}} />
          <GlassButton label="Delete document" variant="danger" icon="trash-outline" onPress={() => setDialog(true)} />
          <GlassButton label="Signing in" loading onPress={() => {}} />
          <GlassButton label="Disabled" disabled onPress={() => {}} />
        </Section>

        <Section title="Inputs">
          <GlassInput label="Email address" icon="mail-outline" placeholder="you@futa.edu.ng" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" hint="Use your student email." />
          <GlassInput label="Password" icon="lock-closed-outline" secret placeholder="Password" />
          <GlassInput label="Matric number" error="Enter a matric number like CSC/20/1234." defaultValue="CSC20" />
          <GlassInput label="Disabled" editable={false} defaultValue="Read only" />
        </Section>

        <Section title="Chips">
          <View style={styles.row}>
            {['CSC 201', 'MTS 202', 'PHY 204', 'GST 211'].map((c) => (
              <GlassChip
                key={c}
                label={c}
                selected={chips.includes(c)}
                onPress={() => setChips((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]))}
              />
            ))}
          </View>
        </Section>

        <Section title="Cards (list-safe: no blur)">
          {[1, 2, 3].map((n) => (
            <GlassCard key={n} onPress={() => {}} accessibilityLabel={`Sample card ${n}`}>
              <AppText variant="title3">Sample card {n}</AppText>
              <AppText tone="secondary">Placeholder copy for layout only. Real screens show API data.</AppText>
            </GlassCard>
          ))}
        </Section>

        <Section title="Sheets and dialogs">
          <GlassButton label="Open bottom sheet" variant="secondary" onPress={() => setSheet(true)} />
          <GlassButton label="Open dialog" variant="secondary" onPress={() => setDialog(true)} />
        </Section>

        <Section title="Type scale">
          {(Object.keys(typeScale) as TypeVariant[]).map((v) => (
            <AppText key={v} variant={v}>
              {v} {typeScale[v].fontSize}/{typeScale[v].lineHeight}
            </AppText>
          ))}
        </Section>

        <Section title="Text tones on a card">
          <GlassSurface kind="card" style={{ padding: space.lg, gap: space.xs }}>
            {(['primary', 'secondary', 'accent', 'danger', 'success', 'warning'] as const).map((t) => (
              <AppText key={t} tone={t}>
                {t}: passes WCAG AA on every surface
              </AppText>
            ))}
          </GlassSurface>
        </Section>
      </Body>

      <GlassModal
        visible={sheet}
        title="Bottom sheet"
        onClose={() => setSheet(false)}
        actions={<GlassButton label="Done" onPress={() => setSheet(false)} />}
      >
        <AppText tone="secondary">Sheets use a strong tinted fill over a scrim, not live blur.</AppText>
      </GlassModal>
      <GlassModal
        visible={dialog}
        presentation="dialog"
        title="Delete this document?"
        onClose={() => setDialog(false)}
        actions={
          <>
            <GlassButton label="Delete" variant="danger" onPress={() => setDialog(false)} />
            <GlassButton label="Cancel" variant="ghost" onPress={() => setDialog(false)} />
          </>
        }
      >
        <AppText tone="secondary">This is a demo. Nothing is deleted.</AppText>
      </GlassModal>
    </GlassScreen>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  const insets = useChromeInsets();
  return (
    <ScrollView
      contentContainerStyle={[styles.body, { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.xxl }]}
      scrollIndicatorInsets={{ top: insets.top, bottom: insets.bottom }}
    >
      {children}
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="overline" tone="secondary">
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space.gutter, gap: space.xxxl },
  section: { gap: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tiers: { flexDirection: 'row', gap: space.sm },
  tierCard: { flex: 1 },
});
