import React, { useState } from 'react';
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

const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryTint: '#EFF6FF',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  background: '#FFFFFF',
  success: '#16A34A',
};

const BULLET_POINTS = [
  { id: '1', title: 'Economies of Scale:', text: 'Larger firms can spread fixed costs over more units.' },
  { id: '2', title: 'Capital Requirements:', text: 'Massive investment in R&D or infrastructure.' },
  { id: '3', title: 'Access to Distribution:', text: 'Owning the channels through which products reach customers.' },
];

export default function ReadModeScreen() {
  const ui = useThemedStyles(styles);
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<number>(1);

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    Alert.alert(isBookmarked ? 'Bookmark Removed' : 'Bookmarked!', 'Saved to your study library.');
  };

  const toggleFontSize = () => {
    setFontSizeScale((prev) => (prev >= 1.2 ? 1 : prev + 0.1));
  };

  const handleAiSummary = () => {
    Alert.alert(
      '✦ BUILD AI Summary',
      "Porter's Five Forces assesses: 1. New Entrants, 2. Buyer Power, 3. Supplier Power, 4. Substitutes, and 5. Competitive Rivalry. Use this framework to find strategic moats in fast-moving industries."
    );
  };

  return (
    <SafeAreaView style={ui.safeArea}>
      {/* Header */}
      <View style={ui.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text style={ui.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={ui.headerTitles}>
          <Text style={ui.headerTitle} numberOfLines={1}>
            Module 4: Market Dynamics
          </Text>
          <Text style={ui.headerSubtitle}>UNIT 2: COMPETITIVE ANALYSIS</Text>
        </View>
        <View style={ui.headerActions}>
          <TouchableOpacity hitSlop={8} onPress={toggleFontSize} style={ui.headerActionButton}>
            <Text style={ui.headerActionIcon}>A±</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} onPress={toggleBookmark} style={ui.headerActionButton}>
            <Text style={[ui.headerActionIcon, isBookmarked && { color: COLORS.primary }]}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={ui.headerProgress}>
        <View style={ui.headerProgressFill} />
      </View>

      <ScrollView contentContainerStyle={ui.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View style={ui.hero}>
          <View style={[ui.heroShape, ui.heroShapeA]} />
          <View style={[ui.heroShape, ui.heroShapeB]} />
          <View style={[ui.heroShape, ui.heroShapeC]} />
          <Text style={ui.heroTag}>VERIFIED STUDY GUIDE</Text>
        </View>

        <Text style={[ui.articleTitle, { fontSize: 21 * fontSizeScale }]}>
          Understanding Porter's Five Forces in Modern Tech
        </Text>

        <View style={ui.bylineRow}>
          <View style={ui.avatar}>
            <Text style={ui.avatarText}>BD</Text>
          </View>
          <Text style={ui.bylineText}>8 min read · Curated by BUILD</Text>
        </View>

        <Text style={[ui.paragraph, { fontSize: 14 * fontSizeScale, lineHeight: 22 * fontSizeScale }]}>
          In today's hyper-fast technology landscape, the traditional frameworks of competitive
          strategy are more relevant than ever. Michael Porter's Five Forces provides a structured
          way to analyze the intensity of competition and the attractiveness of a market.
        </Text>

        <SectionHeading number="1" title="Threat of New Entrants" />
        <Text style={[ui.paragraph, { fontSize: 14 * fontSizeScale, lineHeight: 22 * fontSizeScale }]}>
          The ease with which new competitors can enter a market defines its long-term
          profitability. In the SaaS world, where capital requirements are lower, brand equity and
          network effects act as major barriers.
        </Text>

        <View style={ui.bulletList}>
          {BULLET_POINTS.map((point) => (
            <View key={point.id} style={ui.bulletRow}>
              <Text style={ui.bulletCheck}>✔</Text>
              <Text style={[ui.bulletText, { fontSize: 13.5 * fontSizeScale }]}>
                <Text style={ui.bulletTitle}>{point.title}</Text> {point.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={ui.quoteCard}>
          <Text style={ui.quoteText}>
            "Strategy is about making choices, trade-offs; it's about deliberately choosing to be
            different."
          </Text>
        </View>

        <SectionHeading number="2" title="Bargaining Power of Buyers" />
        <Text style={[ui.paragraph, { fontSize: 14 * fontSizeScale, lineHeight: 22 * fontSizeScale }]}>
          Customers have power when they are few in number but purchase in high volumes, or when
          switching costs to a competitor's product are low.
        </Text>

        <View style={ui.tipBox}>
          <Text style={ui.tipLabel}>💡 PRO TIP</Text>
          <Text style={ui.tipText}>
            Modern platforms reduce buyer power by creating "sticky" ecosystems where data
            portability is difficult.
          </Text>
        </View>

        <TouchableOpacity style={ui.summaryLink} activeOpacity={0.8} onPress={handleAiSummary}>
          <Text style={ui.summaryLinkText}>✦ Ask BUILD AI for a 30-sec summary</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  const ui = useThemedStyles(styles);
  return (
    <View style={ui.sectionHeadingRow}>
      <View style={ui.sectionBar} />
      <Text style={ui.sectionHeadingText}>
        {number}. {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backArrow: { fontSize: 22, color: COLORS.textPrimary, marginRight: 12, fontWeight: '700' },
  headerTitles: { flex: 1 },
  headerTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.5, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primaryTint,
  },
  headerActionIcon: { fontSize: 14, color: COLORS.primary, fontWeight: '800' },

  headerProgress: { height: 3, backgroundColor: COLORS.border },
  headerProgressFill: { height: 3, width: '45%', backgroundColor: COLORS.primary },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  hero: {
    height: 120,
    borderRadius: 16,
    backgroundColor: '#1E3A8A',
    overflow: 'hidden',
    marginBottom: 18,
    justifyContent: 'flex-end',
    padding: 14,
    position: 'relative',
  },
  heroTag: { color: '#BFDBFE', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  heroShape: { position: 'absolute', borderRadius: 12 },
  heroShapeA: { width: 90, height: 90, backgroundColor: '#2563EB', top: 10, right: 30, transform: [{ rotate: '20deg' }] },
  heroShapeB: { width: 70, height: 70, backgroundColor: '#3B82F6', top: 35, right: 80, transform: [{ rotate: '-10deg' }] },
  heroShapeC: { width: 14, height: 14, backgroundColor: '#93C5FD', top: 16, right: 10, borderRadius: 4 },

  articleTitle: { fontSize: 21, fontWeight: '800', fontFamily: Fonts.extraBold, color: COLORS.textPrimary, lineHeight: 28 },

  bylineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 18 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.primary, fontSize: 10, fontWeight: '800', fontFamily: Fonts.bold },
  bylineText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600', fontFamily: Fonts.medium },

  paragraph: { fontSize: 14, color: COLORS.textSecondary, fontFamily: Fonts.regular, lineHeight: 22, marginBottom: 10 },

  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  sectionBar: { width: 4, height: 18, backgroundColor: COLORS.primary, borderRadius: 2, marginRight: 8 },
  sectionHeadingText: { fontSize: 16, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },

  bulletList: { marginTop: 6, marginBottom: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bulletCheck: { color: COLORS.success, fontSize: 13, marginRight: 8, marginTop: 2, fontWeight: '700' },
  bulletText: { flex: 1, fontSize: 13.5, color: COLORS.textSecondary, fontFamily: Fonts.regular, lineHeight: 20 },
  bulletTitle: { fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },

  quoteCard: {
    backgroundColor: COLORS.primaryTint,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    marginVertical: 16,
  },
  quoteText: { fontSize: 13.5, fontStyle: 'italic', color: COLORS.textPrimary, fontFamily: Fonts.medium, lineHeight: 20, fontWeight: '500' },

  tipBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  tipLabel: { fontSize: 11, fontWeight: '800', fontFamily: Fonts.bold, color: '#B45309', letterSpacing: 0.5 },
  tipText: { fontSize: 13, color: '#92400E', fontFamily: Fonts.regular, marginTop: 6, lineHeight: 19, fontWeight: '500' },

  summaryLink: {
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: COLORS.primaryTint,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  summaryLinkText: { fontSize: 14, color: COLORS.primary, fontWeight: '800', fontFamily: Fonts.bold },
});
