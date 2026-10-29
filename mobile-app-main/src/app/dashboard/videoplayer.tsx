import React, { useState } from 'react';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { Fonts } from '@/constants/theme';
import { VideoLecture } from '@/types/dashboard';

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

const UP_NEXT = [
  { id: '1', number: '01', title: 'Course Introduction & Syllabus Overview', duration: '08:15', status: 'Completed', statusColor: '#16A34A', current: false, thumbBg: '#059669' },
  { id: '2', number: '02', title: 'Core Principles of Engineering Analysis', duration: '14:30', status: 'Completed', statusColor: '#16A34A', current: false, thumbBg: '#0F766E' },
  { id: '3', number: '03', title: 'Fundamentals of Strategic Planning', duration: '12:45', status: 'Playing Now', statusColor: COLORS.primary, current: true, thumbBg: '#1D4ED8' },
  { id: '4', number: '04', title: 'Resource Allocation & Modeling', duration: '08:20', status: 'Up Next', statusColor: COLORS.textMuted, current: false, thumbBg: '#1E293B' },
  { id: '5', number: '05', title: 'Team Dynamics & System Integration', duration: '15:10', status: 'Video', statusColor: COLORS.textMuted, current: false, thumbBg: '#475569' },
  { id: '6', number: '06', title: 'Final Project Assessment Briefing', duration: '10:00', status: 'Locked', statusColor: COLORS.textMuted, current: false, locked: true, thumbBg: '#94A3B8' },
];

export default function VideoPlayerScreen() {
  const ui = useThemedStyles(styles);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState('3');
  const [likesCount, setLikesCount] = useState(482);
  const [hasLiked, setHasLiked] = useState(false);

  const activeVideo = UP_NEXT.find((v) => v.id === currentVideoId) || UP_NEXT[2];

  const toggleLike = () => {
    setHasLiked((prev) => !prev);
    setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));
  };

  const handleDownload = () => {
    Alert.alert('Download Offline', 'This lecture has been cached for offline viewing.');
  };

  return (
    <SafeAreaView style={ui.safeArea}>
      <ScrollView contentContainerStyle={ui.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Video Player Display */}
        <View style={ui.videoArea}>
          <View style={ui.videoTopRow}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
              <Text style={ui.videoTopIcon}>‹</Text>
            </TouchableOpacity>
            <View style={ui.videoTopRight}>
              <View style={ui.ccBadge}>
                <Text style={ui.ccBadgeText}>CC</Text>
              </View>
              <Text style={[ui.videoTopIcon, { marginLeft: 12 }]}>⚙</Text>
            </View>
          </View>

          <View style={ui.videoControlsRow}>
            <TouchableOpacity
              onPress={() => {
                const idx = UP_NEXT.findIndex((v) => v.id === currentVideoId);
                if (idx > 0) setCurrentVideoId(UP_NEXT[idx - 1].id);
              }}
            >
              <Text style={ui.controlIcon}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ui.playButton}
              onPress={() => setIsPlaying((p) => !p)}
              activeOpacity={0.8}
            >
              <Text style={ui.playButtonIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const idx = UP_NEXT.findIndex((v) => v.id === currentVideoId);
                if (idx < UP_NEXT.length - 1 && !UP_NEXT[idx + 1].locked) {
                  setCurrentVideoId(UP_NEXT[idx + 1].id);
                }
              }}
            >
              <Text style={ui.controlIcon}>⏭</Text>
            </TouchableOpacity>
          </View>

          <View style={ui.videoBottomRow}>
            <Text style={ui.videoTime}>{isPlaying ? '06:15' : '04:12'} / {activeVideo.duration}</Text>
            <Text style={ui.videoQuality}>1080p HD</Text>
          </View>
          <View style={ui.videoProgressTrack}>
            <View style={[ui.videoProgressFill, { width: isPlaying ? '52%' : '34%' }]} />
          </View>
        </View>

        {/* Video Meta Info */}
        <View style={ui.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={ui.videoTitle}>
              {activeVideo.number}. {activeVideo.title}
            </Text>
            <Text style={ui.videoSubtitle}>Module 2: Advanced Leadership Mastery</Text>
          </View>
          <TouchableOpacity
            style={ui.shareButton}
            onPress={() => router.push('/dashboard/chatscreen')}
          >
            <Text style={ui.shareIcon}>💬</Text>
          </TouchableOpacity>
        </View>

        <View style={ui.statsRow}>
          <Text style={ui.statText}>👁 1.2k views</Text>
          <TouchableOpacity onPress={toggleLike}>
            <Text style={[ui.statText, hasLiked && { color: COLORS.primary, fontWeight: '700' }]}>
              👍 {likesCount} likes
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={ui.downloadButton} onPress={handleDownload}>
            <Text style={ui.downloadText}>⬇ Download</Text>
          </TouchableOpacity>
        </View>

        {/* Up Next List */}
        <View style={ui.upNextHeaderRow}>
          <Text style={ui.sectionHeading}>Course Playlist</Text>
          <View style={ui.autoplayRow}>
            <Text style={ui.autoplayLabel}>AUTOPLAY</Text>
            <Switch
              value={autoplay}
              onValueChange={setAutoplay}
              trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={ui.upNextList}>
          {UP_NEXT.map((item) => {
            const isCurrent = item.id === currentVideoId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[ui.upNextRow, isCurrent && ui.upNextRowActive]}
                activeOpacity={item.locked ? 1 : 0.8}
                disabled={item.locked}
                onPress={() => {
                  setCurrentVideoId(item.id);
                  setIsPlaying(true);
                }}
              >
                {isCurrent && <View style={ui.upNextActiveBar} />}
                <View style={[ui.thumb, { backgroundColor: item.thumbBg }]}>
                  {isCurrent && <Text style={ui.thumbIcon}>🔊</Text>}
                  {item.locked && <Text style={ui.thumbIcon}>🔒</Text>}
                  {!isCurrent && !item.locked && (
                    <Text style={ui.thumbDuration}>{item.duration}</Text>
                  )}
                </View>
                <View style={ui.upNextTextWrap}>
                  <Text
                    style={[ui.upNextTitle, isCurrent && { color: COLORS.primary, fontWeight: '800' }]}
                    numberOfLines={1}
                  >
                    {item.number}. {item.title}
                  </Text>
                  <Text style={[ui.upNextStatus, { color: isCurrent ? COLORS.primary : item.statusColor }]}>
                    {item.duration ? `${item.duration} · ` : ''}
                    {isCurrent ? 'Playing Now' : item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <DashboardBottomNav activeTab="study" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 130 },

  videoArea: { backgroundColor: '#0B0F19', height: 230, justifyContent: 'space-between', padding: 14 },
  videoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  videoTopIcon: { color: '#fff', fontSize: 24, fontWeight: '700' },
  videoTopRight: { flexDirection: 'row', alignItems: 'center' },
  ccBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  ccBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  videoControlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
  controlIcon: { color: '#fff', fontSize: 22 },
  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  playButtonIcon: { color: '#fff', fontSize: 22 },

  videoBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  videoTime: { color: '#fff', fontSize: 11, fontWeight: '600' },
  videoQuality: { color: '#60A5FA', fontSize: 11, fontWeight: '800' },
  videoProgressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, marginTop: 4 },
  videoProgressFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  videoTitle: { fontSize: 16, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  videoSubtitle: { fontSize: 12.5, color: COLORS.textMuted, marginTop: 4, fontFamily: Fonts.medium, fontWeight: '500' },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  shareIcon: { fontSize: 16, color: COLORS.primary },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, marginTop: 14 },
  statText: { fontSize: 12.5, color: COLORS.textSecondary, fontFamily: Fonts.medium, fontWeight: '600' },
  downloadButton: { flexDirection: 'row', alignItems: 'center' },
  downloadText: { color: COLORS.primary, fontSize: 13, fontWeight: '800', fontFamily: Fonts.bold },

  upNextHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeading: { fontSize: 15, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  autoplayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  autoplayLabel: { fontSize: 10, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textMuted },

  upNextList: { paddingHorizontal: 20, marginTop: 12 },
  upNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  upNextRowActive: { backgroundColor: '#EFF6FF' },
  upNextActiveBar: { width: 3.5, height: 44, backgroundColor: COLORS.primary, borderRadius: 2, marginRight: 8 },
  thumb: {
    width: 68,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbIcon: { fontSize: 16 },
  thumbDuration: { color: '#fff', fontSize: 10, fontWeight: '800', fontFamily: Fonts.bold },
  upNextTextWrap: { flex: 1 },
  upNextTitle: { fontSize: 13.5, fontWeight: '700', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  upNextStatus: { fontSize: 11.5, marginTop: 3, fontFamily: Fonts.medium, fontWeight: '500' },
});
