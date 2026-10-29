import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useOnboarding } from '@/context/Onboardingcontext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function SettingsScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const rows: { title: string; detail: string; icon: IconName; route: '/(onboarding)/step-one' | '/(onboarding)/step-two' | '/(onboarding)/step-three' | '/(onboarding)/step-four' }[] = [
    { title: 'Academic profile', detail: `${data.department?.name || 'Choose department'} · ${data.academicLevel?.title || 'Choose level'}`, icon: 'school-outline', route: '/(onboarding)/step-one' },
    { title: 'My courses', detail: `${data.courses.length} selected`, icon: 'book-outline', route: '/(onboarding)/step-two' },
    { title: 'Study goals', detail: `${data.goals.length} selected`, icon: 'flag-outline', route: '/(onboarding)/step-three' },
    { title: 'Learning preferences', detail: `${data.learningStyles.length} selected`, icon: 'options-outline', route: '/(onboarding)/step-four' },
  ];

  return <SafeAreaView style={styles.page}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><TouchableOpacity onPress={() => router.back()} style={styles.back} accessibilityLabel="Back"><Ionicons name="arrow-back" size={22} color="#0F172A" /></TouchableOpacity><Text style={styles.title}>Settings</Text></View>
      <View style={styles.profileCard}>
        <View style={styles.profileIcon}><Image source={require('@/assets/images/build-logo.png')} resizeMode="contain" style={styles.logo} /></View>
        <View style={styles.profileText}><Text style={styles.profileTitle}>Your BUILD space</Text><Text style={styles.profileSubtitle}>{data.institution.name}</Text></View>
      </View>
      <Text style={styles.sectionLabel}>YOUR STUDIES</Text>
      <View style={styles.section}>{rows.map(row => <TouchableOpacity key={row.title} style={styles.row} onPress={() => router.push(row.route)} activeOpacity={0.7}>
        <View style={styles.rowIcon}><Ionicons name={row.icon} size={20} color="#2563EB" /></View>
        <View style={styles.rowText}><Text style={styles.rowTitle}>{row.title}</Text><Text style={styles.rowDetail} numberOfLines={1}>{row.detail}</Text></View>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>)}</View>
      <Text style={styles.sectionLabel}>ABOUT</Text>
      <View style={styles.section}><View style={styles.row}><View style={styles.rowIcon}><Ionicons name="information-circle-outline" size={20} color="#2563EB" /></View><View style={styles.rowText}><Text style={styles.rowTitle}>About BUILD</Text><Text style={styles.rowDetail}>A study companion for FUTA students</Text></View></View></View>
    </ScrollView>
    <DashboardBottomNav activeTab="profile" />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 130 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#EFF6FF', borderRadius: 20, padding: 18, marginBottom: 28, borderWidth: 1, borderColor: '#DBEAFE' },
  profileIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 36, height: 42 }, profileText: { flex: 1 }, profileTitle: { fontSize: 17, fontWeight: '800', color: '#1E3A8A' }, profileSubtitle: { color: '#64748B', fontSize: 12, marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, marginBottom: 26 },
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 12 },
  rowIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 }, rowTitle: { color: '#0F172A', fontSize: 14, fontWeight: '700' }, rowDetail: { color: '#64748B', fontSize: 12, marginTop: 4 },
});
