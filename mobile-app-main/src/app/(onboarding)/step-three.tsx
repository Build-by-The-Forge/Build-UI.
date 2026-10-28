import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProgressHeader from '@/components/ProgressHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useOnboarding } from '@/context/Onboardingcontext';
import colors from '@/theme/colors';

interface GoalItem {
  id: string;
  label: string;
  icon: string;
  iconBg: string;
}

const GOALS: GoalItem[] = [
  { id: 'exams', label: 'Prepare for exams', icon: '🎓', iconBg: '#FEF3C7' },
  { id: 'topics', label: 'Understand difficult topics', icon: '📘', iconBg: '#DBEAFE' },
  { id: 'grades', label: 'Improve my grades', icon: '🌱', iconBg: '#DCFCE7' },
  { id: 'organize', label: 'Organize my studies', icon: '📗', iconBg: '#DCFCE7' },
  { id: 'materials', label: 'Find learning materials', icon: '🎨', iconBg: '#EDE9FE' },
  { id: 'classmates', label: 'Connect with classmates', icon: '👥', iconBg: '#E0E7FF' },
  { id: 'skills', label: 'Learn new skills', icon: '⭐', iconBg: '#FEF9C3' },
  { id: 'career', label: 'Prepare for my career', icon: '💼', iconBg: '#FEE2E2' },
];

const DEFAULT_SELECTED = ['exams', 'topics', 'grades', 'organize'];

export default function Step3Goals() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    data.goals.length ? data.goals : DEFAULT_SELECTED
  );

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateData({ goals: selectedGoals });
    router.push('/(onboarding)/step-four');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader step={3} total={5} onBack={() => router.back()} />

      <View style={styles.headingBlock}>
        <Text style={styles.title}>What do you want BUILD to help you achieve?</Text>
        <Text style={styles.subtitle}>
          Select all that apply — we'll tailor your BUILD experience.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {GOALS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              activeOpacity={0.8}
              onPress={() => toggleGoal(goal.id)}
            >
              <View style={styles.goalLeft}>
                <View style={[styles.iconWrap, { backgroundColor: goal.iconBg }]}>
                  <Text style={styles.iconText}>{goal.icon}</Text>
                </View>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                  {goal.label}
                </Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.selectedCountWrap}>
          <View style={styles.selectedCountPill}>
            <Text style={styles.selectedCountText}>✓ {selectedGoals.length} goals selected</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headingBlock: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: colors.cardBackground,
  },
  goalCardSelected: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryTint,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  goalLabelSelected: {
    color: colors.primaryDark,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTick: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  selectedCountWrap: {
    alignItems: 'center',
    marginTop: 6,
  },
  selectedCountPill: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  selectedCountText: {
    color: colors.chipText,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
});