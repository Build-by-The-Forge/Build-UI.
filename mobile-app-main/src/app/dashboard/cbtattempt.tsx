import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ApiError } from '@/api/errors';
import type { Attempt, AttemptQuestions } from '@/api/types';
import { LoadBoundary } from '@/components/onboarding/LoadBoundary';
import { useLoad } from '@/features/academic/useLoad';
import { cbtApi } from '@/features/cbt';
import { describeCbtError, formatClock, secondsRemaining } from '@/features/cbt/present';

const BLUE = '#2563EB';

type Loaded = { attempt: Attempt; questions: AttemptQuestions; saved: Record<string, number> };

async function loadAttempt(attemptId: string): Promise<Loaded> {
  const api = cbtApi();
  const [attempt, questions, answers] = await Promise.all([api.attempt(attemptId), api.questions(attemptId), api.answers(attemptId)]);
  const saved: Record<string, number> = {};
  for (const a of answers.answers) saved[a.assessment_question_id] = a.selected_option_index;
  return { attempt, questions, saved };
}

export default function CbtAttemptScreen() {
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const load = useLoad(attemptId ?? null, () => loadAttempt(attemptId!));
  return (
    <SafeAreaView style={styles.safe}>
      <LoadBoundary status={attemptId ? load.status : 'error'} error={load.error} onRetry={load.reload}>
        {load.data && <AttemptRunner initial={load.data} />}
      </LoadBoundary>
    </SafeAreaView>
  );
}

function AttemptRunner({ initial }: { initial: Loaded }) {
  const router = useRouter();
  const { attempt } = initial;
  const questions = [...initial.questions.questions].sort((a, b) => a.sequence - b.sequence);
  const [answers, setAnswers] = useState<Record<string, number>>(initial.saved);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // The newest choice per question, so a slow reply to an earlier tap can't undo a later one.
  const latest = useRef<Record<string, number>>({ ...initial.saved });
  const submittedOnce = useRef(false);

  const secondsLeft = secondsRemaining(attempt.expires_at, now);
  const closed = attempt.status === 'submitted' || secondsLeft === 0;

  const goToResult = useCallback(
    () => router.replace({ pathname: '/dashboard/cbtresult', params: { attemptId: attempt.id } }),
    [router, attempt.id],
  );

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setNotice(null);
    try {
      await cbtApi().submit(attempt.id); // safe to repeat: it never grades twice
      goToResult();
    } catch (e) {
      if (e instanceof ApiError && (e.code === 'ATTEMPT_ALREADY_SUBMITTED' || e.code === 'ATTEMPT_EXPIRED')) {
        goToResult();
        return;
      }
      setNotice(e instanceof ApiError ? describeCbtError(e.code, e.message) : 'Could not submit. Check your connection and try again.');
      setSubmitting(false);
      setConfirming(false);
      // Before the deadline the student can try again themselves. At the
      // deadline the footer offers a retry, so a dead connection can't make
      // this loop.
    }
  }, [attempt.id, goToResult, submitting]);

  useEffect(() => {
    if (attempt.status === 'submitted') {
      goToResult();
      return;
    }
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [attempt.status, goToResult]);

  // At the deadline, send what is saved. The backend grades only what arrived in time.
  useEffect(() => {
    if (attempt.status === 'in_progress' && secondsLeft === 0 && !submittedOnce.current) {
      submittedOnce.current = true;
      void submit();
    }
  }, [attempt.status, secondsLeft, submit]);

  const choose = async (questionId: string, position: number) => {
    if (closed || submitting) return;
    const before = latest.current[questionId];
    latest.current[questionId] = position;
    setAnswers((a) => ({ ...a, [questionId]: position }));
    setNotice(null);
    try {
      await cbtApi().saveAnswer(attempt.id, questionId, position);
    } catch (e) {
      if (latest.current[questionId] !== position) return; // a newer tap owns the answer now
      if (before === undefined) delete latest.current[questionId];
      else latest.current[questionId] = before;
      setAnswers((a) => {
        const next = { ...a };
        if (before === undefined) delete next[questionId];
        else next[questionId] = before;
        return next;
      });
      if (e instanceof ApiError && e.code === 'ATTEMPT_ALREADY_SUBMITTED') {
        goToResult();
        return;
      }
      if (e instanceof ApiError && e.code === 'ATTEMPT_EXPIRED') {
        void submit(); // the deadline passed: send what is saved so it gets marked
        return;
      }
      setNotice('That answer was not saved. Check your connection and choose it again.');
    }
  };

  if (questions.length === 0) {
    return <Text style={styles.empty}>This attempt has no questions.</Text>;
  }

  const question = questions[Math.min(index, questions.length - 1)];
  const answered = questions.filter((q) => answers[q.assessment_question_id] !== undefined).length;
  const unanswered = questions.length - answered;

  return (
    <View style={styles.flex}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Leave and continue later" hitSlop={8}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={[styles.timer, secondsLeft <= 60 && styles.timerLow]} accessibilityRole="timer" accessibilityLabel={`Time left ${formatClock(secondsLeft)}`}>
          <Text style={[styles.timerText, secondsLeft <= 60 && styles.timerTextLow]}>⏱ {formatClock(secondsLeft)}</Text>
        </View>
        <Pressable onPress={() => setConfirming(true)} disabled={closed || submitting} accessibilityRole="button">
          <Text style={[styles.submitText, (closed || submitting) && styles.dim]}>Submit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!!notice && <Text style={styles.notice} accessibilityRole="alert">{notice}</Text>}
        {closed && <Text style={styles.notice}>Time is up. Your saved answers are being sent for marking.</Text>}

        <Text style={styles.meta}>QUESTION {String(index + 1).padStart(2, '0')} OF {String(questions.length).padStart(2, '0')} · {question.marks} {question.marks === 1 ? 'mark' : 'marks'}</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>

        <View style={styles.options}>
          {[...question.options].sort((a, b) => a.position - b.position).map((option) => {
            const selected = answers[question.assessment_question_id] === option.position;
            return (
              <Pressable
                key={option.position}
                onPress={() => choose(question.assessment_question_id, option.position)}
                disabled={closed || submitting}
                style={[styles.option, selected && styles.optionSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled: closed || submitting }}
              >
                <View style={[styles.letter, selected && styles.letterSelected]}>
                  <Text style={[styles.letterText, selected && styles.letterTextSelected]}>{String.fromCharCode(65 + option.position)}</Text>
                </View>
                <Text style={styles.optionText}>{option.text}</Text>
                {selected && <Text style={styles.tick}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.paletteHead}>
          <Text style={styles.paletteTitle}>QUESTION PALETTE</Text>
          <Text style={styles.paletteLeft}>{unanswered} left</Text>
        </View>
        <View style={styles.palette}>
          {questions.map((q, i) => {
            const done = answers[q.assessment_question_id] !== undefined;
            const current = i === index;
            return (
              <Pressable key={q.assessment_question_id} onPress={() => setIndex(i)} style={[styles.cell, done && styles.cellDone, current && styles.cellCurrent]} accessibilityRole="button" accessibilityLabel={`Question ${i + 1}${done ? ', answered' : ''}`}>
                <Text style={[styles.cellText, (done || current) && styles.cellTextOn]}>{i + 1}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {confirming ? (
        <View style={styles.confirm}>
          <Text style={styles.confirmTitle}>Submit this attempt?</Text>
          <Text style={styles.confirmBody}>
            {unanswered > 0 ? `${unanswered} ${unanswered === 1 ? 'question is' : 'questions are'} unanswered and will score zero. ` : ''}
            You can&apos;t change your answers after submitting.
          </Text>
          <View style={styles.confirmRow}>
            <Pressable style={styles.secondary} onPress={() => setConfirming(false)} disabled={submitting} accessibilityRole="button"><Text style={styles.secondaryText}>Keep working</Text></Pressable>
            <Pressable style={[styles.primary, submitting && styles.dim]} onPress={submit} disabled={submitting} accessibilityRole="button" accessibilityState={{ busy: submitting }}>
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Submit</Text>}
            </Pressable>
          </View>
        </View>
      ) : closed ? (
        <View style={styles.footer}>
          <Pressable style={[styles.primary, submitting && styles.dim]} onPress={submit} disabled={submitting} accessibilityRole="button" accessibilityState={{ busy: submitting }}>
            {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Send my answers</Text>}
          </Pressable>
        </View>
      ) : (
        <View style={styles.footer}>
          <Pressable style={[styles.secondary, index === 0 && styles.dim]} onPress={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} accessibilityRole="button"><Text style={styles.secondaryText}>← Previous</Text></Pressable>
          <Pressable style={[styles.primary, index >= questions.length - 1 && styles.dim]} onPress={() => setIndex((i) => Math.min(questions.length - 1, i + 1))} disabled={index >= questions.length - 1} accessibilityRole="button"><Text style={styles.primaryText}>Next →</Text></Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  empty: { padding: 24, color: '#6B7280' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  close: { fontSize: 20, fontWeight: '700', color: '#111827' },
  timer: { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  timerLow: { backgroundColor: '#FEE2E2' },
  timerText: { color: BLUE, fontWeight: '800', fontSize: 13 },
  timerTextLow: { color: '#EF4444' },
  submitText: { color: BLUE, fontWeight: '800', fontSize: 15 },
  dim: { opacity: 0.45 },
  content: { padding: 20, paddingBottom: 32, gap: 14 },
  notice: { color: '#92400E', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 12, lineHeight: 19 },
  meta: { color: '#6B7280', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  prompt: { fontSize: 18, fontWeight: '700', color: '#111827', lineHeight: 26 },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  optionSelected: { borderColor: BLUE, backgroundColor: '#EFF6FF' },
  letter: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  letterSelected: { backgroundColor: BLUE, borderColor: BLUE },
  letterText: { fontWeight: '800', color: '#4B5563' },
  letterTextSelected: { color: '#FFFFFF' },
  optionText: { flex: 1, color: '#1F2937', fontSize: 15, lineHeight: 21 },
  tick: { color: BLUE, fontWeight: '800' },
  paletteHead: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  paletteTitle: { color: '#6B7280', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  paletteLeft: { color: '#6B7280', fontSize: 12 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  cellDone: { backgroundColor: '#93C5FD', borderColor: '#93C5FD' },
  cellCurrent: { backgroundColor: BLUE, borderColor: BLUE },
  cellText: { color: '#4B5563', fontWeight: '700' },
  cellTextOn: { color: '#FFFFFF' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  confirm: { padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  confirmTitle: { fontWeight: '800', fontSize: 16, color: '#111827' },
  confirmBody: { color: '#4B5563', lineHeight: 20 },
  confirmRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  primary: { flex: 1, minHeight: 46, borderRadius: 12, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  secondary: { flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: BLUE, fontWeight: '700' },
});
