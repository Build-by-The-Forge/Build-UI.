import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useOnboarding } from '@/context/Onboardingcontext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/ThemeContext';
import { loadStudyShelf, openStudyNote, saveStudyShelf, storePickedNote, type StudyShelf, type ShelfNote } from '@/services/studyShelf';

const BLUE = '#2563EB';
const newCourseSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z]{2,5}\s?\d{3,4}[A-Z]?$/, 'Use a course code like MTH 101.').max(12),
  name: z.string().trim().regex(/^[\p{L}\p{N}][\p{L}\p{N}\s&(),.'/-]{2,79}$/u, 'Enter a course name of 3–80 characters.'),
});
const modes = [
  { number: '01', name: 'Read Mode', description: 'Read a lesson at your own pace and focus on the key ideas.', action: 'Open reading', icon: 'book-outline' as const, tint: '#EAF2FF', color: BLUE, darkTint: '#20385A', darkColor: '#8AB8FF', route: '/dashboard/readmode' as const },
  { number: '02', name: 'CBT Practice', description: 'Answer practice questions and check your understanding.', action: 'Start practice', icon: 'checkbox-outline' as const, tint: '#E7F6F1', color: '#0F766E', darkTint: '#163B3B', darkColor: '#6CD6C3', route: '/dashboard/cbtquiz' as const },
  { number: '03', name: 'Video Lessons', description: 'Explore lessons in a format you can watch and revisit.', action: 'Browse videos', icon: 'play-circle-outline' as const, tint: '#F1EDFF', color: '#7252B5', darkTint: '#342D4E', darkColor: '#BBA4F5', route: '/dashboard/videoplayer' as const },
];

export default function StudyModesScreen() {
  const ui = useThemedStyles(styles);
  const { mode } = useTheme();
  const dark = mode === 'dark';
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, getAvailableCourses } = useOnboarding();
  const wide = width >= 760;
  const selectedCourses = getAvailableCourses().filter(course => data.courses.includes(course.id));
  const hasProfile = !!(data.department && data.academicLevel);
  const manageCourses = () => router.push(hasProfile ? '/(onboarding)/step-two' : '/(onboarding)/step-one');
  const aiReady = !!process.env.EXPO_PUBLIC_BUILD_AI_API_URL;
  const [shelf, setShelf] = useState<StudyShelf>({ courses: [], notes: [] });
  const [shelfLoading, setShelfLoading] = useState(true);
  const [shelfError, setShelfError] = useState('');
  const [busy, setBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const allCourses = [...selectedCourses.map(course => ({ id: course.id, code: course.code, name: course.name })), ...shelf.courses];

  useEffect(() => {
    loadStudyShelf().then(setShelf).catch(() => setShelfError('Your saved shelf could not be loaded.')).finally(() => setShelfLoading(false));
  }, []);

  const persist = async (next: StudyShelf) => {
    await saveStudyShelf(next);
    setShelf(next);
  };

  const addCourse = async () => {
    const result = newCourseSchema.safeParse({ code: courseCode, name: courseName });
    if (!result.success) { setShelfError(result.error.issues[0]?.message || 'Check the course details.'); return; }
    if (allCourses.some(course => course.code.replace(/\s/g, '').toUpperCase() === result.data.code.replace(/\s/g, ''))) {
      setShelfError('This course is already on your shelf.'); return;
    }
    setBusy(true); setShelfError('');
    try {
      await persist({ ...shelf, courses: [...shelf.courses, { id: `custom-${Date.now()}`, ...result.data }] });
      setCourseCode(''); setCourseName(''); setCourseFormOpen(false); setAddOpen(false);
    } catch { setShelfError('Could not save the course. Try again.'); }
    finally { setBusy(false); }
  };

  const pickNote = async (courseId: string | null = null) => {
    setShelfError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'image/*'], copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) return;
      setBusy(true);
      const note = await storePickedNote(result.assets[0], courseId);
      await persist({ ...shelf, notes: [...shelf.notes, note] });
      setAddOpen(false);
    } catch (error) { setShelfError(error instanceof Error ? error.message : 'Could not add this note. Try again.'); }
    finally { setBusy(false); }
  };

  const openNote = async (note: ShelfNote) => {
    setShelfError('');
    try { await openStudyNote(note); }
    catch (error) { setShelfError(error instanceof Error ? error.message : 'Could not open this note.'); }
  };

  const courseShelf = <View style={ui.courseSection}>
    <View style={ui.sectionTop}><Text style={ui.eyebrow}>YOUR COURSE SHELF</Text><View style={ui.shelfActions}><TouchableOpacity onPress={manageCourses} accessibilityRole="button" accessibilityLabel="Choose catalogue courses"><Text style={ui.manage}>Manage</Text></TouchableOpacity><TouchableOpacity onPress={() => setAddOpen(true)} style={ui.addButton} accessibilityRole="button" accessibilityLabel="Add course or lecture notes"><Ionicons name="add" size={21} color="#FFFFFF" /></TouchableOpacity></View></View>
    {shelfError ? <Text style={ui.shelfError} accessibilityRole="alert">{shelfError}</Text> : null}
    {shelfLoading ? <ActivityIndicator color={BLUE} style={{ marginVertical: 25 }} /> : allCourses.length ? <>
      <View style={ui.courseFeature}>
        <View style={ui.courseCover}><Ionicons name="book-outline" size={25} color="#FFFFFF" /><Text style={ui.coverCode}>{allCourses[0].code}</Text></View>
        <View style={ui.courseCopy}><Text style={ui.courseLabel}>ON YOUR SHELF</Text><Text style={ui.courseName}>{allCourses[0].name}</Text><Text style={ui.courseMeta}>{shelf.courses.some(course => course.id === allCourses[0].id) ? 'Added by you' : data.department?.name || 'Selected course'}</Text></View>
      </View>
      {allCourses.slice(1).map(course => <View key={course.id} style={ui.shelfRow}><View style={ui.courseMini}><Text style={ui.courseMiniText}>{course.code}</Text></View><Text style={ui.shelfRowName} numberOfLines={2}>{course.name}</Text><TouchableOpacity onPress={() => pickNote(course.id)} accessibilityRole="button" accessibilityLabel={`Attach notes to ${course.code}`} style={ui.attachButton}><Ionicons name="attach-outline" size={19} color={dark ? '#8AB8FF' : BLUE} /></TouchableOpacity></View>)}
      <TouchableOpacity onPress={() => pickNote(allCourses[0].id)} style={ui.attachFirst} accessibilityRole="button"><Ionicons name="attach-outline" size={16} color={dark ? '#8AB8FF' : BLUE} /><Text style={ui.attachText}>Attach notes to {allCourses[0].code}</Text></TouchableOpacity>
    </> : <View style={ui.emptyCourse}><View style={ui.emptyIcon}><Ionicons name="library-outline" size={24} color={BLUE} /></View><Text style={ui.emptyTitle}>Your courses, in one place.</Text><Text style={ui.emptyBody}>Add a course or upload lecture notes to start building your shelf.</Text><TouchableOpacity onPress={() => setAddOpen(true)} style={ui.setupButton} accessibilityRole="button"><Text style={ui.setupText}>Add to your shelf</Text><Ionicons name="add" size={18} color="#FFFFFF" /></TouchableOpacity></View>}
    {shelf.notes.length > 0 && <View style={ui.notesSection}><Text style={ui.notesHeading}>LECTURE NOTES</Text>{shelf.notes.map(note => <TouchableOpacity key={note.id} style={ui.noteRow} onPress={() => openNote(note)} accessibilityRole="button" accessibilityLabel={`Open ${note.name}`}><View style={ui.noteIcon}><Ionicons name="document-text-outline" size={19} color={dark ? '#8AB8FF' : BLUE} /></View><View style={ui.noteCopy}><Text style={ui.noteName} numberOfLines={1}>{note.name}</Text><Text style={ui.noteMeta}>{allCourses.find(course => course.id === note.courseId)?.code || 'General notes'} · {new Date(note.addedAt).toLocaleDateString()}</Text></View><Ionicons name="open-outline" size={17} color={dark ? '#B5C3D5' : '#728399'} /></TouchableOpacity>)}</View>}
  </View>;

  const modeList = <View style={ui.modesSection}>
    <Text style={ui.eyebrow}>LEARNING MODES</Text>
    <Text style={ui.sectionTitle}>Choose your way in.</Text>
    <Text style={ui.sectionIntro}>A focused place to read, practise, or watch.</Text>
    <View style={ui.modeList}>{modes.map(mode =>
      <TouchableOpacity key={mode.number} style={ui.modeRow} onPress={() => router.push(mode.route)} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel={mode.action}>
        <View style={[ui.modeVisual, { backgroundColor: dark ? mode.darkTint : mode.tint }]}><Ionicons name={mode.icon} size={25} color={dark ? mode.darkColor : mode.color} /><Text style={[ui.modeNumber, { color: dark ? mode.darkColor : mode.color }]}>{mode.number}</Text></View>
        <View style={ui.modeCopy}><Text style={ui.modeTitle}>{mode.name}</Text><Text style={ui.modeDescription}>{mode.description}</Text><Text style={ui.modeAction}>{mode.action}  <Ionicons name="arrow-forward" size={13} color={BLUE} /></Text></View>
      </TouchableOpacity>
    )}</View>
  </View>;

  const ai = <TouchableOpacity style={ui.aiSection} onPress={() => router.push('/dashboard/buildai')} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel="Open BUILD AI chat">
    <View style={[ui.aiMark, dark && { backgroundColor: '#FFFFFF' }]}><Image source={require('@/assets/images/build-ai-logo.png')} resizeMode="contain" style={ui.aiLogo} /></View>
    <View style={ui.aiCopy}><Text style={ui.aiEyebrow}>NEED A HAND?</Text><Text style={ui.aiTitle}>Think it through with BUILD AI</Text><Text style={ui.aiDescription}>{aiReady ? 'Ask about a concept or plan your next study session.' : 'Explore the chat. AI replies need a service connection.'}</Text></View>
    <Ionicons name="arrow-forward" size={18} color={dark ? '#8AB8FF' : BLUE} />
  </TouchableOpacity>;

  return <SafeAreaView style={[ui.page, dark && { backgroundColor: '#0B1220' }]}>
    <ScrollView contentContainerStyle={[ui.content, { maxWidth: wide ? 1100 : undefined }]} showsVerticalScrollIndicator={false}>
      <View style={ui.topbar}><TouchableOpacity onPress={() => router.replace('/dashboard/home')} style={ui.back} accessibilityRole="button" accessibilityLabel="Back to home"><Ionicons name="arrow-back" size={20} color={dark ? '#B5C3D5' : '#354860'} /></TouchableOpacity><Text style={ui.topbarTitle}>Study</Text></View>
      <View style={ui.intro}><Text style={ui.pageTitle}>Make learning yours.</Text><Text style={ui.pageSubtitle}>Pick a course, then choose the format that fits your focus today.</Text></View>
      {wide ? <View style={ui.columns}><View style={ui.sideColumn}>{courseShelf}{ai}</View><View style={ui.mainColumn}>{modeList}</View></View> : <>{modeList}{courseShelf}{ai}</>}
    </ScrollView>
    <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => { setAddOpen(false); setCourseFormOpen(false); }}>
      <View style={ui.modalShade}><View style={ui.modalCard}><View style={ui.modalTop}><Text style={ui.modalTitle}>{courseFormOpen ? 'Add a course' : 'Add to your shelf'}</Text><TouchableOpacity onPress={() => { setAddOpen(false); setCourseFormOpen(false); setShelfError(''); }} accessibilityRole="button" accessibilityLabel="Close"><Ionicons name="close" size={22} color={dark ? '#E5EDF7' : '#24354C'} /></TouchableOpacity></View>
        {courseFormOpen ? <><Text style={ui.fieldLabel}>COURSE CODE</Text><TextInput value={courseCode} onChangeText={setCourseCode} autoCapitalize="characters" placeholder="e.g. MTH 101" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Course code" /><Text style={ui.fieldLabel}>COURSE NAME</Text><TextInput value={courseName} onChangeText={setCourseName} placeholder="e.g. General Mathematics" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Course name" />{shelfError ? <Text style={ui.shelfError} accessibilityRole="alert">{shelfError}</Text> : null}<TouchableOpacity disabled={busy} onPress={addCourse} style={ui.modalPrimary} accessibilityRole="button"><Text style={ui.modalPrimaryText}>{busy ? 'Saving…' : 'Add course'}</Text></TouchableOpacity></> : <><Text style={ui.modalHelp}>Keep your courses and lecture files together on this device.</Text><TouchableOpacity onPress={() => { setCourseFormOpen(true); setShelfError(''); }} style={ui.modalOption} accessibilityRole="button"><Ionicons name="book-outline" size={22} color={dark ? '#8AB8FF' : BLUE} /><View style={ui.modalOptionCopy}><Text style={ui.modalOptionTitle}>Add a course</Text><Text style={ui.modalOptionDetail}>Enter its code and title</Text></View><Ionicons name="chevron-forward" size={17} color={dark ? '#B5C3D5' : '#728399'} /></TouchableOpacity><TouchableOpacity disabled={busy} onPress={() => pickNote()} style={ui.modalOption} accessibilityRole="button"><Ionicons name="document-attach-outline" size={22} color={dark ? '#8AB8FF' : BLUE} /><View style={ui.modalOptionCopy}><Text style={ui.modalOptionTitle}>Upload lecture notes</Text><Text style={ui.modalOptionDetail}>PDF, Word, slides, text or image · up to 25 MB</Text></View><Ionicons name="chevron-forward" size={17} color={dark ? '#B5C3D5' : '#728399'} /></TouchableOpacity>{busy && <ActivityIndicator color={BLUE} />}{shelfError ? <Text style={ui.shelfError} accessibilityRole="alert">{shelfError}</Text> : null}</>}
      </View></View>
    </Modal>
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
  shelfActions: { flexDirection: 'row', alignItems: 'center', gap: 15 }, addButton: { width: 36, height: 36, borderRadius: 11, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  shelfError: { color: '#B94A43', fontSize: 12, lineHeight: 18, marginVertical: 9 },
  shelfRow: { flexDirection: 'row', alignItems: 'center', minHeight: 54, gap: 11, borderBottomWidth: 1, borderBottomColor: '#E5EBF3' },
  courseMini: { minWidth: 67, paddingHorizontal: 7, height: 29, borderRadius: 8, backgroundColor: '#EAF2FF', alignItems: 'center', justifyContent: 'center' }, courseMiniText: { color: BLUE, fontSize: 10, fontWeight: '800' },
  shelfRowName: { flex: 1, color: '#203047', fontSize: 13, lineHeight: 18, fontWeight: '700' }, attachButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  attachFirst: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 10 }, attachText: { color: BLUE, fontSize: 12, fontWeight: '700' },
  notesSection: { marginTop: 18 }, notesHeading: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 7 }, noteRow: { flexDirection: 'row', alignItems: 'center', minHeight: 57, gap: 11, borderBottomWidth: 1, borderBottomColor: '#E5EBF3' }, noteIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EAF2FF', alignItems: 'center', justifyContent: 'center' }, noteCopy: { flex: 1, minWidth: 0 }, noteName: { color: '#203047', fontSize: 13, fontWeight: '700' }, noteMeta: { color: '#728399', fontSize: 11, marginTop: 3 },
  modalShade: { flex: 1, backgroundColor: '#07152799', justifyContent: 'center', padding: 20 }, modalCard: { width: '100%', maxWidth: 460, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22 }, modalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, modalTitle: { color: '#18263B', fontSize: 21, fontWeight: '800' }, modalHelp: { color: '#718198', fontSize: 13, lineHeight: 20, marginBottom: 11 }, modalOption: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E5EBF3', minHeight: 66 }, modalOptionCopy: { flex: 1 }, modalOptionTitle: { color: '#203047', fontSize: 14, fontWeight: '800' }, modalOptionDetail: { color: '#728399', fontSize: 11, marginTop: 3 }, fieldLabel: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8, marginTop: 9 }, field: { borderWidth: 1, borderColor: '#D9E3F0', borderRadius: 11, minHeight: 46, paddingHorizontal: 13, color: '#203047', fontSize: 14, marginBottom: 12 }, modalPrimary: { backgroundColor: BLUE, borderRadius: 11, minHeight: 46, alignItems: 'center', justifyContent: 'center', marginTop: 8 }, modalPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
