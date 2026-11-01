import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOnboarding, type AcademicLevel } from '@/context/Onboardingcontext';
import { getCoursesForDepartment, getSchools } from '@/data/institutionData';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { loadStudyShelf, saveStudyShelf, type StudyShelf } from '@/services/studyShelf';

const BLUE = '#2563EB';
const FILTERS = ['All', 'Core', 'Electives', 'Lab'] as const;
const LEVELS: AcademicLevel[] = [
  { id: '100', title: '100 Level', subtitle: 'First Year' }, { id: '200', title: '200 Level', subtitle: 'Second Year' },
  { id: '300', title: '300 Level', subtitle: 'Third Year' }, { id: '400', title: '400 Level', subtitle: 'Fourth Year' },
  { id: '500', title: '500 Level', subtitle: 'Fifth Year' }, { id: 'postgrad', title: 'Postgraduate', subtitle: 'Masters / PhD' },
];
const departments = getSchools().flatMap(school => school.departments.map(department => ({ school, department })));
type Filter = typeof FILTERS[number];

export default function ManageCoursesScreen() {
  const router = useRouter();
  const ui = useThemedStyles(styles);
  const { mode } = useTheme();
  const dark = mode === 'dark';
  const { width } = useWindowDimensions();
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.courses);
  const [levelId, setLevelId] = useState(data.academicLevel?.id || '');
  const [departmentCode, setDepartmentCode] = useState(data.department?.code || '');
  const [departmentPickerOpen, setDepartmentPickerOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [shelf, setShelf] = useState<StudyShelf>({ courses: [], notes: [] });
  const [removedCustom, setRemovedCustom] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const level = LEVELS.find(item => item.id === levelId) || null;
  const departmentChoice = departments.find(item => item.department.code === departmentCode);
  const hasProfile = !!(departmentChoice && level);
  const available = hasProfile ? getCoursesForDepartment(departmentCode, levelId) : [];
  const visible = available.filter(course => filter === 'All' || course.category === (filter === 'Electives' ? 'elective' : filter.toLowerCase()));
  const customCourses = shelf.courses.filter(course => !removedCustom.includes(course.id));
  const changed = levelId !== (data.academicLevel?.id || '') || departmentCode !== (data.department?.code || '') || selected.length !== data.courses.length || selected.some(id => !data.courses.includes(id)) || removedCustom.length > 0;

  useEffect(() => {
    loadStudyShelf().then(setShelf).catch(() => setError('Your saved courses could not be loaded.')).finally(() => setLoading(false));
  }, []);

  const goBack = () => router.canGoBack() ? router.back() : router.replace('/dashboard/studymode');
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const chooseLevel = (id: string) => { if (id !== levelId) { setLevelId(id); setSelected([]); } };
  const chooseDepartment = (code: string) => { if (code !== departmentCode) { setDepartmentCode(code); setSelected([]); } setDepartmentPickerOpen(false); setDepartmentSearch(''); };
  const matchingDepartments = departments.filter(item => `${item.department.name} ${item.department.code} ${item.school.name}`.toLowerCase().includes(departmentSearch.trim().toLowerCase()));

  const save = async () => {
    setSaving(true); setError('');
    try {
      if (removedCustom.length) {
        await saveStudyShelf({
          courses: customCourses,
          notes: shelf.notes.map(note => removedCustom.includes(note.courseId || '') ? { ...note, courseId: null } : note),
        });
      }
      updateData({
        school: departmentChoice?.school || null,
        department: departmentChoice?.department || null,
        academicLevel: level,
        courses: selected,
        selectedCourseDetails: available.filter(course => selected.includes(course.id)),
      });
      goBack();
    } catch { setError('Could not save your course changes. Try again.'); }
    finally { setSaving(false); }
  };

  return <SafeAreaView style={[ui.page, dark && { backgroundColor: '#0B1220' }]}>
    <ScrollView contentContainerStyle={[ui.content, { maxWidth: width >= 760 ? 780 : undefined }]} showsVerticalScrollIndicator={false}>
      <View style={ui.topbar}><TouchableOpacity onPress={goBack} style={ui.back} accessibilityRole="button" accessibilityLabel="Back without saving"><Ionicons name="arrow-back" size={20} color={dark ? '#B5C3D5' : '#354860'} /></TouchableOpacity><Text style={ui.topbarTitle}>STUDY SPACE</Text></View>
      <Text style={ui.title}>Manage your courses</Text>
      <Text style={ui.subtitle}>Keep your shelf aligned with what you are studying now.</Text>
      {error ? <Text style={ui.error} accessibilityRole="alert">{error}</Text> : null}
      <View style={ui.profileSection}><Text style={ui.eyebrow}>YOUR PROGRAMME</Text><Text style={ui.sectionTitle}>Find your courses</Text><Text style={ui.profileHint}>Choose your level and department to see the right course catalogue.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ui.levels}>{LEVELS.map(item => <TouchableOpacity key={item.id} onPress={() => chooseLevel(item.id)} style={[ui.filter, levelId === item.id && ui.filterActive]} accessibilityRole="button" accessibilityState={{ selected: levelId === item.id }}><Text style={[ui.filterText, levelId === item.id && ui.filterTextActive]}>{item.title}</Text></TouchableOpacity>)}</ScrollView>
        <TouchableOpacity onPress={() => setDepartmentPickerOpen(true)} style={ui.departmentButton} accessibilityRole="button" accessibilityLabel="Choose department"><Ionicons name="school-outline" size={20} color={dark ? '#8AB8FF' : BLUE} /><Text style={ui.departmentText} numberOfLines={2}>{departmentChoice ? `${departmentChoice.department.name} (${departmentCode})` : 'Choose your department'}</Text><Ionicons name="chevron-down" size={18} color={dark ? '#B5C3D5' : '#64748B'} /></TouchableOpacity>
      </View>
      {hasProfile ? <>
        <View style={ui.sectionHeading}><View><Text style={ui.eyebrow}>COURSE CATALOGUE</Text><Text style={ui.sectionTitle}>Choose your courses</Text></View><Text style={ui.count}>{selected.length} selected</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ui.filters}>{FILTERS.map(item => <TouchableOpacity key={item} onPress={() => setFilter(item)} style={[ui.filter, filter === item && ui.filterActive]} accessibilityRole="button" accessibilityState={{ selected: filter === item }}><Text style={[ui.filterText, filter === item && ui.filterTextActive]}>{item}</Text></TouchableOpacity>)}</ScrollView>
        {visible.length ? visible.map(course => {
          const checked = selected.includes(course.id);
          return <TouchableOpacity key={course.id} onPress={() => toggle(course.id)} style={ui.courseRow} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={`${course.code} ${course.name}`}>
            <View style={ui.courseCopy}><Text style={ui.courseCode}>{course.code}</Text><Text style={ui.courseName}>{course.name}</Text><Text style={ui.courseMeta}>{course.units} {course.units === 1 ? 'unit' : 'units'} · {course.category}</Text></View><View style={[ui.check, checked && ui.checkActive]}>{checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}</View>
          </TouchableOpacity>;
        }) : <Text style={ui.empty}>No courses in this category for your current level and department.</Text>}
      </> : <Text style={ui.empty}>Select a level and department above to browse courses. You can still manage courses you added yourself below.</Text>}
      <View style={ui.customSection}><Text style={ui.eyebrow}>ADDED BY YOU</Text><Text style={ui.sectionTitle}>Your own courses</Text>{loading ? <ActivityIndicator color={BLUE} style={ui.loading} /> : customCourses.length ? customCourses.map(course => <View key={course.id} style={ui.customRow}><View style={ui.courseCopy}><Text style={ui.courseCode}>{course.code}</Text><Text style={ui.courseName}>{course.name}</Text></View><TouchableOpacity onPress={() => setRemovedCustom(current => [...current, course.id])} style={ui.removeButton} accessibilityRole="button" accessibilityLabel={`Remove ${course.code}`}><Ionicons name="trash-outline" size={18} color={dark ? '#EEA8A4' : '#A34747'} /></TouchableOpacity></View>) : <Text style={ui.empty}>Courses you add from the Study shelf will appear here.</Text>}</View>
    </ScrollView>
    <View style={[ui.footer, dark && { backgroundColor: '#172235', borderColor: '#304055' }]}><Text style={ui.footerHint}>{changed ? 'Your changes are ready to save.' : 'Your course selection is up to date.'}</Text><TouchableOpacity onPress={save} disabled={saving || loading || !!error} style={[ui.saveButton, (saving || loading || !!error) && ui.saveDisabled]} accessibilityRole="button" accessibilityLabel="Save courses"><Text style={ui.saveText}>{saving ? 'Saving…' : 'Save courses'}</Text><Ionicons name="checkmark" size={17} color="#FFFFFF" /></TouchableOpacity></View>
    <Modal visible={departmentPickerOpen} transparent animationType="fade" onRequestClose={() => setDepartmentPickerOpen(false)}><View style={ui.modalShade}><View style={ui.modalCard}><View style={ui.modalHeader}><Text style={ui.modalTitle}>Choose department</Text><TouchableOpacity onPress={() => setDepartmentPickerOpen(false)} accessibilityRole="button" accessibilityLabel="Close department picker"><Ionicons name="close" size={22} color={dark ? '#E5EDF7' : '#203047'} /></TouchableOpacity></View><TextInput value={departmentSearch} onChangeText={setDepartmentSearch} placeholder="Search departments" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.search} accessibilityLabel="Search departments" /><ScrollView style={ui.departmentList} keyboardShouldPersistTaps="handled">{matchingDepartments.map(item => <TouchableOpacity key={item.department.code} onPress={() => chooseDepartment(item.department.code)} style={ui.departmentRow} accessibilityRole="button" accessibilityLabel={`${item.department.name}, ${item.school.name}`}><View style={ui.courseCopy}><Text style={ui.departmentName}>{item.department.name}</Text><Text style={ui.departmentSchool}>{item.school.name}</Text></View>{departmentCode === item.department.code && <Ionicons name="checkmark-circle" size={20} color={dark ? '#8AB8FF' : BLUE} />}</TouchableOpacity>)}{!matchingDepartments.length && <Text style={ui.empty}>No matching department.</Text>}</ScrollView></View></View></Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' }, content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 27 }, back: { width: 39, height: 39, borderRadius: 12, backgroundColor: '#F0F4FA', alignItems: 'center', justifyContent: 'center' }, topbarTitle: { color: '#62738A', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: '#18263B', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }, subtitle: { color: '#6B7D94', fontSize: 14, lineHeight: 21, marginTop: 7, marginBottom: 24 },
  error: { color: '#B94A43', fontSize: 13, marginBottom: 13 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginBottom: 14 }, eyebrow: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 6 }, sectionTitle: { color: '#203047', fontSize: 18, fontWeight: '800' }, count: { color: '#667A94', fontSize: 12, fontWeight: '700' },
  filters: { gap: 8, paddingBottom: 18 }, filter: { minHeight: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: '#DDE6F1', alignItems: 'center', justifyContent: 'center' }, filterActive: { backgroundColor: BLUE, borderColor: BLUE }, filterText: { color: '#53677F', fontSize: 12, fontWeight: '700' }, filterTextActive: { color: '#FFFFFF' },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 80, borderTopWidth: 1, borderTopColor: '#E5EBF3', paddingVertical: 13 }, courseCopy: { flex: 1, minWidth: 0 }, courseCode: { color: BLUE, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 }, courseName: { color: '#203047', fontSize: 14, fontWeight: '700', lineHeight: 19, marginTop: 3 }, courseMeta: { color: '#74849A', fontSize: 11, marginTop: 4, textTransform: 'capitalize' }, check: { width: 25, height: 25, borderRadius: 8, borderWidth: 1.5, borderColor: '#AFC0D4', alignItems: 'center', justifyContent: 'center' }, checkActive: { backgroundColor: BLUE, borderColor: BLUE },
  empty: { color: '#74849A', fontSize: 13, lineHeight: 20, paddingVertical: 20 }, customSection: { borderTopWidth: 1, borderTopColor: '#E5EBF3', marginTop: 26, paddingTop: 23 }, customRow: { flexDirection: 'row', alignItems: 'center', minHeight: 65, borderBottomWidth: 1, borderBottomColor: '#E5EBF3' }, removeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, loading: { marginVertical: 20 },
  profileSection: { marginBottom: 24 }, profileHint: { color: '#6B7D94', fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 16 }, levels: { gap: 8, paddingBottom: 15 }, departmentButton: { minHeight: 52, borderWidth: 1, borderColor: '#DDE6F1', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 11 }, departmentText: { flex: 1, color: '#203047', fontSize: 13, fontWeight: '700' },
  modalShade: { flex: 1, backgroundColor: '#07152799', justifyContent: 'center', padding: 16 }, modalCard: { width: '100%', maxWidth: 520, maxHeight: '85%', alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18 }, modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, modalTitle: { color: '#203047', fontSize: 18, fontWeight: '800' }, search: { minHeight: 44, borderWidth: 1, borderColor: '#DDE6F1', borderRadius: 10, paddingHorizontal: 12, color: '#203047', fontSize: 13, marginBottom: 10 }, departmentList: { flexGrow: 0 }, departmentRow: { flexDirection: 'row', alignItems: 'center', minHeight: 58, borderBottomWidth: 1, borderBottomColor: '#E5EBF3', gap: 10 }, departmentName: { color: '#203047', fontSize: 13, fontWeight: '700' }, departmentSchool: { color: '#74849A', fontSize: 11, marginTop: 3 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderColor: '#E5EBF3', backgroundColor: '#FFFFFF' }, footerHint: { flex: 1, color: '#74849A', fontSize: 11, lineHeight: 16 }, saveButton: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: BLUE, minHeight: 44, paddingHorizontal: 16, borderRadius: 11 }, saveDisabled: { opacity: 0.5 }, saveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
