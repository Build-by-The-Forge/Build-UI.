import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const AMENITIES = [
  { icon: '⚡', label: 'Power Outlets' },
  { icon: '📶', label: 'Campus Wi-Fi' },
  { icon: '❄️', label: 'Air Conditioned' },
  { icon: '🪑', label: 'Quiet Zone' },
];

export default function PlaceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; status?: string; distance?: string }>();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const placeName = params.name || 'ETF Lecture Theater';
  const placeStatus = params.status || 'Always Opened';
  const placeDistance = params.distance || '5 mins away · 300 m';

  const handleCheckIn = () => {
    setIsCheckedIn((prev) => !prev);
    Alert.alert(
      isCheckedIn ? 'Checked Out' : 'Checked In!',
      isCheckedIn
        ? 'You have checked out of this location.'
        : `You are now marked active at ${placeName}. Your study group can see you here!`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.photoWrap}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderIcon}>🏛️</Text>
            <Text style={styles.photoPlaceholderText}>{placeName}</Text>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.placeName}>{placeName}</Text>
          <View style={styles.statusTag}>
            <Text style={styles.statusTagText}>{placeStatus}</Text>
          </View>
          <Text style={styles.distanceText}>{placeDistance}</Text>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryAction, isCheckedIn && styles.checkedInAction]}
              activeOpacity={0.85}
              onPress={handleCheckIn}
            >
              <Text style={styles.primaryActionText}>
                {isCheckedIn ? '✓ Checked In' : 'Check In Here'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              activeOpacity={0.85}
              onPress={() => router.push('/dashboard/studygroup')}
            >
              <Text style={styles.secondaryActionText}>Find Groups</Text>
            </TouchableOpacity>
          </View>

          {/* Amenities */}
          <Text style={styles.sectionHeader}>LOCATION AMENITIES</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES.map((item, idx) => (
              <View key={idx} style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>{item.icon}</Text>
                <Text style={styles.amenityLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <DashboardBottomNav activeTab="map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 130 },

  photoWrap: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 240,
    position: 'relative',
    backgroundColor: '#DBEAFE',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  photoPlaceholderIcon: { fontSize: 56, marginBottom: 8 },
  photoPlaceholderText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: { fontSize: 18, color: COLORS.textPrimary, fontWeight: '700' },

  infoBlock: { paddingHorizontal: 20 },
  placeName: { fontSize: 20, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  statusTag: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusTagText: { fontSize: 11, color: '#15803D', fontWeight: '800', fontFamily: Fonts.bold },
  distanceText: { fontSize: 13, color: COLORS.textMuted, marginTop: 8, fontWeight: '500', fontFamily: Fonts.medium },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  primaryAction: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedInAction: { backgroundColor: '#15803D' },
  primaryActionText: { color: '#fff', fontSize: 14, fontWeight: '800', fontFamily: Fonts.bold },
  secondaryAction: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', fontFamily: Fonts.bold },

  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Fonts.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 12,
  },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityIcon: { fontSize: 16, marginRight: 8 },
  amenityLabel: { fontSize: 12.5, fontWeight: '600', fontFamily: Fonts.medium, color: COLORS.textPrimary },
});