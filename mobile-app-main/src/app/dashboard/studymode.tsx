import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useOnboarding } from '@/context/Onboardingcontext';
import { useThemedStyles } from '@/hooks/useThemedStyles';

const BLUE = '#2563EB';
const modes = [
  { number: '01', name: 'Read Mode', description: 'Read a lesson at your own pace and focus on the key ideas.', action: 'Open reading', icon: 'book-outline' as const, tint: '#EAF2FF', color: BLUE, route: '/dashboard/readmode' as const },
  { number: '02', name: 'CBT Practice', description: 'Answer practice questions and check your understanding.', action: 'Start practice', icon: 'checkbox-outline' as const, tint: '#E7F6F1', color: '#0F766E', route: '/dashboard/cbtquiz' as const },
  { number: '03', name: 'Video Lessons', description: 'Explore lessons in a format you can watch and revisit.', action: 'Browse videos', icon: 'play-circle-outline' as const, tint: '#F1EDFF', color: '#7252B5', route: '/dashboard/videoplayer' as const },
];

export default function StudyModesScreen() {
  const ui = useThemedStyles(styles);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, getAvailableCourses } = useOnboarding();
  const wide = width >= 760;
  const selectedCourses = getAvailableCourses().filter(course => data.courses.includes(course.id));
  const firstCourse = selectedCourses[0];
  const hasProfile = !!(data.department && data.academicLevel);
  const manageCourses = () => router.push(hasProfile ? '/(onboarding)/step-two' : '/(onboarding)/step-one');
  const aiReady = !!process.env.EXPO_PUBLIC_BUILD_AI_API_URL;

  const courseShelf = <View style={ui.courseSection}>
    <View style={ui.sectionTop}><Text style={ui.eyebrow}>YOUR COURSE SHELF</Text><TouchableOpacity onPress={manageCourses} accessibilityRole="button" accessibilityLabel="Manage courses"><Text style={ui.manage}>Manage</Text></TouchableOpacity></View>
    {firstCourse ? <>
      <View style={ui.courseFeature}>
        <View style={ui.courseCover}><Ionicons name="book-outline" size={25} color="#FFFFFF" /><Text style={ui.coverCode}>{firstCourse.code}</Text></View>
        <View style={ui.courseCopy}><Text style={ui.courseLabel}>SELECTED COURSE</Text><Text style={ui.courseName}>{firstCourse.name}</Text><Text style={ui.courseMeta}>{data.department?.name || firstCourse.departmentCode}</Text></View>
      </View>
      {selectedCourses.length > 1 && <Text style={ui.courseCount}>{selectedCourses.length - 1} more {selectedCourses.length === 2 ? 'course' : 'courses'} in your shelf</Text>}
    </> : <View style={ui.emptyCourse}><View style={ui.emptyIcon}><Ionicons name="library-outline" size={24} color={BLUE} /></View><Text style={ui.emptyTitle}>Your courses, in one place.</Text><Text style={ui.emptyBody}>{hasProfile ? 'Choose your courses to keep them close while you study.' : 'Add your level and department first, then choose your courses.'}</Text><TouchableOpacity onPress={manageCourses} style={ui.setupButton} accessibilityRole="button"><Text style={ui.setupText}>{hasProfile ? 'Choose courses' : 'Set up your studies'}</Text><Ionicons name="arrow-forward" size={16} color="#FFFFFF" /></TouchableOpacity></View>}
  </View>;

  const modeList = <View style={ui.modesSection}>
    <Text style={ui.eyebrow}>LEARNING MODES</Text>
    <Text style={ui.sectionTitle}>Choose your way in.</Text>
    <Text style={ui.sectionIntro}>A focused place to read, practise, or watch.</Text>
    <View style={ui.modeList}>{modes.map(mode =>
      <TouchableOpacity key={mode.number} style={ui.modeRow} onPress={() => router.push(mode.route)} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel={mode.action}>
        <View style={[ui.modeVisual, { backgroundColor: mode.tint }]}><Ionicons name={mode.icon} size={25} color={mode.color} /><Text style={[ui.modeNumber, { color: mode.color }]}>{mode.number}</Text></View>
        <View style={ui.modeCopy}><Text style={ui.modeTitle}>{mode.name}</Text><Text style={ui.modeDescription}>{mode.description}</Text><Text style={ui.modeAction}>{mode.action}  <Ionicons name="arrow-forward" size={13} color={BLUE} /></Text></View>
      </TouchableOpacity>
    )}</View>
  </View>;

  const ai = <TouchableOpacity style={ui.aiSection} onPress={() => router.push('/dashboard/buildai')} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel="Open BUILD AI chat">
    <View style={ui.aiMark}><Image source={require('@/assets/images/build-ai-logo.png')} resizeMode="contain" style={ui.aiLogo} /></View>
    <View style={ui.aiCopy}><Text style={ui.aiEyebrow}>NEED A HAND?</Text><Text style={ui.aiTitle}>Think it through with BUILD AI</Text><Text style={ui.aiDescription}>{aiReady ? 'Ask about a concept or plan your next study session.' : 'Explore the chat. AI replies need a service connection.'}</Text></View>
    <Ionicons name="arrow-forward" size={18} color={BLUE} />
  </TouchableOpacity>;

  return <SafeAreaView style={ui.page}>
    <ScrollView contentContainerStyle={[ui.content, { maxWidth: wide ? 1100 : undefined }]} showsVerticalScrollIndicator={false}>
      <View style={ui.topbar}><TouchableOpacity onPress={() => router.replace('/dashboard/home')} style={ui.back} accessibilityRole="button" accessibilityLabel="Back to home"><Ionicons name="arrow-back" size={20} color="#354860" /></TouchableOpacity><Text style={ui.topbarTitle}>Study</Text></View>
      <View style={ui.intro}><Text style={ui.pageTitle}>Make learning yours.</Text><Text style={ui.pageSubtitle}>Pick a course, then choose the format that fits your focus today.</Text></View>
      {wide ? <View style={ui.columns}><View style={ui.sideColumn}>{courseShelf}{ai}</View><View style={ui.mainColumn}>{modeList}</View></View> : <>{modeList}{courseShelf}{ai}</>}
    </ScrollView>
    <DashboardBottomNav activeTab="study" />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' }, content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 122 },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }, back: { width: 39, height: 39, borderRadius: 12, backgroundColor: '#F0F4FA', alignItems: 'center', justifyContent: 'center' }, topbarTitle: { color: '#3D5068', fontSize: 13, fontWeight: '800' },
  intro: { marginBottom: 30 }, pageTitle: { color: '#18263B', fontSize: 29, fontWeight: '800', letterSpacing: -0.6 }, pageSubtitle: { color: '#677990', fontSize: 14, lineHeight: 21, marginTop: 7, maxWidth: 550 },
  columns: { flexDirection: 'row', alignItems: 'flex-start', gap: 44 }, sideColumn: { flex: 0.9, minWidth: 0 }, mainColumn: { flex: 1.2, minWidth: 0 },
  courseSection: { marginBottom: 36 }, sectionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, eyebrow: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 }, manage: { color: BLUE, fontSize: 12, fontWeight: '800', paddingVertical: 5 },
  courseFeature: { flexDirection: 'row', alignItems: 'center', gap: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5EBF3', paddingVertical: 16 },
  courseCover: { width: 76, height: 91, borderRadius: 13, backgroundColor: '#2563EB', padding: 12, alignItems: 'flex-start', justifyContent: 'space-between' }, coverCode: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  courseCopy: { flex: 1 }, courseLabel: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, courseName: { color: '#203047', fontSize: 17, fontWeight: '800', lineHeight: 23, marginTop: 6 }, courseMeta: { color: '#8190A2', fontSize: 12, marginTop: 6 },
  courseCount: { color: '#728399', fontSize: 12, marginTop: 11 },
  emptyCourse: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5EBF3', paddingVertical: 22 },
  emptyIcon: { width: 43, height: 43, borderRadius: 13, backgroundColor: '#EFF5FF', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyTitle: { color: '#1D2E46', fontSize: 18, fontWeight: '800' }, emptyBody: { color: '#718198', fontSize: 13, lineHeight: 20, marginTop: 6, maxWidth: 430 },
  setupButton: { backgroundColor: BLUE, borderRadius: 12, minHeight: 43, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 15, marginTop: 17 },
  setupText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  modesSection: { marginBottom: 33 }, sectionTitle: { color: '#18263B', fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginTop: 7 }, sectionIntro: { color: '#718198', fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 18 },
  modeList: { borderTopWidth: 1, borderTopColor: '#E5EBF3' }, modeRow: { flexDirection: 'row', gap: 15, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#E5EBF3' },
  modeVisual: { width: 62, height: 74, borderRadius: 14, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }, modeNumber: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  modeCopy: { flex: 1, minWidth: 0 }, modeTitle: { color: '#21324B', fontSize: 16, fontWeight: '800' }, modeDescription: { color: '#708096', fontSize: 12, lineHeight: 18, marginTop: 4 }, modeAction: { color: BLUE, fontSize: 12, fontWeight: '800', marginTop: 10 },
  aiSection: { flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1, borderColor: '#DCE8F8', borderRadius: 16, backgroundColor: '#F8FBFF', padding: 15, marginBottom: 8 },
  aiMark: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, aiLogo: { width: 27, height: 31 },
  aiCopy: { flex: 1, minWidth: 0 }, aiEyebrow: { color: BLUE, fontSize: 9, fontWeight: '800', letterSpacing: 1 }, aiTitle: { color: '#21324B', fontSize: 14, fontWeight: '800', marginTop: 3 }, aiDescription: { color: '#728399', fontSize: 11, lineHeight: 16, marginTop: 3 },
});
