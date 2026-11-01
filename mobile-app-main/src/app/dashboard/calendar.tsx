import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import ScheduleCalendar from '@/components/calendar/ScheduleCalendar';
import { addDays, EVENT_TYPES, loadPlannerEvents, localDateKey, plannerEventSchema, savePlannerEvents, sortPlannerEvents, type PlannerEvent } from '@/services/studentCalendar';

const BLUE = '#2563EB';
const TYPE_LABEL: Record<PlannerEvent['type'], string> = { class: 'Class', study: 'Study session', assignment: 'Assignment', exam: 'Exam' };
const TYPE_COLOR: Record<PlannerEvent['type'], string> = { class: BLUE, study: '#0F766E', assignment: '#B45309', exam: '#B54156' };
type Draft = Omit<PlannerEvent, 'id'> & { id?: string };
const blankDraft = (): Draft => ({ title: '', type: 'study', date: localDateKey(), allDay: false, startTime: '09:00', endTime: '10:00', courseCode: '', location: '', notes: '' });

export default function StudentCalendarScreen() {
  const router = useRouter();
  const ui = useThemedStyles(styles);
  const { mode } = useTheme();
  const dark = mode === 'dark';
  const { width } = useWindowDimensions();
  const wide = width >= 960;
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const upcoming = sortPlannerEvents(events.filter(event => event.date >= localDateKey())).slice(0, 5);
  const todayCount = events.filter(event => event.date === localDateKey()).length;

  useFocusEffect(useCallback(() => {
    let active = true;
    loadPlannerEvents().then(value => { if (active) { setEvents(value); setError(''); } }).catch(() => { if (active) setError('Your calendar could not be loaded.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  const openNew = () => { setFormError(''); setDraft(blankDraft()); };
  const openExisting = (id: string) => { const event = events.find(item => item.id === id); if (event) { setFormError(''); setDraft({ ...event }); } };
  const updateDraft = (patch: Partial<Draft>) => setDraft(current => current ? { ...current, ...patch } : current);

  const save = async () => {
    if (!draft) return;
    const result = plannerEventSchema.safeParse({ ...draft, id: draft.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}` });
    if (!result.success) { setFormError(result.error.issues[0]?.message || 'Check the event details.'); return; }
    setSaving(true); setFormError('');
    try {
      const next = draft.id ? events.map(item => item.id === draft.id ? result.data : item) : [...events, result.data];
      await savePlannerEvents(next);
      setEvents(next); setDraft(null); setError('');
    } catch { setFormError('Could not save this event. Try again.'); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!draft?.id) return;
    setSaving(true); setFormError('');
    try { const next = events.filter(item => item.id !== draft.id); await savePlannerEvents(next); setEvents(next); setDraft(null); }
    catch { setFormError('Could not remove this event. Try again.'); }
    finally { setSaving(false); }
  };

  const agenda = <View style={ui.agenda}><View style={ui.agendaHeader}><Text style={ui.eyebrow}>YOUR PLAN</Text><Text style={ui.agendaTitle}>Coming up</Text></View>{upcoming.length ? upcoming.map(event => <TouchableOpacity key={event.id} onPress={() => openExisting(event.id)} style={ui.agendaRow} accessibilityRole="button" accessibilityLabel={`Edit ${event.title}`}><View style={[ui.agendaLine, { backgroundColor: TYPE_COLOR[event.type] }]} /><View style={ui.agendaCopy}><Text style={ui.agendaType}>{TYPE_LABEL[event.type].toUpperCase()} · {new Date(`${event.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text><Text style={ui.agendaName} numberOfLines={2}>{event.title}</Text><Text style={ui.agendaMeta}>{event.allDay ? 'All day' : `${event.startTime}–${event.endTime}`}{event.courseCode ? ` · ${event.courseCode}` : ''}</Text></View><Ionicons name="chevron-forward" size={17} color={dark ? '#B5C3D5' : '#8A9AAF'} /></TouchableOpacity>) : <View style={ui.agendaEmpty}><Ionicons name="calendar-clear-outline" size={24} color={dark ? '#8AB8FF' : BLUE} /><Text style={ui.emptyTitle}>Your schedule starts here.</Text><Text style={ui.emptyBody}>Add your first class, study session, assignment, or exam.</Text></View>}</View>;

  return <SafeAreaView style={[ui.page, dark && { backgroundColor: '#0B1220' }]}>
    <ScrollView contentContainerStyle={[ui.content, { maxWidth: wide ? 1320 : 900 }]} showsVerticalScrollIndicator={false}>
      <View style={ui.topbar}><TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard/home')} style={ui.back} accessibilityRole="button" accessibilityLabel="Back to home"><Ionicons name="arrow-back" size={20} color={dark ? '#B5C3D5' : '#354860'} /></TouchableOpacity><Text style={ui.topbarText}>ACADEMIC CALENDAR</Text></View>
      <View style={ui.heading}><View style={ui.headingCopy}><Text style={ui.title}>Make room for what matters.</Text><Text style={ui.subtitle}>Your classes, study time, and deadlines in one clear plan.</Text></View><TouchableOpacity onPress={openNew} style={ui.addButton} accessibilityRole="button" accessibilityLabel="Add calendar event"><Ionicons name="add" size={20} color="#FFFFFF" /><Text style={ui.addText}>Add to plan</Text></TouchableOpacity></View>
      <View style={ui.summary}><Ionicons name="today-outline" size={19} color={dark ? '#8AB8FF' : BLUE} /><Text style={ui.summaryText}>{todayCount ? `${todayCount} ${todayCount === 1 ? 'item' : 'items'} planned for today` : 'Nothing planned for today'}</Text></View>
      {error ? <Text style={ui.error} accessibilityRole="alert">{error}</Text> : null}
      {loading ? <ActivityIndicator color={BLUE} style={{ marginVertical: 70 }} /> : <View style={[ui.layout, wide && ui.layoutWide]}><View style={ui.calendarPane}><ScheduleCalendar events={events} onSelectEvent={openExisting} /></View><View style={[ui.agendaPane, wide && ui.agendaPaneWide]}>{agenda}</View></View>}
    </ScrollView>
    <Modal visible={!!draft} transparent animationType="fade" onRequestClose={() => setDraft(null)}><View style={ui.modalShade}><View style={ui.modalCard}><ScrollView contentContainerStyle={ui.modalContent} keyboardShouldPersistTaps="handled"><View style={ui.modalHeader}><Text style={ui.modalTitle}>{draft?.id ? 'Edit plan' : 'Add to your plan'}</Text><TouchableOpacity onPress={() => setDraft(null)} accessibilityRole="button" accessibilityLabel="Close event form"><Ionicons name="close" size={22} color={dark ? '#E5EDF7' : '#203047'} /></TouchableOpacity></View>
      <Text style={ui.fieldLabel}>WHAT IS IT?</Text><TextInput value={draft?.title || ''} onChangeText={title => updateDraft({ title })} placeholder="e.g. Calculus revision" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Event title" />
      <Text style={ui.fieldLabel}>TYPE</Text><View style={ui.types}>{EVENT_TYPES.map(type => <TouchableOpacity key={type} onPress={() => updateDraft({ type, allDay: type === 'assignment' })} style={[ui.typeChoice, draft?.type === type && ui.typeSelected]} accessibilityRole="button" accessibilityState={{ selected: draft?.type === type }}><Text style={[ui.typeText, draft?.type === type && ui.typeTextSelected]}>{TYPE_LABEL[type]}</Text></TouchableOpacity>)}</View>
      <Text style={ui.fieldLabel}>DATE</Text><TextInput value={draft?.date || ''} onChangeText={date => updateDraft({ date })} placeholder="YYYY-MM-DD" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Event date" keyboardType="numbers-and-punctuation" /><View style={ui.quickDates}><Text style={ui.helper}>YYYY-MM-DD</Text>{[['Today', 0], ['Tomorrow', 1], ['Next week', 7]].map(([label, days]) => <TouchableOpacity key={label} onPress={() => updateDraft({ date: addDays(localDateKey(), Number(days)) })} accessibilityRole="button" style={ui.quickDate}><Text style={ui.quickDateText}>{label}</Text></TouchableOpacity>)}</View>
      <TouchableOpacity onPress={() => updateDraft({ allDay: !draft?.allDay })} style={ui.allDayRow} accessibilityRole="checkbox" accessibilityState={{ checked: !!draft?.allDay }}><View style={[ui.check, draft?.allDay && ui.checkActive]}>{draft?.allDay && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}</View><Text style={ui.allDayText}>All-day deadline or activity</Text></TouchableOpacity>
      {!draft?.allDay && <View style={ui.timeRow}><View style={ui.timeField}><Text style={ui.fieldLabel}>START</Text><TextInput value={draft?.startTime || ''} onChangeText={startTime => updateDraft({ startTime })} placeholder="09:00" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Start time" keyboardType="numbers-and-punctuation" /></View><View style={ui.timeField}><Text style={ui.fieldLabel}>END</Text><TextInput value={draft?.endTime || ''} onChangeText={endTime => updateDraft({ endTime })} placeholder="10:00" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="End time" keyboardType="numbers-and-punctuation" /></View></View>}
      <Text style={ui.fieldLabel}>COURSE CODE <Text style={ui.optional}>(OPTIONAL)</Text></Text><TextInput value={draft?.courseCode || ''} onChangeText={courseCode => updateDraft({ courseCode })} placeholder="e.g. MTH 101" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Course code" autoCapitalize="characters" />
      <Text style={ui.fieldLabel}>LOCATION <Text style={ui.optional}>(OPTIONAL)</Text></Text><TextInput value={draft?.location || ''} onChangeText={location => updateDraft({ location })} placeholder="e.g. LT 1 or online" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={ui.field} accessibilityLabel="Location" />
      <Text style={ui.fieldLabel}>NOTES <Text style={ui.optional}>(OPTIONAL)</Text></Text><TextInput value={draft?.notes || ''} onChangeText={notes => updateDraft({ notes })} placeholder="What do you need to prepare?" placeholderTextColor={dark ? '#8B9DB4' : '#8996A7'} style={[ui.field, ui.notesField]} accessibilityLabel="Event notes" multiline />
      {formError ? <Text style={ui.error} accessibilityRole="alert">{formError}</Text> : null}<View style={ui.formActions}>{draft?.id && <TouchableOpacity onPress={remove} disabled={saving} style={ui.deleteButton} accessibilityRole="button"><Ionicons name="trash-outline" size={17} color={dark ? '#EEA8A4' : '#A34747'} /><Text style={ui.deleteText}>Delete</Text></TouchableOpacity>}<TouchableOpacity onPress={save} disabled={saving} style={ui.saveButton} accessibilityRole="button" accessibilityLabel="Save event"><Text style={ui.saveText}>{saving ? 'Saving…' : 'Save event'}</Text></TouchableOpacity></View>
    </ScrollView></View></View></Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' }, content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 45 }, topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 }, back: { width: 39, height: 39, borderRadius: 12, backgroundColor: '#F0F4FA', alignItems: 'center', justifyContent: 'center' }, topbarText: { color: '#62738A', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }, headingCopy: { flex: 1, minWidth: 220 }, title: { color: '#18263B', fontSize: 29, fontWeight: '800', letterSpacing: -0.6, lineHeight: 35 }, subtitle: { color: '#6B7D94', fontSize: 14, lineHeight: 21, marginTop: 6 }, addButton: { backgroundColor: BLUE, borderRadius: 12, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 15 }, addText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 18, marginTop: 10 }, summaryText: { color: '#526780', fontSize: 12, fontWeight: '700' }, error: { color: '#B94A43', fontSize: 12, lineHeight: 18, marginVertical: 9 }, layout: { gap: 23 }, layoutWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 25 }, calendarPane: { flex: 1, minWidth: 0 }, agendaPane: { minWidth: 0 }, agendaPaneWide: { width: 290 }, agenda: { borderTopWidth: 1, borderTopColor: '#E3EAF3' }, agendaHeader: { paddingTop: 15, paddingBottom: 8 }, eyebrow: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, agendaTitle: { color: '#203047', fontSize: 18, fontWeight: '800', marginTop: 4 }, agendaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#E3EAF3', minHeight: 76, paddingVertical: 9 }, agendaLine: { width: 4, height: 46, borderRadius: 2 }, agendaCopy: { flex: 1, minWidth: 0 }, agendaType: { color: BLUE, fontSize: 9, fontWeight: '800', letterSpacing: 0.6 }, agendaName: { color: '#203047', fontSize: 13, fontWeight: '800', marginTop: 5 }, agendaMeta: { color: '#73849A', fontSize: 11, marginTop: 4 }, agendaEmpty: { paddingVertical: 24 }, emptyTitle: { color: '#203047', fontSize: 14, fontWeight: '800', marginTop: 13 }, emptyBody: { color: '#73849A', fontSize: 12, lineHeight: 18, marginTop: 5 },
  modalShade: { flex: 1, backgroundColor: '#071527A8', justifyContent: 'center', padding: 16 }, modalCard: { width: '100%', maxWidth: 470, maxHeight: '92%', alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 18 }, modalContent: { padding: 20 }, modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, modalTitle: { color: '#203047', fontSize: 20, fontWeight: '800' }, fieldLabel: { color: BLUE, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 7, marginTop: 9 }, optional: { color: '#8291A3', fontSize: 10, fontWeight: '600' }, field: { borderWidth: 1, borderColor: '#DCE5F0', borderRadius: 10, minHeight: 44, paddingHorizontal: 12, color: '#203047', fontSize: 13, backgroundColor: '#FFFFFF' }, helper: { color: '#8291A3', fontSize: 10, marginTop: 5 }, quickDates: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 7 }, quickDate: { borderWidth: 1, borderColor: '#DCE5F0', borderRadius: 12, paddingHorizontal: 8, minHeight: 28, alignItems: 'center', justifyContent: 'center' }, quickDateText: { color: BLUE, fontSize: 10, fontWeight: '700' }, types: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 8 }, typeChoice: { borderWidth: 1, borderColor: '#DCE5F0', borderRadius: 17, minHeight: 34, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }, typeSelected: { backgroundColor: BLUE, borderColor: BLUE }, typeText: { color: '#526780', fontSize: 11, fontWeight: '700' }, typeTextSelected: { color: '#FFFFFF' }, allDayRow: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 46, marginTop: 10 }, check: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#9EB2CC', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, checkActive: { backgroundColor: BLUE, borderColor: BLUE }, allDayText: { color: '#203047', fontSize: 12, fontWeight: '700' }, timeRow: { flexDirection: 'row', gap: 12 }, timeField: { flex: 1 }, notesField: { minHeight: 76, textAlignVertical: 'top', paddingTop: 10 }, formActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 13, marginTop: 19 }, deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 42, paddingHorizontal: 8 }, deleteText: { color: '#A34747', fontSize: 12, fontWeight: '800' }, saveButton: { minHeight: 44, backgroundColor: BLUE, borderRadius: 10, paddingHorizontal: 17, alignItems: 'center', justifyContent: 'center' }, saveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
