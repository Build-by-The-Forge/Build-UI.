import React, { useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useOnboarding } from '@/context/Onboardingcontext';
import { useTheme } from '@/context/ThemeContext';

type Icon = React.ComponentProps<typeof Ionicons>['name'];
const appearanceSchema = z.object({ mode: z.string().regex(/^(light|dark)$/, 'Choose Light or Dark mode') });

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data } = useOnboarding();
  const { mode, setMode, ready, error } = useTheme();
  const [formError, setFormError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const dark = mode === 'dark';
  const ink = dark ? '#E5EDF7' : '#16263A';
  const muted = dark ? '#B5C3D5' : '#64748B';
  const accent = dark ? '#8AB8FF' : '#2563EB';
  const surface = dark ? '#172235' : '#FFFFFF';
  const border = dark ? '#304055' : '#E2E8F0';
  const tint = dark ? '#203555' : '#EFF6FF';

  const selectMode = (value: string) => {
    const result = appearanceSchema.safeParse({ mode: value });
    if (!result.success) { setFormError(result.error.issues[0]?.message || 'Invalid choice'); return; }
    setFormError('');
    setMode(result.data.mode as 'light' | 'dark');
  };

  const settingRow = (title: string, detail: string, icon: Icon, onPress: () => void) =>
    <TouchableOpacity key={title} onPress={onPress} style={[styles.row, { borderColor: border }]} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel={title}>
      <View style={[styles.iconBox, { backgroundColor: tint }]}><Ionicons name={icon} size={20} color={accent} /></View>
      <View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: ink }]}>{title}</Text><Text style={[styles.rowDetail, { color: muted }]} numberOfLines={2}>{detail}</Text></View>
      <Ionicons name="chevron-forward" size={18} color={muted} />
    </TouchableOpacity>;

  const section = (title: string, content: React.ReactNode) =>
    <View style={styles.section}><Text style={[styles.sectionTitle, { color: ink }]}>{title}</Text><View style={[styles.sectionBody, { backgroundColor: surface, borderColor: border }]}>{content}</View></View>;

  const info = (title: string, detail: string, icon: Icon) =>
    <View style={styles.infoRow}><View style={[styles.iconBox, { backgroundColor: tint }]}><Ionicons name={icon} size={20} color={accent} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: ink }]}>{title}</Text><Text style={[styles.rowDetail, { color: muted }]}>{detail}</Text></View></View>;

  return <SafeAreaView style={[styles.page, { backgroundColor: dark ? '#0B1220' : '#F7F9FC' }]}>
    <ScrollView contentContainerStyle={[styles.content, { maxWidth: width >= 700 ? 760 : undefined }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/dashboard/home')} style={[styles.back, { backgroundColor: surface, borderColor: border }]} accessibilityLabel="Back to home"><Ionicons name="arrow-back" size={21} color={ink} /></TouchableOpacity>
        <View><Text style={[styles.title, { color: ink }]}>Settings</Text><Text style={[styles.subtitle, { color: muted }]}>Make BUILD work your way.</Text></View>
      </View>
      <View style={[styles.identity, { backgroundColor: dark ? '#172B4C' : '#EAF2FF', borderColor: dark ? '#28456B' : '#D5E6FF' }]}>
        <View style={styles.logoBox}><Image source={require('@/assets/images/build-logo.png')} resizeMode="contain" style={styles.logo} /></View>
        <View style={styles.rowCopy}><Text style={[styles.identityTitle, { color: ink }]}>Your BUILD space</Text><Text style={[styles.rowDetail, { color: muted }]} numberOfLines={2}>{data.department ? `${data.department.name} · ${data.academicLevel?.title || 'Level not set'}` : 'Set up your academic profile'}</Text></View>
      </View>

      {section('Account', <>
        {settingRow('Academic profile', data.department ? `${data.institution.shortName} · ${data.department.name}` : 'Choose your level and department', 'person-outline', () => router.push('/(onboarding)/step-one'))}
        {settingRow('My courses', data.courses.length ? `${data.courses.length} courses selected` : 'Choose your courses', 'book-outline', () => router.push('/dashboard/courses'))}
      </>)}

      {section('Appearance', <View style={styles.appearance}>
        <Text style={[styles.explain, { color: muted }]}>Choose a comfortable look for studying.</Text>
        <View style={styles.modeRow}>{(['light', 'dark'] as const).map(choice => {
          const selected = mode === choice;
          return <TouchableOpacity key={choice} onPress={() => selectMode(choice)} disabled={!ready} style={[styles.modeButton, { backgroundColor: selected ? '#2563EB' : tint, borderColor: selected ? '#2563EB' : border }]} accessibilityRole="radio" accessibilityState={{ selected, disabled: !ready }}>
            <Ionicons name={choice === 'light' ? 'sunny-outline' : 'moon-outline'} size={19} color={selected ? '#FFFFFF' : ink} />
            <Text style={[styles.modeLabel, { color: selected ? '#FFFFFF' : ink }]}>{choice === 'light' ? 'Light' : 'Dark'}</Text>
            {selected && <Ionicons name="checkmark-circle" size={17} color="#FFFFFF" />}
          </TouchableOpacity>;
        })}</View>
        {!ready && <ActivityIndicator style={styles.loading} color={accent} accessibilityLabel="Loading appearance preference" />}
        {!!(formError || error) && <Text style={styles.error} accessibilityRole="alert">{formError || error}</Text>}
      </View>)}

      {section('Notifications', info('Notification controls', 'Notification delivery is not connected yet. There are no alerts to configure.', 'notifications-outline'))}

      {section('Learning preferences', <>
        {settingRow('Study goals', data.goals.length ? `${data.goals.length} goals selected` : 'Choose what you want to achieve', 'flag-outline', () => router.push('/(onboarding)/step-three'))}
        {settingRow('Learning styles', data.learningStyles.length ? `${data.learningStyles.length} styles selected` : 'Choose how you prefer to learn', 'options-outline', () => router.push('/(onboarding)/step-four'))}
      </>)}

      {section('Privacy & security', info('Your data', 'Academic choices are kept in this app session. Account sync and security controls need a connected account service.', 'shield-checkmark-outline'))}

      {section('Help & support', <>
        <TouchableOpacity style={[styles.row, { borderColor: border }]} onPress={() => setShowHelp(value => !value)} accessibilityRole="button" accessibilityState={{ expanded: showHelp }}>
          <View style={[styles.iconBox, { backgroundColor: tint }]}><Ionicons name="help-circle-outline" size={20} color={accent} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: ink }]}>How do I update my studies?</Text><Text style={[styles.rowDetail, { color: muted }]}>View a quick guide</Text></View><Ionicons name={showHelp ? 'chevron-up' : 'chevron-down'} size={18} color={muted} />
        </TouchableOpacity>
        {showHelp && <Text style={[styles.helpText, { color: muted }]}>Choose your level and department in Academic profile. Then update your courses, goals, and learning styles above.</Text>}
      </>)}

      {section('About', info('BUILD', 'A campus study companion for FUTA students · Version 1.0.0', 'information-circle-outline'))}

      <View style={[styles.signOut, { borderColor: border }]}><Ionicons name="log-out-outline" size={20} color={muted} /><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: muted }]}>Sign out</Text><Text style={[styles.rowDetail, { color: muted }]}>Available when account sign-in is connected.</Text></View></View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1 }, content: { width: '100%', alignSelf: 'center', paddingHorizontal: 18, paddingTop: 22, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 }, back: { width: 40, height: 40, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 25, fontWeight: '800' }, subtitle: { fontSize: 13, marginTop: 3 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 28 },
  logoBox: { width: 48, height: 48, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, logo: { width: 32, height: 38 }, identityTitle: { fontSize: 16, fontWeight: '800' },
  section: { marginBottom: 25 }, sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10, marginLeft: 2 }, sectionBody: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, overflow: 'hidden' },
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1 },
  iconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, rowCopy: { flex: 1 }, rowTitle: { fontSize: 13.5, fontWeight: '700' }, rowDetail: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  appearance: { paddingVertical: 17 }, explain: { fontSize: 12, marginBottom: 14 }, modeRow: { flexDirection: 'row', gap: 10 }, modeButton: { flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 10 },
  modeLabel: { fontSize: 13, fontWeight: '700' }, loading: { marginTop: 12 }, error: { color: '#B91C1C', fontSize: 12, marginTop: 10 },
  infoRow: { minHeight: 75, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 }, helpText: { fontSize: 12, lineHeight: 19, paddingBottom: 17, paddingLeft: 50 },
  signOut: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 17, marginTop: 4 },
});
