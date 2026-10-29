import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useOnboarding } from '@/context/Onboardingcontext';
import { Fonts } from '@/constants/theme';

const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryTint: '#EFF6FF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  background: '#FFFFFF',
  surface: '#F9FAFB',
};

const TODAYS_PLAN = [
  { id: '1', time: '9:00 AM', title: 'Course Revision & Notes', tag: 'Core', tagBg: '#DBEAFE', tagColor: '#2563EB', route: '/dashboard/readmode' },
  { id: '2', time: '1:00 PM', title: 'Department CBT Practice', tag: 'CBT', tagBg: '#FEF3C7', tagColor: '#B45309', route: '/dashboard/cbtquiz' },
  { id: '3', time: '6:00 PM', title: 'Peer Study Group', tag: 'Study', tagBg: '#DCFCE7', tagColor: '#15803D', route: '/dashboard/studygroup' },
];

const QUICK_STUDY = [
  { id: 'read', label: 'Read', icon: '📖', bg: '#DBEAFE', textColor: '#1D4ED8', route: '/dashboard/readmode' as const },
  { id: 'cbt', label: 'CBT', icon: '🔴', bg: '#FEF3C7', textColor: '#B45309', route: '/dashboard/cbtquiz' as const },
  { id: 'videos', label: 'Videos', icon: '▶', bg: '#DCFCE7', textColor: '#15803D', route: '/dashboard/videoplayer' as const },
];

const UPCOMING_TABS = ['Tests', 'Assignments', 'Classes'];

const UPCOMING_TESTS = [
  { id: 'q1', dotColor: '#F87171', title: 'Mid-Semester CBT Quiz', meta: 'in 2 days', tag: 'Soon', tagBg: '#FEE2E2', tagColor: '#B91C1C' },
  { id: 'q2', dotColor: '#FBBF24', title: 'Department Lab Report', meta: 'Due Thursday', tag: 'Thu', tagBg: '#FEF3C7', tagColor: '#B45309' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { data, getAvailableCourses } = useOnboarding();
  const [activeUpcomingTab, setActiveUpcomingTab] = useState('Tests');

  const availableCourses = getAvailableCourses();
  const displayedCourses = availableCourses.slice(0, 4);
  const activeCourse = displayedCourses[0] || {
    id: 'CSC301',
    code: 'CSC 301',
    name: 'Data Structures and Algorithms',
  };

  const deptName = data.department?.name || 'Choose your department';
  const deptCode = data.department?.code || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good day, Scholar 👋</Text>
            <Text style={styles.dateLine}>
              {data.department ? `${deptName} (${deptCode})` : deptName} · {data.academicLevel?.title || 'Choose your level'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/dashboard/settings')}
            accessibilityLabel="Open settings"
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{deptCode.substring(0, 2)}</Text>
          </TouchableOpacity>
        </View>

        {/* Continue learning card */}
        <View style={styles.continueCard}>
          <View style={styles.continueTitleRow}>
            <View style={styles.blueDot} />
            <Text style={styles.continueTitle}>{activeCourse.code} · {activeCourse.name}</Text>
          </View>
          <View style={styles.continueSubRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.continueSubtitle}>Module 3: Core Concepts & Practice</Text>
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/dashboard/readmode')}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue  →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '68%' }]} />
          </View>
          <Text style={styles.progressLabel}>68% complete</Text>
        </View>

        {/* Today's Plan */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Today's Plan</Text>
          <TouchableOpacity onPress={() => router.push('/dashboard/studymode')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeline}>
          {TODAYS_PLAN.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.timelineRow}
              activeOpacity={0.7}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.timelineLeft}>
                <Text style={styles.timelineTime}>{item.time}</Text>
                <View style={styles.timelineDotCol}>
                  <View style={styles.timelineDot} />
                  {index !== TODAYS_PLAN.length - 1 && <View style={styles.timelineLine} />}
                </View>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
                <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Your Courses */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Your Enrolled Courses</Text>
          <TouchableOpacity onPress={() => router.push('/dashboard/studymode')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coursesGrid}>
          {displayedCourses.map((course, idx) => {
            const barColors = ['#2563EB', '#F97316', '#10B981', '#8B5CF6'];
            const barColor = barColors[idx % barColors.length];
            const progress = 0.45 + (idx * 0.15) % 0.45;
            const percent = `${Math.round(progress * 100)}% done`;

            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                activeOpacity={0.8}
                onPress={() => router.push('/dashboard/readmode')}
              >
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseName} numberOfLines={2}>{course.name}</Text>
                <View style={styles.courseProgressTrack}>
                  <View
                    style={[
                      styles.courseProgressFill,
                      { width: `${progress * 100}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
                <Text style={styles.coursePercent}>{percent}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Study */}
        <Text style={[styles.sectionHeading, { marginTop: 18 }]}>Quick Study</Text>
        <View style={styles.quickStudyRow}>
          {QUICK_STUDY.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.quickStudyPill, { backgroundColor: item.bg }]}
              activeOpacity={0.8}
              onPress={() => router.push(item.route)}
            >
              <Text style={styles.quickStudyIcon}>{item.icon}</Text>
              <Text style={[styles.quickStudyLabel, { color: item.textColor }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BUILD AI insight card */}
        <View style={styles.aiHeadingRow}>
          <Image source={require('@/assets/images/build-ai-logo.png')} resizeMode="contain" style={styles.aiLogo} />
          <Text style={styles.sectionHeading}>BUILD AI for {deptCode}</Text>
        </View>
        <View style={styles.aiCard}>
          <Text style={styles.aiCardText}>
            Personalized study recommendation: Review {activeCourse.code} past questions and high-yield topics before the upcoming quiz.
          </Text>
          <TouchableOpacity onPress={() => router.push('/dashboard/cbtquiz')}>
            <Text style={styles.aiCardLink}>Practice CBT quiz  →</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming */}
        <Text style={[styles.sectionHeading, { marginTop: 18 }]}>Upcoming</Text>
        <View style={styles.upcomingTabsRow}>
          {UPCOMING_TABS.map((tab) => {
            const isActive = activeUpcomingTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.upcomingTab, isActive && styles.upcomingTabActive]}
                onPress={() => setActiveUpcomingTab(tab)}
              >
                <Text style={[styles.upcomingTabText, isActive && styles.upcomingTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.upcomingList}>
          {UPCOMING_TESTS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.upcomingRow}
              activeOpacity={0.8}
              onPress={() => router.push('/dashboard/cbtquiz')}
            >
              <View style={[styles.upcomingDot, { backgroundColor: item.dotColor }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.upcomingTitle}>{item.title}</Text>
                <Text style={styles.upcomingMeta}>{deptCode} · {item.meta}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
                <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <DashboardBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 130 },

  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  greeting: { fontSize: 20, fontWeight: '800', fontFamily: Fonts.extraBold, color: COLORS.textPrimary },
  dateLine: { fontSize: 13, color: COLORS.textMuted, marginTop: 2, fontFamily: Fonts.medium, fontWeight: '500' },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.primary, fontWeight: '800', fontFamily: Fonts.bold, fontSize: 13 },

  continueCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  continueTitleRow: { flexDirection: 'row', alignItems: 'center' },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 8 },
  continueTitle: { fontSize: 15, fontWeight: '700', fontFamily: Fonts.bold, color: COLORS.textPrimary, flex: 1 },
  continueSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  continueSubtitle: { fontSize: 13, color: COLORS.textSecondary, fontFamily: Fonts.regular },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  continueButtonText: { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: Fonts.bold },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: '#E5E7EB', marginTop: 14, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  progressLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, fontWeight: '600', fontFamily: Fonts.medium },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  sectionHeading: { fontSize: 16, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '700', fontFamily: Fonts.bold },

  timeline: { marginTop: 12 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  timelineLeft: { width: 78, flexDirection: 'row', alignItems: 'flex-start' },
  timelineTime: { fontSize: 11, color: COLORS.textMuted, width: 56, fontWeight: '600' },
  timelineDotCol: { alignItems: 'center', width: 12 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 3 },
  timelineLine: { width: 1.5, flex: 1, minHeight: 26, backgroundColor: COLORS.border, marginTop: 2 },
  timelineContent: { flex: 1, paddingBottom: 18 },
  timelineTitle: { fontSize: 13.5, fontWeight: '700', color: COLORS.textPrimary },

  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  tagText: { fontSize: 11, fontWeight: '700' },

  coursesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
  courseCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
  },
  courseCode: { fontSize: 13.5, fontWeight: '800', color: COLORS.textPrimary },
  courseName: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 2, fontWeight: '500', minHeight: 32 },
  courseProgressTrack: { height: 5, borderRadius: 2.5, backgroundColor: '#E5E7EB', marginTop: 10, overflow: 'hidden' },
  courseProgressFill: { height: 5, borderRadius: 2.5 },
  coursePercent: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, fontWeight: '600' },

  quickStudyRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  quickStudyPill: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStudyIcon: { fontSize: 18, marginBottom: 4 },
  quickStudyLabel: { fontSize: 12, fontWeight: '800' },

  aiHeadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, gap: 6 },
  aiLogo: { width: 18, height: 20 },
  aiCard: {
    backgroundColor: COLORS.primaryTint,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  aiCardText: { fontSize: 13.5, color: COLORS.textPrimary, lineHeight: 20 },
  aiCardLink: { fontSize: 13, color: COLORS.primary, fontWeight: '800', marginTop: 8 },

  upcomingTabsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  upcomingTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
  },
  upcomingTabActive: { backgroundColor: COLORS.primary },
  upcomingTabText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  upcomingTabTextActive: { color: '#fff' },

  upcomingList: { marginTop: 14 },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  upcomingDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  upcomingTitle: { fontSize: 13.5, fontWeight: '700', color: COLORS.textPrimary },
  upcomingMeta: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 },
});
