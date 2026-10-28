import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';
import { useOnboarding } from '@/context/Onboardingcontext';
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

  const profileRows = [
    {
      id: 'institution',
      icon: '🏛️',
      iconBg: '#DBEAFE',
      label: 'Institution',
      value: data.institution ? `${data.institution.shortName}` : 'FUTA',
    },
    {
      id: 'level',
      icon: '🎓',
      iconBg: '#EDE9FE',
      label: 'Academic Level',
      value: data.academicLevel
        ? `${data.academicLevel.title} (${data.academicLevel.subtitle})`
        : 'Not set',
    },
    {
      id: 'faculty',
      icon: '🏫',
      iconBg: '#CCFBF1',
      label: 'School / Faculty',
      value: data.school?.name || data.faculty || 'School of Computing',
    },
    {
      id: 'department',
      icon: '🏢',
      iconBg: '#DCFCE7',
      label: 'Department',
      value: data.department
        ? `${data.department.name} (${data.department.code})`
        : 'Computer Science (CSC)',
    },
    {
      id: 'courses',
      icon: '📚',
      iconBg: '#FEF3C7',
      label: 'Courses',
      value: `${data.courses.length} courses enrolled`,
    },
    {
      id: 'style',
      icon: '⭐',
      iconBg: '#FCE7F3',
      label: 'Learning Style',
      value: formatLearningStyles(data.learningStyles),
    },
  ];

  const handleStartLearning = () => {
    router.replace('/dashboard/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconCheck}>✓</Text>
        </View>

        <Text style={styles.title}>You're all set.</Text>
        <Text style={styles.subtitle}>BUILD is ready to personalize your learning experience.</Text>

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

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            We've prepared {data.courses.length} courses and personalized study plans for{' '}
            {data.department?.name || 'your department'} at {data.institution?.shortName || 'FUTA'}.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Start Learning" onPress={handleStartLearning} />
        <Text style={styles.footerNote}>You can change these settings anytime</Text>
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