import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { Fonts } from '@/constants/theme';

const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  background: '#FFFFFF',
  surface: '#F9FAFB',
};

const TABS = ['All Modes', 'Completed', 'Favorites'];

interface StudyModeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  badge: string | null;
  badgeBg?: string;
  badgeColor?: string;
  cta: string;
  ctaColor: string;
  route: '/dashboard/readmode' | '/dashboard/cbtquiz' | '/dashboard/videoplayer';
}

const MODES: StudyModeItem[] = [
  {
    id: 'read',
    title: 'Read Mode',
    description: 'Immersive text-based lessons with highlighted concepts, bullet points and key takeaways.',
    icon: '📘',
    iconBg: '#DBEAFE',
    badge: 'NEW CONTENT',
    badgeBg: '#DBEAFE',
    badgeColor: '#1D4ED8',
    cta: 'Continue reading',
    ctaColor: '#2563EB',
    route: '/dashboard/readmode',
  },
  {
    id: 'cbt',
    title: 'CBT Practice Mode',
    description: 'Timed practice exams with question palette, instant evaluation, and answer keys.',
    icon: '⏱️',
    iconBg: '#FFEDD5',
    badge: 'TIMED QUIZ',
    badgeBg: '#FFEDD5',
    badgeColor: '#C2410C',
    cta: 'Take a mock test',
    ctaColor: '#EA580C',
    route: '/dashboard/cbtquiz',
  },
  {
    id: 'video',
    title: 'Video Lecture Mode',
    description: 'Expert-led video lectures with interactive timestamps, chapter playlists, and visual aids.',
    icon: '▶️',
    iconBg: '#EDE9FE',
    badge: 'HD LECTURES',
    badgeBg: '#EDE9FE',
    badgeColor: '#7C3AED',
    cta: 'Browse video playlist',
    ctaColor: '#7C3AED',
    route: '/dashboard/videoplayer',
  },
];

export default function StudyModesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Modes');

  const handleCustomPlan = () => {
    router.push('/dashboard/buildai');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Modes</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
              {isActive && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MODES.map((mode) => (
          <View key={mode.id} style={styles.card}>
            {mode.badge && (
              <View style={[styles.badge, { backgroundColor: mode.badgeBg }]}>
                <Text style={[styles.badgeText, { color: mode.badgeColor }]}>{mode.badge}</Text>
              </View>
            )}
            <View style={[styles.iconWrap, { backgroundColor: mode.iconBg }]}>
              <Text style={styles.iconText}>{mode.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{mode.title}</Text>
            <Text style={styles.cardDescription}>{mode.description}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(mode.route)}
              style={styles.ctaButton}
            >
              <Text style={[styles.cardCta, { color: mode.ctaColor }]}>{mode.cta}  →</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.customPlanCard}
          activeOpacity={0.85}
          onPress={handleCustomPlan}
        >
          <Text style={styles.customPlanLabel}>PERSONALIZED FOR YOU</Text>
          <Text style={styles.customPlanTitle}>✦ Need a custom study plan?</Text>
          <Text style={styles.customPlanText}>
            Let BUILD AI curate your study materials based on your recent performance.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <DashboardBottomNav activeTab="study" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backArrow: { fontSize: 22, color: COLORS.textPrimary, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabItem: { marginRight: 24, paddingBottom: 10 },
  tabText: { fontSize: 13, color: COLORS.textMuted, fontFamily: Fonts.medium, fontWeight: '600' },
  tabTextActive: { color: COLORS.primary, fontFamily: Fonts.bold, fontWeight: '800' },
  tabUnderline: { height: 2.5, backgroundColor: COLORS.primary, marginTop: 8, borderRadius: 1.5 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 130 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 9.5, fontWeight: '800', fontFamily: Fonts.bold },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: { fontSize: 22 },
  cardTitle: { fontSize: 16, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  cardDescription: { fontSize: 13, color: COLORS.textSecondary, fontFamily: Fonts.regular, marginTop: 6, lineHeight: 19 },
  ctaButton: { marginTop: 12, alignSelf: 'flex-start' },
  cardCta: { fontSize: 13.5, fontWeight: '800', fontFamily: Fonts.bold },

  customPlanCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  customPlanLabel: { fontSize: 10, color: '#FBBF24', fontWeight: '800', fontFamily: Fonts.bold, letterSpacing: 0.5 },
  customPlanTitle: { fontSize: 16, color: '#fff', fontWeight: '800', fontFamily: Fonts.bold, marginTop: 6 },
  customPlanText: { fontSize: 13, color: '#CBD5E1', fontFamily: Fonts.regular, marginTop: 6, lineHeight: 19 },
});
