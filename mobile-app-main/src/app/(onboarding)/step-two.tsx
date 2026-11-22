import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProgressHeader from '@/components/ProgressHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { LoadBoundary } from '@/components/onboarding/LoadBoundary';
import { useOnboarding } from '@/context/Onboardingcontext';
import { MAX_PROFILE_COURSES } from '@/features/academic/api';
import { useAcademicProfile } from '@/features/academic/ProfileProvider';
import { useLoad } from '@/features/academic/useLoad';
import colors from '@/theme/colors';

type Tab = 'level' | 'all';

export default function Step2Courses() {
  const router = useRouter();
  const { api } = useAcademicProfile();
  const { data, setCourseIds } = useOnboarding();
  const [tab, setTab] = useState<Tab>('level');
  const [selected, setSelected] = useState<string[]>(data.courseIds);
  const [limitHit, setLimitHit] = useState(false);

  const departmentId = data.department?.id ?? null;
  const courses = useLoad(departmentId ? `courses:${departmentId}` : null, (signal) => api.courses(departmentId!, signal));

  const toggle = (id: string) => {
    setLimitHit(false);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_PROFILE_COURSES) {
        setLimitHit(true);
        return prev;
      }
      return [...prev, id];
    });
  };

  // A course picked earlier stays picked even if it isn't on screen now.
  const visible = (courses.data ?? []).filter((c) => tab === 'all' || c.level === data.level);

  const handleContinue = () => {
    setCourseIds(selected);
    router.push('/(onboarding)/step-three');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader step={2} total={5} onBack={() => router.back()} />

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{data.level ? `${data.level} Level` : 'Choose level'}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{data.department?.name ?? 'Choose department'}</Text>
        </View>
      </View>

      <View style={styles.headingBlock}>
        <Text style={styles.title}>Which courses are you taking?</Text>
        <Text style={styles.subtitle}>Choose the courses you want BUILD to help you with. You can change this later.</Text>
      </View>

      <View style={styles.tabsRow}>
        {([['level', `${data.level ?? ''} Level`], ['all', 'All levels']] as const).map(([id, label]) => {
          const isActive = tab === id;
          return (
            <TouchableOpacity key={id} style={[styles.tab, isActive && styles.tabActive]} onPress={() => setTab(id)} accessibilityRole="button" accessibilityState={{ selected: isActive }}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.selectedCountWrap}>
        <View style={styles.selectedCountPill}>
          <Text style={styles.selectedCountText}>✓ {selected.length} of {MAX_PROFILE_COURSES} courses selected</Text>
        </View>
      </View>
      {limitHit && <Text style={styles.limit} accessibilityRole="alert">You can pick up to {MAX_PROFILE_COURSES} courses. Remove one to add another.</Text>}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LoadBoundary status={courses.status} error={courses.error} onRetry={courses.reload} isEmpty={visible.length === 0} empty={tab === 'level' ? 'No published courses for this level yet. Try All levels.' : 'No courses are published for your department yet.'}>
          {visible.map((course) => {
            const isSelected = selected.includes(course.id);
            return (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseCard, isSelected && styles.courseCardSelected]}
                activeOpacity={0.8}
                onPress={() => toggle(course.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${course.code} ${course.title}`}
              >
                <View style={styles.courseTextWrap}>
                  <Text style={styles.courseName}>{course.code} {course.title}</Text>
                  <Text style={styles.courseMeta}>
                    {course.level} Level · Semester {course.semester} · {course.credit_units} {course.credit_units === 1 ? 'unit' : 'units'}
                  </Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </LoadBoundary>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} />
        <TouchableOpacity style={styles.skipButton} onPress={() => { setCourseIds([]); router.push('/(onboarding)/step-three'); }}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  limit: { color: '#92400E', backgroundColor: '#FFFBEB', marginHorizontal: 20, padding: 10, borderRadius: 10, fontSize: 13 },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    color: colors.chipText,
    fontSize: 12,
    fontWeight: '600',
  },
  headingBlock: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.white,
  },
  selectedCountWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  selectedCountPill: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  selectedCountText: {
    color: colors.chipText,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.cardBackground,
  },
  courseCardSelected: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryTint,
  },
  courseTextWrap: {
    flexShrink: 1,
    paddingRight: 12,
  },
  courseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginLeft: 6,
  },
  courseMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTick: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyWrap: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
