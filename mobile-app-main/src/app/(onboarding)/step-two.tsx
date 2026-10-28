import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProgressHeader from '@/components/ProgressHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useOnboarding } from '@/context/Onboardingcontext';
import colors from '@/theme/colors';

const TABS = ['All Courses', 'Core', 'Electives', 'Lab'];

export default function Step2Courses() {
  const router = useRouter();
  const { data, setCourses, getAvailableCourses } = useOnboarding();
  const [activeTab, setActiveTab] = useState('All Courses');

  const availableCourses = getAvailableCourses();
  const [selectedCourses, setSelectedCourses] = useState<string[]>(() => {
    if (data.courses && data.courses.length > 0) {
      return data.courses;
    }
    // Default select first 3 courses
    return availableCourses.slice(0, 3).map((c) => c.id);
  });

  // Re-sync when department or level changes
  useEffect(() => {
    if (!selectedCourses.length && availableCourses.length > 0) {
      setSelectedCourses(availableCourses.slice(0, 3).map((c) => c.id));
    }
  }, [availableCourses]);

  const toggleCourse = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredCourses = availableCourses.filter((course) => {
    if (activeTab === 'All Courses') return true;
    if (activeTab === 'Core') return course.category === 'core';
    if (activeTab === 'Electives') return course.category === 'elective';
    if (activeTab === 'Lab') return course.category === 'lab';
    return true;
  });

  const handleContinue = () => {
    setCourses(selectedCourses);
    router.push('/(onboarding)/step-three');
  };

  const handleSkip = () => {
    setCourses([]);
    router.push('/(onboarding)/step-three');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader step={2} total={5} onBack={() => router.back()} />

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{data.academicLevel?.title || '300 Level'}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {data.department?.name || 'Computer Science'} ({data.department?.code || 'CSC'})
          </Text>
        </View>
      </View>

      <View style={styles.headingBlock}>
        <Text style={styles.title}>Which courses are you taking?</Text>
        <Text style={styles.subtitle}>Choose the courses you want BUILD to help you with.</Text>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.selectedCountWrap}>
        <View style={styles.selectedCountPill}>
          <Text style={styles.selectedCountText}>✓ {selectedCourses.length} courses selected</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isSelected = selectedCourses.includes(course.id);
            return (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseCard, isSelected && styles.courseCardSelected]}
                activeOpacity={0.8}
                onPress={() => toggleCourse(course.id)}
              >
                <View style={styles.courseTextWrap}>
                  <View style={styles.courseTitleRow}>
                    <Text style={styles.courseName}>
                      {course.code} {course.name}
                    </Text>
                    {course.tag && <View style={styles.newDot} />}
                  </View>
                  <Text style={styles.courseMeta}>
                    {course.code} · {course.units} Units · {course.category.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No courses found in this category.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} />
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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