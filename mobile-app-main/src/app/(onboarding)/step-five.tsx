import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';
import { describeAuthError } from '@/auth/errorMessages';
import { useOnboarding } from '@/context/Onboardingcontext';
import { useAcademicProfile } from '@/features/academic/ProfileProvider';
import colors from '@/theme/colors';

const STYLE_TITLES: Record<string, string> = {
  reading: 'Reading',
  videos: 'Videos',
  ai: 'AI Explanations',
  flashcards: 'Flashcards',
  practice: 'Practice Questions',
  group: 'Group Study',
};

function formatLearningStyles(ids: string[]) {
  if (!ids || ids.length === 0) return 'Not set';
  const titles = ids.map((id) => STYLE_TITLES[id] || id);
  if (titles.length <= 2) return titles.join(', ');
  return `${titles.slice(0, 2).join(', ')} +${titles.length - 2}`;
}

export default function Step5Summary() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { save } = useAcademicProfile();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = !!data.programme && data.level !== null;

  const profileRows = [
    { id: 'level', icon: '🎓', iconBg: '#EDE9FE', label: 'Level', value: data.level ? `${data.level} Level` : 'Not set' },
    { id: 'faculty', icon: '🏫', iconBg: '#CCFBF1', label: 'School', value: data.faculty?.name ?? 'Not set' },
    { id: 'department', icon: '🏢', iconBg: '#DCFCE7', label: 'Department', value: data.department?.name ?? 'Not set' },
    { id: 'programme', icon: '📘', iconBg: '#DBEAFE', label: 'Programme', value: data.programme ? `${data.programme.name} (${data.programme.code})` : 'Not set' },
    { id: 'courses', icon: '📚', iconBg: '#FEF3C7', label: 'Courses', value: `${data.courseIds.length} ${data.courseIds.length === 1 ? 'course' : 'courses'}` },
    { id: 'style', icon: '⭐', iconBg: '#FCE7F3', label: 'Learning style', value: formatLearningStyles(data.learningStyles) },
  ];

  // The profile is only true once the backend has accepted it.
  const handleStartLearning = async () => {
    if (!data.programme || data.level === null || saving) return;
    setSaving(true);
    setError(null);
    try {
      await save({ programme_id: data.programme.id, level: data.level, course_ids: data.courseIds });
      router.replace('/dashboard/home');
    } catch (e) {
      const described = describeAuthError(e);
      setError(Object.values(described.fields)[0] ?? described.general ?? 'Your profile could not be saved.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconCheck}>✓</Text>
        </View>

        <Text style={styles.title}>Almost there.</Text>
        <Text style={styles.subtitle}>Check your details, then start learning.</Text>

        <View style={styles.profileCard}>
          <Text style={styles.profileHeading}>YOUR BUILD PROFILE</Text>

          {profileRows.map((row) => (
            <View key={row.id} style={styles.profileRow}>
              <View style={styles.profileLeft}>
                <View style={[styles.rowIconWrap, { backgroundColor: row.iconBg }]}>
                  <Text style={styles.rowIconText}>{row.icon}</Text>
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
              </View>
              <Text style={styles.rowValue} numberOfLines={1}>
                {row.value}
              </Text>
            </View>
          ))}

          <TouchableOpacity onPress={() => router.push('/(onboarding)/step-one')}>
            <Text style={styles.editLink}>Edit your profile</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText} accessibilityRole="alert">{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={saving ? 'Saving…' : 'Start Learning'} onPress={handleStartLearning} disabled={!ready || saving} />
        <Text style={styles.footerNote}>Learning style is kept on this device. You can change your profile anytime.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 12,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconCheck: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  profileHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: 10,
  },
  rowIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowIconText: {
    fontSize: 14,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
  editLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: colors.amberBackground,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.amberText,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  footerNote: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 10,
  },
});
