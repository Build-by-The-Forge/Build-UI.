import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Fonts } from '@/constants/theme';
import { StudyGroup } from '@/types/dashboard';

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

const GROUPS = [
  {
    id: 'quantum',
    name: 'Quantum Physics Prep',
    tag: 'ACTIVE',
    tagBg: '#DCFCE7',
    tagColor: '#15803D',
    members: '1.2k members',
    preview: 'Sarah: "Just uploaded the week 4 summary notes for everyone!"',
    extraAvatars: 8,
    thumbBg: '#0D9488',
  },
  {
    id: 'python',
    name: 'Python Masters',
    tag: 'LEVEL 4',
    tagBg: '#DBEAFE',
    tagColor: '#1D4ED8',
    members: '856 members',
    preview: 'Mike: "Who\'s up for a coding challenge tonight at 8 PM?"',
    extraAvatars: 12,
    thumbBg: '#2563EB',
  },
  {
    id: 'history',
    name: 'Engineering Maths Study Circle',
    tag: 'TRENDING',
    tagBg: '#FFEDD5',
    tagColor: '#C2410C',
    members: '420 members',
    preview: 'Jason: "Check out the past questions compilation from last year."',
    extraAvatars: 3,
    thumbBg: '#F59E0B',
  },
];

export default function StudyGroupsScreen() {
  const ui = useThemedStyles(styles);
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredGroups = GROUPS.filter(
    (g) =>
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.preview.toLowerCase().includes(query.toLowerCase())
  );

  const handleJoinGroup = (group: (typeof GROUPS)[0]) => {
    router.push({
      pathname: '/dashboard/chatscreen',
      params: { name: group.name },
    });
  };

  const handleCreateGroup = () => {
    Alert.prompt
      ? Alert.prompt('Create Study Group', 'Enter group name:', (name) => {
          if (name) {
            Alert.alert('Group Created!', `"${name}" study group has been created.`);
          }
        })
      : Alert.alert('Create Study Group', 'Group creation is ready. Connect with classmates!');
  };

  return (
    <SafeAreaView style={ui.safeArea}>
      <ScrollView contentContainerStyle={ui.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={ui.headerRow}>
          <View>
            <Text style={ui.title}>Study Groups</Text>
            <Text style={ui.subtitle}>Connect and learn together</Text>
          </View>
          <TouchableOpacity
            style={ui.addButton}
            onPress={handleCreateGroup}
            activeOpacity={0.8}
          >
            <Text style={ui.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={ui.searchRow}>
          <Ionicons name="search-outline" size={19} color={COLORS.textMuted} style={ui.searchIcon} />
          <TextInput
            style={ui.searchInput}
            placeholder="Find a study group..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          <Ionicons name="options-outline" size={20} color={COLORS.textSecondary} />
        </View>

        {filteredGroups.length === 0 ? (
          <View style={ui.emptyState}>
            <Ionicons name="search-outline" size={36} color={COLORS.textMuted} style={ui.emptyIcon} />
            <Text style={ui.emptyTitle}>No study groups found</Text>
            <Text style={ui.emptySubtitle}>Try searching for a different course or create a new group.</Text>
          </View>
        ) : (
          filteredGroups.map((group) => (
            <View key={group.id} style={ui.card}>
              <View style={ui.cardTopRow}>
                <View style={[ui.thumb, { backgroundColor: group.thumbBg }]}>
                  <Ionicons name="people" size={24} color="#FFFFFF" />
                </View>
                <View style={ui.cardTitleWrap}>
                  <View style={ui.cardTitleRow}>
                    <Text style={ui.cardTitle}>{group.name}</Text>
                    <View style={[ui.tag, { backgroundColor: group.tagBg }]}>
                      <Text style={[ui.tagText, { color: group.tagColor }]}>{group.tag}</Text>
                    </View>
                  </View>
                  <View style={ui.membersRow}><Ionicons name="people-outline" size={13} color={COLORS.textMuted} /><Text style={ui.membersText}>{group.members}</Text></View>
                </View>
              </View>

              <View style={ui.previewBox}>
                <Text style={ui.previewText}>{group.preview}</Text>
              </View>

              <View style={ui.cardBottomRow}>
                <View style={ui.avatarStack}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={[ui.avatarCircle, { marginLeft: i === 0 ? 0 : -10, backgroundColor: ['#38BDF8', '#A78BFA', '#FB7185'][i] }]} />
                  ))}
                  <View style={[ui.avatarCircle, ui.avatarExtra, { marginLeft: -10 }]}>
                    <Text style={ui.avatarExtraText}>+{group.extraAvatars}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={ui.joinButton}
                  activeOpacity={0.85}
                  onPress={() => handleJoinGroup(group)}
                >
                  <Text style={ui.joinButtonText}>Open Group Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <DashboardBottomNav activeTab="groups" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 130 },

  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '800', fontFamily: Fonts.extraBold, color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, fontFamily: Fonts.medium, fontWeight: '500' },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: COLORS.primary, fontSize: 20, fontWeight: '800', fontFamily: Fonts.bold, lineHeight: 22 },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 14, marginRight: 8, color: COLORS.textMuted },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.textPrimary, padding: 0, fontFamily: Fonts.regular, fontWeight: '500' },
  filterIcon: { fontSize: 14, color: COLORS.primary, marginLeft: 8 },

  card: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    backgroundColor: COLORS.background,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: { fontSize: 20 },
  cardTitleWrap: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary, flexShrink: 1, marginRight: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: '800', fontFamily: Fonts.bold },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  membersText: { fontSize: 12, color: COLORS.textMuted, fontFamily: Fonts.medium, fontWeight: '600' },

  previewBox: { backgroundColor: COLORS.surface, borderRadius: 10, padding: 10, marginTop: 12 },
  previewText: { fontSize: 12, color: COLORS.textSecondary, fontFamily: Fonts.regular, fontStyle: 'italic', lineHeight: 18 },

  cardBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D1D5DB',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarExtra: { backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  avatarExtraText: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '800', fontFamily: Fonts.bold },

  joinButton: { backgroundColor: COLORS.primary, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 9 },
  joinButtonText: { color: '#fff', fontSize: 12.5, fontWeight: '800', fontFamily: Fonts.bold },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, fontFamily: Fonts.regular, textAlign: 'center', marginTop: 6 },
});
