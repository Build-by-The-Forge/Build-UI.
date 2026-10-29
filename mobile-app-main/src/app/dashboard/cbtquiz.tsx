import React, { useState, useEffect, useCallback } from 'react';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/theme';
import { QuizQuestion } from '@/types/dashboard';

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
  danger: '#EF4444',
  dangerTint: '#FEE2E2',
  success: '#22C55E',
  successTint: '#DCFCE7',
};

const QUESTIONS = [
  {
    id: 1,
    difficulty: 'Medium',
    prompt: 'What is the integral of f(x) = 3x^2 + 2x with respect to x?',
    options: [
      { id: 'A', text: 'x^3 + x^2 + C' },
      { id: 'B', text: '6x + 2 + C' },
      { id: 'C', text: '3x^3 + 2x^2 + C' },
      { id: 'D', text: 'x^3 + 2x + C' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 2,
    difficulty: 'Easy',
    prompt: 'Which law of thermodynamics states that energy cannot be created or destroyed?',
    options: [
      { id: 'A', text: 'Zeroth Law' },
      { id: 'B', text: 'First Law' },
      { id: 'C', text: 'Second Law' },
      { id: 'D', text: 'Third Law' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 3,
    difficulty: 'Hard',
    prompt:
      "Which of the following describes the primary function of the BUILD AI's predictive model in adaptive learning?",
    options: [
      { id: 'A', text: 'Calculating the final score of a student at the end of the semester.' },
      { id: 'B', text: 'Analyzing historical performance to adjust the difficulty of future questions in real-time.' },
      { id: 'C', text: 'Generating automated email reports for administrative faculty members.' },
      { id: 'D', text: 'Maintaining the server infrastructure during high-traffic mock exam sessions.' },
    ],
    correctOptionId: 'B',
  },
];

const TOTAL_QUESTIONS = 20;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CbtQuizScreen() {
  const ui = useThemedStyles(styles);
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(44 * 60 + 12);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({ 1: 'A', 2: 'B' });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const close = useCallback(() => {
    router.back();
  }, [router]);

  const submitQuiz = useCallback(() => {
    Alert.alert(
      'Submit CBT Practice?',
      'Are you sure you want to submit your answers for evaluation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'default',
          onPress: () => {
            Alert.alert('Quiz Submitted!', 'Great job! Your score is 95%.', [
              { text: 'Back to Study', onPress: () => router.push('/dashboard/studymode') },
            ]);
          },
        },
      ]
    );
  }, [router]);

  const activeQuestion = QUESTIONS[(currentQuestionIndex - 1) % QUESTIONS.length];
  const selectedOptionId = userAnswers[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionId,
    }));
  };

  return (
    <SafeAreaView style={ui.safeArea}>
      {/* Top bar */}
      <View style={ui.topBar}>
        <TouchableOpacity onPress={close} hitSlop={8}>
          <Text style={ui.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={ui.timerPill}>
          <Text style={ui.timerText}>⏱ {formatTime(secondsLeft)}</Text>
        </View>
        <TouchableOpacity onPress={submitQuiz}>
          <Text style={ui.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={ui.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={ui.metaRow}>
          <Text style={ui.questionMeta}>
            QUESTION {String(currentQuestionIndex).padStart(2, '0')} OF {TOTAL_QUESTIONS}
          </Text>
          <View style={ui.difficultyPill}>
            <Text style={ui.difficultyText}>ⓘ {activeQuestion.difficulty}</Text>
          </View>
        </View>

        <Text style={ui.prompt}>{activeQuestion.prompt}</Text>

        <View style={ui.optionsList}>
          {activeQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[ui.optionCard, isSelected && ui.optionCardSelected]}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(option.id)}
              >
                <View style={[ui.optionLetter, isSelected && ui.optionLetterSelected]}>
                  <Text style={[ui.optionLetterText, isSelected && ui.optionLetterTextSelected]}>
                    {option.id}
                  </Text>
                </View>
                <Text style={ui.optionText}>{option.text}</Text>
                {isSelected && (
                  <View style={ui.optionCheck}>
                    <Text style={ui.optionCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={ui.paletteHeaderRow}>
          <Text style={ui.paletteHeading}>QUESTION PALETTE</Text>
          <Text style={ui.paletteRemaining}>
            {TOTAL_QUESTIONS - Object.keys(userAnswers).length} left
          </Text>
        </View>

        <View style={ui.paletteGrid}>
          {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i + 1).map((num) => {
            const isCurrent = num === currentQuestionIndex;
            const isAnswered = !!userAnswers[num] && !isCurrent;
            return (
              <TouchableOpacity
                key={num}
                style={[
                  ui.paletteItem,
                  isAnswered && ui.paletteItemAnswered,
                  isCurrent && ui.paletteItemCurrent,
                ]}
                onPress={() => setCurrentQuestionIndex(num)}
              >
                <Text
                  style={[
                    ui.paletteItemText,
                    isAnswered && ui.paletteItemTextAnswered,
                    isCurrent && ui.paletteItemTextCurrent,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={ui.footer}>
        <TouchableOpacity
          style={ui.previousButton}
          onPress={() => setCurrentQuestionIndex((q) => Math.max(1, q - 1))}
        >
          <Text style={ui.previousButtonText}>←  Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ui.nextButton}
          onPress={() => setCurrentQuestionIndex((q) => Math.min(TOTAL_QUESTIONS, q + 1))}
        >
          <Text style={ui.nextButtonText}>Next Question  →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeIcon: { fontSize: 20, color: COLORS.textPrimary, fontWeight: '700' },
  timerPill: {
    backgroundColor: COLORS.dangerTint,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: { color: COLORS.danger, fontSize: 13, fontWeight: '800' },
  submitText: { color: COLORS.primary, fontSize: 15, fontWeight: '800' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32 },

  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  questionMeta: { fontSize: 12, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  difficultyPill: { backgroundColor: COLORS.surface, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  difficultyText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '700' },

  prompt: { fontSize: 17, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary, marginTop: 14, lineHeight: 24 },

  optionsList: { marginTop: 20 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: COLORS.background,
  },
  optionCardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryTint },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetterSelected: { backgroundColor: COLORS.primary },
  optionLetterText: { fontSize: 12, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textSecondary },
  optionLetterTextSelected: { color: '#fff' },
  optionText: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontFamily: Fonts.regular, lineHeight: 20, fontWeight: '500' },
  optionCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  optionCheckText: { color: '#fff', fontSize: 12, fontWeight: '800', fontFamily: Fonts.bold },

  paletteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  paletteHeading: { fontSize: 12, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textSecondary, letterSpacing: 0.5 },
  paletteRemaining: { fontSize: 12, color: COLORS.primary, fontFamily: Fonts.bold, fontWeight: '700' },

  paletteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  paletteItem: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  paletteItemAnswered: { backgroundColor: COLORS.successTint, borderColor: COLORS.successTint },
  paletteItemCurrent: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  paletteItemText: { fontSize: 12, fontWeight: '700', fontFamily: Fonts.bold, color: COLORS.textSecondary },
  paletteItemTextAnswered: { color: '#15803D' },
  paletteItemTextCurrent: { color: '#fff' },

  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  previousButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previousButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  nextButton: {
    flex: 1.4,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  nextButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
