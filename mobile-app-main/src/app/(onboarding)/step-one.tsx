import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProgressHeader from '@/components/ProgressHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useOnboarding, AcademicLevel } from '@/context/Onboardingcontext';
import { getSchools } from '@/data/institutionData';
import { School, Department } from '@/types/academic';
import colors from '@/theme/colors';

const LEVELS: AcademicLevel[] = [
  { id: '100', title: '100 Level', subtitle: 'First Year', icon: '🌱', iconBg: '#DCFCE7' },
  { id: '200', title: '200 Level', subtitle: 'Second Year', icon: '📘', iconBg: '#DBEAFE' },
  { id: '300', title: '300 Level', subtitle: 'Third Year', icon: '📗', iconBg: '#DCFCE7' },
  { id: '400', title: '400 Level', subtitle: 'Fourth Year', icon: '🎓', iconBg: '#FEF3C7' },
  { id: '500', title: '500 Level', subtitle: 'Fifth Year', icon: '🧪', iconBg: '#FEE2E2' },
  { id: 'postgrad', title: 'Postgraduate', subtitle: 'Masters / PhD', icon: '🎩', iconBg: '#EDE9FE' },
];

export default function Step1AcademicLevel() {
  const router = useRouter();
  const { data, setSchool, setDepartment, setAcademicLevel } = useOnboarding();

  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    data.academicLevel?.id || '300'
  );

  const [showPickerModal, setShowPickerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolCode, setSelectedSchoolCode] = useState<string>(
    data.school?.code || 'SOC'
  );

  const schools = getSchools();
  const currentSchool = schools.find((s) => s.code === selectedSchoolCode) || schools[0];

  const handleSelectDept = (school: School, dept: Department) => {
    setSchool(school.code);
    setDepartment(dept.code);
    setShowPickerModal(false);
  };

  const handleContinue = () => {
    const level = LEVELS.find((l) => l.id === selectedLevelId) || null;
    setAcademicLevel(level);
    router.push('/(onboarding)/step-two');
  };

  // Filtered departments for search in modal
  const filteredSchools = schools
    .map((school) => {
      const filteredDepts = school.departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          school.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...school, departments: filteredDepts };
    })
    .filter((school) => school.departments.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader step={1} total={5} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Institution Badge */}
        <View style={styles.institutionBadge}>
          <Text style={styles.institutionIcon}>🏛️</Text>
          <Text style={styles.institutionText}>{data.institution.name} ({data.institution.shortName})</Text>
        </View>

        {/* Academic Level Section */}
        <Text style={styles.title}>What's your academic level?</Text>
        <Text style={styles.subtitle}>
          This helps us match your courses and difficulty
        </Text>

        <View style={styles.grid}>
          {LEVELS.map((level) => {
            const isSelected = selectedLevelId === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedLevelId(level.id)}
              >
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkBadgeText}>✓</Text>
                  </View>
                )}
                <View style={[styles.iconWrap, { backgroundColor: level.iconBg }]}>
                  <Text style={styles.iconText}>{level.icon}</Text>
                </View>
                <Text style={styles.cardTitle}>{level.title}</Text>
                <Text style={styles.cardSubtitle}>{level.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* School & Department Selector Section */}
        <View style={styles.deptSection}>
          <Text style={styles.sectionTitle}>Your School & Department</Text>
          <Text style={styles.sectionSubtitle}>
            Tailors the curriculum to your exact degree program
          </Text>

          <TouchableOpacity
            style={styles.deptSelectorBox}
            activeOpacity={0.85}
            onPress={() => setShowPickerModal(true)}
          >
            <View style={styles.deptSelectorLeft}>
              <View style={styles.deptIconBadge}>
                <Ionicons name="school" size={20} color="#2563EB" />
              </View>
              <View style={styles.deptTextWrapper}>
                <Text style={styles.deptSchoolText}>
                  {data.school?.name || 'School of Computing (SOC)'}
                </Text>
                <Text style={styles.deptNameText}>
                  {data.department
                    ? `${data.department.name} (${data.department.code})`
                    : 'Select Department'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} />
      </View>

      {/* School & Department Modal Picker */}
      <Modal
        visible={showPickerModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Department</Text>
            <TouchableOpacity
              onPress={() => setShowPickerModal(false)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search department or course code..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* School Horizontal Filter Tabs (when not searching) */}
          {!searchQuery && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.schoolTabsScroll}
            >
              {schools.map((school) => {
                const isActive = selectedSchoolCode === school.code;
                return (
                  <TouchableOpacity
                    key={school.code}
                    style={[styles.schoolTab, isActive && styles.schoolTabActive]}
                    onPress={() => setSelectedSchoolCode(school.code)}
                  >
                    <Text
                      style={[styles.schoolTabText, isActive && styles.schoolTabTextActive]}
                    >
                      {school.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Department List */}
          <ScrollView contentContainerStyle={styles.deptListScroll}>
            {searchQuery ? (
              // Search Results across all schools
              filteredSchools.map((school) => (
                <View key={school.code} style={styles.schoolSection}>
                  <Text style={styles.schoolSectionHeader}>{school.name} ({school.code})</Text>
                  {school.departments.map((dept) => {
                    const isSelected = data.department?.code === dept.code;
                    return (
                      <TouchableOpacity
                        key={dept.code}
                        style={[styles.deptItem, isSelected && styles.deptItemSelected]}
                        onPress={() => handleSelectDept(school, dept)}
                      >
                        <View>
                          <Text style={[styles.deptItemName, isSelected && styles.deptItemNameSelected]}>
                            {dept.name}
                          </Text>
                          <Text style={styles.deptItemCode}>{dept.code} · {school.code}</Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            ) : (
              // Filtered by selected school tab
              <View style={styles.schoolSection}>
                <Text style={styles.schoolSectionHeader}>
                  {currentSchool.name} ({currentSchool.code})
                </Text>
                {currentSchool.departments.map((dept) => {
                  const isSelected = data.department?.code === dept.code;
                  return (
                    <TouchableOpacity
                      key={dept.code}
                      style={[styles.deptItem, isSelected && styles.deptItemSelected]}
                      onPress={() => handleSelectDept(currentSchool, dept)}
                    >
                      <View>
                        <Text style={[styles.deptItemName, isSelected && styles.deptItemNameSelected]}>
                          {dept.name}
                        </Text>
                        <Text style={styles.deptItemCode}>{dept.code} · {currentSchool.name}</Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  institutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  institutionIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  institutionText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
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
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 20,
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
  deptSection: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  deptSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
  },
  deptSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  deptIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deptTextWrapper: {
    flex: 1,
  },
  deptSchoolText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  deptNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  schoolTabsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  schoolTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  schoolTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  schoolTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  schoolTabTextActive: {
    color: '#FFFFFF',
  },
  deptListScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  schoolSection: {
    marginBottom: 16,
  },
  schoolSectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  deptItemSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  deptItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptItemNameSelected: {
    color: '#1D4ED8',
  },
  deptItemCode: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});