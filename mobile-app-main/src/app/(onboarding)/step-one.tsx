import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { LoadBoundary } from '@/components/onboarding/LoadBoundary';
import { OptionList } from '@/components/onboarding/OptionList';
import PrimaryButton from '@/components/PrimaryButton';
import ProgressHeader from '@/components/ProgressHeader';
import { useOnboarding } from '@/context/Onboardingcontext';
import { levelsFor } from '@/features/academic/api';
import { useAcademicProfile } from '@/features/academic/ProfileProvider';
import { useLoad } from '@/features/academic/useLoad';
import colors from '@/theme/colors';

/** Faculty, department, programme and level, all read from the catalogue. */
export default function Step1Programme() {
  const router = useRouter();
  const { api, profile } = useAcademicProfile();
  const { data, setProgramme, setLevel, loadFromProfile } = useOnboarding();
  const [facultyId, setFacultyId] = useState<string | null>(data.faculty?.id ?? null);
  const [departmentId, setDepartmentId] = useState<string | null>(data.department?.id ?? null);

  // Editing an existing profile starts from what the backend holds.
  useEffect(() => {
    if (profile && !data.programme && profile.programme) {
      loadFromProfile(profile);
      setFacultyId(profile.faculty?.id ?? null);
      setDepartmentId(profile.department?.id ?? null);
    }
  }, [profile, data.programme, loadFromProfile]);

  const faculties = useLoad('faculties', (signal) => api.faculties(signal));
  const departments = useLoad(facultyId ? `departments:${facultyId}` : null, (signal) => api.departments(facultyId!, signal));
  const programmes = useLoad(departmentId ? `programmes:${departmentId}` : null, (signal) => api.programmes(departmentId!, signal));

  const selectedProgramme = programmes.data?.find((p) => p.id === data.programme?.id) ?? null;
  const levels = levelsFor(selectedProgramme);
  const ready = !!data.programme && data.level !== null && levels.includes(data.level);

  const chooseFaculty = (id: string) => {
    if (id === facultyId) return;
    setFacultyId(id);
    setDepartmentId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader step={1} total={5} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Where do you study?</Text>
        <Text style={styles.subtitle}>Your school, department and programme come from the university&apos;s own catalogue.</Text>

        <Text style={styles.section}>School</Text>
        <LoadBoundary status={faculties.status} error={faculties.error} onRetry={faculties.reload} isEmpty={faculties.data?.length === 0} empty="No schools are published yet.">
          <OptionList
            options={(faculties.data ?? []).map((f) => ({ id: f.id, label: f.name }))}
            selectedId={facultyId}
            onSelect={chooseFaculty}
          />
        </LoadBoundary>

        {facultyId && (
          <>
            <Text style={styles.section}>Department</Text>
            <LoadBoundary status={departments.status} error={departments.error} onRetry={departments.reload} isEmpty={departments.data?.length === 0} empty="No departments are published for this school.">
              <OptionList
                options={(departments.data ?? []).map((d) => ({ id: d.id, label: d.name }))}
                selectedId={departmentId}
                onSelect={setDepartmentId}
              />
            </LoadBoundary>
          </>
        )}

        {departmentId && (
          <>
            <Text style={styles.section}>Programme</Text>
            <LoadBoundary status={programmes.status} error={programmes.error} onRetry={programmes.reload} isEmpty={programmes.data?.length === 0} empty="No programmes are published for this department.">
              <OptionList
                options={(programmes.data ?? []).map((p) => ({ id: p.id, label: p.name, detail: `${p.code} · ${p.duration_years} years` }))}
                selectedId={data.programme?.id ?? null}
                onSelect={(id) => {
                  const programme = programmes.data?.find((p) => p.id === id);
                  const faculty = faculties.data?.find((f) => f.id === facultyId);
                  const department = departments.data?.find((d) => d.id === departmentId);
                  if (programme && faculty && department) {
                    setProgramme(
                      { id: faculty.id, name: faculty.name },
                      { id: department.id, name: department.name },
                      { id: programme.id, name: programme.name, code: programme.code, durationYears: programme.duration_years },
                    );
                  }
                }}
              />
            </LoadBoundary>
          </>
        )}

        {data.programme && (
          <View>
            <Text style={styles.section}>Level</Text>
            <OptionList
              options={levels.map((level) => ({ id: String(level), label: `${level} Level` }))}
              selectedId={data.level === null ? null : String(data.level)}
              onSelect={(id) => setLevel(Number(id))}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" disabled={!ready} onPress={() => router.push('/(onboarding)/step-two')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: 6, marginBottom: 8 },
  section: { fontSize: 13, fontWeight: '800', color: colors.primary, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 22, marginBottom: 10 },
  footer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 },
});
