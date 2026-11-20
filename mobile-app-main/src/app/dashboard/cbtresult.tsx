import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { ApiError } from '@/api/errors';
import { useLoad } from '@/features/academic/useLoad';
import { cbtApi } from '@/features/cbt';
import { describeCbtError } from '@/features/cbt/present';
import { LoadBoundary } from '@/components/onboarding/LoadBoundary';

const BLUE = '#2563EB';

async function loadResult(attemptId: string) {
  const api = cbtApi();
  const result = await api.result(attemptId);
  // Question numbers are a nicety; the result stands without them.
  const order = await api
    .questions(attemptId)
    .then((q) => new Map(q.questions.map((x) => [x.assessment_question_id, x.sequence])))
    .catch(() => new Map<string, number>());
  return { result, order };
}

/**
 * The graded result, exactly as the backend returns it. The score and pass mark
 * are the backend's; per-question feedback appears only when it sends it.
 */
export default function CbtResultScreen() {
  const router = useRouter();
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const load = useLoad(attemptId ?? null, () => loadResult(attemptId!));

  const goBack = () => router.replace('/dashboard/cbtquiz');
  const withheld = load.error?.code === 'RESULT_NOT_RELEASED' || load.error?.code === 'ATTEMPT_NOT_SUBMITTED';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your result</Text>

        {withheld ? (
          <WithheldNotice error={load.error as ApiError} onRetry={load.reload} />
        ) : (
          <LoadBoundary status={attemptId ? load.status : 'error'} error={load.error} onRetry={load.reload}>
            {load.data && (
              <>
                <View style={styles.scoreCard} accessibilityLabel={`Score ${load.data.result.total_score} out of ${load.data.result.max_score}`}>
                  <Text style={styles.percent}>{formatPercent(load.data.result.percentage)}</Text>
                  <Text style={styles.score}>{load.data.result.total_score} of {load.data.result.max_score} marks</Text>
                  <Text style={[styles.verdict, load.data.result.passed ? styles.pass : styles.fail]}>
                    {load.data.result.passed ? 'Passed' : 'Not passed'}
                  </Text>
                </View>

                <Text style={styles.section}>Question by question</Text>
                {load.data.result.breakdown.every((b) => b.is_correct === null) && (
                  <Text style={styles.note}>Feedback on individual questions isn&apos;t available for this assessment yet.</Text>
                )}
                {[...load.data.result.breakdown]
                  .sort((a, b) => (load.data!.order.get(a.assessment_question_id) ?? 0) - (load.data!.order.get(b.assessment_question_id) ?? 0))
                  .map((b, i) => (
                    <View key={b.assessment_question_id} style={styles.row}>
                      <Text style={styles.rowTitle}>Question {load.data!.order.get(b.assessment_question_id) ?? i + 1}</Text>
                      <Text style={styles.rowDetail}>
                        {b.selected_option_index === null ? 'Not answered' : 'Answered'}
                        {b.is_correct === null ? '' : b.is_correct ? ' · Correct' : ' · Incorrect'}
                        {b.awarded_marks === null ? '' : ` · ${b.awarded_marks}/${b.max_marks}`}
                      </Text>
                    </View>
                  ))}
              </>
            )}
          </LoadBoundary>
        )}

        <Pressable style={styles.primary} onPress={goBack} accessibilityRole="button">
          <Text style={styles.primaryText}>Back to assessments</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function WithheldNotice({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  return (
    <View style={styles.withheld}>
      <Text style={styles.withheldTitle}>Submitted</Text>
      <Text style={styles.withheldBody}>{describeCbtError(error.code, error.message)}</Text>
      <Pressable style={styles.secondary} onPress={onRetry} accessibilityRole="button">
        <Text style={styles.secondaryText}>Check again</Text>
      </Pressable>
    </View>
  );
}

function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827' },
  scoreCard: { alignItems: 'center', padding: 24, borderRadius: 20, backgroundColor: '#EFF6FF', gap: 4 },
  percent: { fontSize: 44, fontWeight: '800', color: BLUE },
  score: { color: '#374151', fontSize: 15 },
  verdict: { fontWeight: '800', fontSize: 16, marginTop: 6 },
  pass: { color: '#15803D' },
  fail: { color: '#B91C1C' },
  section: { marginTop: 10, fontWeight: '800', color: '#111827', fontSize: 16 },
  note: { color: '#6B7280', fontSize: 13, lineHeight: 19 },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  rowTitle: { fontWeight: '700', color: '#111827' },
  rowDetail: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  withheld: { padding: 20, borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', gap: 8 },
  withheldTitle: { fontWeight: '800', fontSize: 18, color: '#111827' },
  withheldBody: { color: '#4B5563', lineHeight: 20 },
  primary: { marginTop: 16, minHeight: 48, borderRadius: 12, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  secondary: { alignSelf: 'flex-start', minHeight: 40, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: BLUE, fontWeight: '700' },
});
