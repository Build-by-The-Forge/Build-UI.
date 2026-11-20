import React, { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ApiError } from '@/api/errors';
import type { Assessment, Attempt } from '@/api/types';
import { LoadBoundary } from '@/components/onboarding/LoadBoundary';
import { useLoad } from '@/features/academic/useLoad';
import { cbtApi } from '@/features/cbt';
import { describeAttempts, describeCbtError, describeResultTiming } from '@/features/cbt/present';

const BLUE = '#2563EB';

type Row = { readonly assessment: Assessment; readonly inProgress: Attempt | null; readonly latestSubmitted: Attempt | null };

async function loadRows(): Promise<readonly Row[]> {
  const [assessments, attempts] = await Promise.all([cbtApi().assessments(), cbtApi().attempts()]);
  return assessments.map((assessment) => {
    const mine = attempts.filter((a) => a.assessment_id === assessment.id); // newest first
    return {
      assessment,
      inProgress: mine.find((a) => a.status === 'in_progress') ?? null,
      latestSubmitted: mine.find((a) => a.status === 'submitted') ?? null,
    };
  });
}

/** Published assessments for this campus. Starting, grading and results are the backend's. */
export default function CbtListScreen() {
  const router = useRouter();
  const rows = useLoad('cbt-list', loadRows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const start = async (assessment: Assessment) => {
    if (busyId) return;
    setBusyId(assessment.id);
    setMessage(null);
    try {
      const attempt = await cbtApi().startAttempt(assessment.id);
      router.push({ pathname: '/dashboard/cbtattempt', params: { attemptId: attempt.id } });
    } catch (e) {
      setMessage(e instanceof ApiError ? describeCbtError(e.code, e.message) : 'Something went wrong. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/dashboard/studymode'))} accessibilityRole="button" accessibilityLabel="Back">
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>CBT Practice</Text>
        <Text style={styles.subtitle}>Timed assessments published for your campus. Your answers are marked by BUILD, not on your phone.</Text>
        {!!message && <Text style={styles.message} accessibilityRole="alert">{message}</Text>}

        <LoadBoundary status={rows.status} error={rows.error} onRetry={rows.reload} isEmpty={rows.data?.length === 0} empty="No assessments are published for you yet.">
          {(rows.data ?? []).map(({ assessment, inProgress, latestSubmitted }) => {
            const busy = busyId === assessment.id;
            return (
              <View key={assessment.id} style={styles.card}>
                <Text style={styles.cardTitle}>{assessment.title}</Text>
                {!!assessment.instructions && <Text style={styles.instructions} numberOfLines={3}>{assessment.instructions}</Text>}
                <Text style={styles.meta}>{assessment.question_count} questions · {assessment.duration_minutes} min</Text>
                <Text style={styles.meta}>{describeAttempts(assessment.attempt_policy, assessment.attempts_used)}</Text>
                <Text style={styles.meta}>{describeResultTiming(assessment.attempt_policy)}</Text>
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.primary, busy && styles.disabled]}
                    disabled={busy}
                    onPress={() => (inProgress ? router.push({ pathname: '/dashboard/cbtattempt', params: { attemptId: inProgress.id } }) : start(assessment))}
                    accessibilityRole="button"
                    accessibilityState={{ busy }}
                  >
                    {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>{inProgress ? 'Continue attempt' : 'Start'}</Text>}
                  </Pressable>
                  {latestSubmitted && (
                    <Pressable style={styles.secondary} onPress={() => router.push({ pathname: '/dashboard/cbtresult', params: { attemptId: latestSubmitted.id } })} accessibilityRole="button">
                      <Text style={styles.secondaryText}>View result</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </LoadBoundary>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  back: { color: BLUE, fontWeight: '700', fontSize: 15 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 8 },
  subtitle: { color: '#6B7280', fontSize: 14, lineHeight: 20 },
  message: { color: '#92400E', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 12, lineHeight: 19 },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, gap: 4, backgroundColor: '#F9FAFB' },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  instructions: { color: '#4B5563', fontSize: 13, lineHeight: 19, marginTop: 2 },
  meta: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primary: { minHeight: 44, minWidth: 130, paddingHorizontal: 18, borderRadius: 12, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  secondary: { minHeight: 44, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: BLUE, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
