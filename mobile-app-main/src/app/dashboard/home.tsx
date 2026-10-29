import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useOnboarding } from '@/context/Onboardingcontext';
import { useThemedStyles } from '@/hooks/useThemedStyles';

const BLUE = '#2563EB';
const tools = [
  { title: 'Read Mode', detail: 'Work through a lesson', icon: 'book-outline' as const, route: '/dashboard/readmode' as const, tint: '#E9F1FF', color: '#2563EB' },
  { title: 'CBT Practice', detail: 'Try practice questions', icon: 'checkbox-outline' as const, route: '/dashboard/cbtquiz' as const, tint: '#E8F7F3', color: '#0F766E' },
  { title: 'Video Lessons', detail: 'Learn by watching', icon: 'play-circle-outline' as const, route: '/dashboard/videoplayer' as const, tint: '#F1EDFF', color: '#7252B5' },
];

export default function HomeScreen() {
  const ui = useThemedStyles(styles);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, getAvailableCourses } = useOnboarding();
  const wide = width >= 760;
  const selectedCourses = getAvailableCourses().filter(course => data.courses.includes(course.id));
  const aiReady = !!process.env.EXPO_PUBLIC_BUILD_AI_API_URL;
  const firstCourse = selectedCourses[0];
  const hasProfile = !!(data.department && data.academicLevel);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const start = () => {
    if (!hasProfile) router.push('/(onboarding)/step-one');
    else if (!firstCourse) router.push('/(onboarding)/step-two');
    else router.push('/dashboard/studymode');
  };
  const actionLabel = !hasProfile ? 'Set up your studies' : firstCourse ? 'Choose a study mode' : 'Choose your courses';

  const focus = <View style={ui.focus}>
    <View style={ui.focusTop}><View style={ui.focusBar} /><Text style={ui.focusEyebrow}>YOUR NEXT STEP</Text></View>
    <Text style={ui.focusTitle}>{!hasProfile ? 'Make BUILD yours.' : firstCourse ? 'Ready for your next study session?' : 'Choose what you are studying.'}</Text>
    <Text style={ui.focusBody}>{!hasProfile
      ? 'Add your level and department to find courses that fit your programme.'
      : firstCourse
        ? `You have ${selectedCourses.length} ${selectedCourses.length === 1 ? 'course' : 'courses'} selected. Pick a learning mode and start when you are ready.`
        : 'Select your courses so your study space reflects your programme.'}</Text>
    {firstCourse && <View style={ui.courseIdentity}><View style={ui.courseMark}><Ionicons name="book-outline" size={19} color={BLUE} /></View><View style={ui.courseIdentityCopy}><Text style={ui.courseCode}>{firstCourse.code}</Text><Text style={ui.courseName} numberOfLines={2}>{firstCourse.name}</Text></View></View>}
    <TouchableOpacity style={ui.primaryAction} onPress={start} accessibilityRole="button" accessibilityLabel={actionLabel}>
      <Text style={ui.primaryActionText}>{actionLabel}</Text><Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
    </TouchableOpacity>
  </View>;

  const learning = <View style={ui.section}>
    <Text style={ui.sectionEyebrow}>LEARNING TOOLS</Text>
    <Text style={ui.sectionTitle}>Study your way</Text>
    <Text style={ui.sectionIntro}>Choose the format that helps you make progress today.</Text>
    <View style={[ui.tools, wide && ui.toolsWide]}>{tools.map(tool =>
      <TouchableOpacity key={tool.title} style={ui.tool} onPress={() => router.push(tool.route)} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel={tool.title}>
        <View style={[ui.toolIcon, { backgroundColor: tool.tint }]}><Ionicons name={tool.icon} size={22} color={tool.color} /></View>
        <View style={ui.toolCopy}><Text style={ui.toolTitle}>{tool.title}</Text><Text style={ui.toolDetail}>{tool.detail}</Text></View>
        <Ionicons name="arrow-forward" size={17} color="#8A9AAF" />
      </TouchableOpacity>
    )}</View>
  </View>;

  const assistant = <TouchableOpacity style={ui.assistant} onPress={() => router.push('/dashboard/buildai')} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Open BUILD AI chat">
    <View style={ui.assistantLogo}><Image source={require('@/assets/images/build-ai-logo.png')} resizeMode="contain" style={ui.aiLogo} /></View>
    <View style={ui.assistantCopy}><Text style={ui.assistantKicker}>BUILD AI</Text><Text style={ui.assistantTitle}>Talk through a topic.</Text><Text style={ui.assistantBody}>{aiReady ? 'Ask a question, unpack a concept, or plan what to study next.' : 'Explore the chat. AI replies need a service connection.'}</Text></View>
    <Ionicons name="arrow-forward" size={19} color={BLUE} />
  </TouchableOpacity>;

  const upcoming = <View style={ui.section}>
    <Text style={ui.sectionEyebrow}>ACADEMIC CALENDAR</Text>
    <Text style={ui.sectionTitle}>Upcoming</Text>
    <View style={ui.emptySchedule}><Ionicons name="calendar-outline" size={23} color={BLUE} /><View style={ui.emptyScheduleCopy}><Text style={ui.emptyTitle}>Nothing scheduled here yet</Text><Text style={ui.emptyBody}>Tests, assignments, and classes will appear when a timetable is connected to BUILD.</Text></View></View>
  </View>;

  const courses = <View style={ui.section}>
    <View style={ui.sectionHeadingRow}><View><Text style={ui.sectionEyebrow}>YOUR STUDIES</Text><Text style={ui.sectionTitle}>Your courses</Text></View><TouchableOpacity onPress={() => router.push(hasProfile ? '/(onboarding)/step-two' : '/(onboarding)/step-one')} accessibilityRole="button" accessibilityLabel="Manage courses"><Text style={ui.manage}>Manage</Text></TouchableOpacity></View>
    {selectedCourses.length ? selectedCourses.slice(0, 4).map(course =>
      <View key={course.id} style={ui.courseRow}><View style={ui.courseDot} /><View style={ui.courseRowCopy}><Text style={ui.courseRowCode}>{course.code}</Text><Text style={ui.courseRowName} numberOfLines={1}>{course.name}</Text></View></View>
    ) : <Text style={ui.noCourses}>No courses selected yet. Add yours to keep them close at hand.</Text>}
    {selectedCourses.length > 4 && <Text style={ui.moreCourses}>+{selectedCourses.length - 4} more selected</Text>}
  </View>;

  return <SafeAreaView style={ui.page}>
    <ScrollView contentContainerStyle={[ui.content, { maxWidth: wide ? 1100 : undefined }]} showsVerticalScrollIndicator={false}>
      <View style={ui.header}><View style={ui.headerCopy}><Text style={ui.greeting}>{greeting}.</Text><Text style={ui.headerContext}>{data.department ? `${data.department.name}${data.academicLevel ? ` · ${data.academicLevel.title}` : ''}` : 'Your place to learn at FUTA'}</Text></View><TouchableOpacity onPress={() => router.push('/dashboard/settings')} style={ui.settings} accessibilityRole="button" accessibilityLabel="Open settings"><Ionicons name="settings-outline" size={21} color={BLUE} /></TouchableOpacity></View>
      {wide ? <View style={ui.columns}><View style={ui.mainColumn}>{focus}{learning}{assistant}</View><View style={ui.sideColumn}>{upcoming}{courses}</View></View> : <>{focus}{learning}{assistant}{upcoming}{courses}</>}
    </ScrollView>
    <DashboardBottomNav activeTab="home" />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 124 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 26 },
  headerCopy: { flex: 1 }, greeting: { color: '#18263B', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }, headerContext: { color: '#62738A', fontSize: 13, marginTop: 5, lineHeight: 18 },
  settings: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#EEF4FD', alignItems: 'center', justifyContent: 'center' },
  columns: { flexDirection: 'row', gap: 38, alignItems: 'flex-start' }, mainColumn: { flex: 1.45, minWidth: 0 }, sideColumn: { flex: 1, minWidth: 0 },
  focus: { backgroundColor: '#F0F5FD', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: '#DBE8F8', marginBottom: 30 },
  focusTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }, focusBar: { width: 18, height: 3, borderRadius: 2, backgroundColor: BLUE }, focusEyebrow: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  focusTitle: { color: '#18263B', fontSize: 25, fontWeight: '800', lineHeight: 31, letterSpacing: -0.5, maxWidth: 510 }, focusBody: { color: '#5F7188', fontSize: 14, lineHeight: 21, marginTop: 9, maxWidth: 510 },
  courseIdentity: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 17, paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#D8E5F5' },
  courseMark: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, courseIdentityCopy: { flex: 1 },
  courseCode: { color: BLUE, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 }, courseName: { color: '#31445E', fontSize: 12, lineHeight: 17, marginTop: 2 },
  primaryAction: { alignSelf: 'flex-start', minHeight: 46, borderRadius: 13, paddingHorizontal: 18, marginTop: 20, backgroundColor: BLUE, flexDirection: 'row', alignItems: 'center', gap: 12 },
  primaryActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  section: { marginBottom: 30 }, sectionEyebrow: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1.25, marginBottom: 6 }, sectionTitle: { color: '#18263B', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sectionIntro: { color: '#718198', fontSize: 13, marginTop: 5, marginBottom: 13, lineHeight: 19 }, sectionHeadingRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  tools: { borderTopWidth: 1, borderTopColor: '#E7ECF3' }, toolsWide: { marginTop: 2 },
  tool: { minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 13, borderBottomWidth: 1, borderBottomColor: '#E7ECF3', paddingVertical: 10 },
  toolIcon: { width: 43, height: 43, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, toolCopy: { flex: 1, minWidth: 0 }, toolTitle: { color: '#203048', fontSize: 14, fontWeight: '700' }, toolDetail: { color: '#7A899B', fontSize: 12, marginTop: 3 },
  assistant: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 17, borderWidth: 1, borderColor: '#DCE8F9', backgroundColor: '#F8FBFF', padding: 16, marginBottom: 31 },
  assistantLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, aiLogo: { width: 27, height: 32 }, assistantCopy: { flex: 1, minWidth: 0 },
  assistantKicker: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, assistantTitle: { color: '#21324A', fontSize: 15, fontWeight: '800', marginTop: 3 }, assistantBody: { color: '#6F8095', fontSize: 12, lineHeight: 18, marginTop: 3 },
  emptySchedule: { flexDirection: 'row', gap: 13, alignItems: 'flex-start', borderTopWidth: 1, borderTopColor: '#E7ECF3', paddingTop: 17, marginTop: 14 },
  emptyScheduleCopy: { flex: 1 }, emptyTitle: { color: '#27374D', fontSize: 13, fontWeight: '700' }, emptyBody: { color: '#7A899B', fontSize: 12, lineHeight: 19, marginTop: 4 },
  manage: { color: BLUE, fontSize: 12, fontWeight: '800', paddingVertical: 5 }, courseRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 58, borderBottomWidth: 1, borderBottomColor: '#E7ECF3' },
  courseDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: BLUE }, courseRowCopy: { flex: 1 }, courseRowCode: { color: '#253854', fontSize: 12, fontWeight: '800' }, courseRowName: { color: '#77879B', fontSize: 11, marginTop: 2 },
  noCourses: { color: '#7A899B', fontSize: 12, lineHeight: 19, borderTopWidth: 1, borderTopColor: '#E7ECF3', paddingTop: 14, marginTop: 10 }, moreCourses: { color: '#718198', fontSize: 11, marginTop: 10 },
});
