import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ProgressHeader from '@/components/ProgressHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useOnboarding } from '@/context/Onboardingcontext';
import colors from '@/theme/colors';

interface StyleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
}

const STYLES: StyleItem[] = [
  { id: 'reading', title: 'Reading', subtitle: 'Text & Notes', icon: '📖', iconBg: '#DBEAFE' },
  { id: 'videos', title: 'Videos', subtitle: 'Watch & Learn', icon: '🎬', iconBg: '#FCE7F3' },
  { id: 'ai', title: 'AI Explanations', subtitle: 'Smart Help', icon: '🤖', iconBg: '#EDE9FE' },
  { id: 'flashcards', title: 'Flashcards', subtitle: 'Quick Review', icon: '🗂️', iconBg: '#CFFAFE' },
  { id: 'practice', title: 'Practice Questions', subtitle: 'Test Yourself', icon: '✏️', iconBg: '#FEF9C3' },
  { id: 'group', title: 'Group Study', subtitle: 'Learn Together', icon: '👥', iconBg: '#E0E7FF' },
];

const DEFAULT_SELECTED = ['reading', 'videos', 'ai', 'flashcards'];

export default function Step4LearningStyle() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    data.learningStyles.length ? data.learningStyles : DEFAULT_SELECTED
  );

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateData({ learningStyles: selectedStyles });
    router.push('/(onboarding)/step-five');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader step={4} total={5} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>How do you learn best?</Text>
        <Text style={styles.subtitle}>We'll mix your favorite formats to make studying feel natural.</Text>

        <View style={styles.grid}>
          {STYLES.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <TouchableOpacity
                key={style.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                activeOpacity={0.8}
                onPress={() => toggleStyle(style.id)}
              >
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkBadgeText}>✓</Text>
                  </View>
                )}
                <View style={[styles.iconWrap, { backgroundColor: style.iconBg }]}>
                  <Text style={styles.iconText}>{style.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{style.title}</Text>
                <Text style={styles.cardSubtitle}>{style.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.selectedCountWrap}>
          <View style={styles.selectedCountPill}>
            <Text style={styles.selectedCountText}>✓ {selectedStyles.length} styles selected</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="See My Summary" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  cardSelected: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryTint,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  selectedCountWrap: {
    alignItems: 'center',
    marginTop: 4,
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
    paddingBottom: 20,
    paddingTop: 8,
  },
});