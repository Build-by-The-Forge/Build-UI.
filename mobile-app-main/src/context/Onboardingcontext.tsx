import React, { createContext, useContext, useState } from 'react';
import { Institution, School, Department, AcademicCourse } from '@/types/academic';
import {
  FUTA_INSTITUTION,
  getSchools,
  getSchoolByCode,
  getDepartmentByCode,
  getCoursesForDepartment,
} from '@/data/institutionData';

export interface AcademicLevel {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  iconBg?: string;
}

export interface OnboardingData {
  institution: Institution;
  school: School | null;
  department: Department | null;
  faculty: string; // legacy string representation
  academicLevel: AcademicLevel | null;
  courses: string[];
  selectedCourseDetails: AcademicCourse[];
  goals: string[];
  learningStyles: string[];
}

export interface OnboardingContextType {
  data: OnboardingData;
  updateData: (patch: Partial<OnboardingData>) => void;
  setSchool: (schoolCode: string) => void;
  setDepartment: (deptCode: string) => void;
  setAcademicLevel: (level: AcademicLevel | null) => void;
  setCourses: (courseIds: string[]) => void;
  getAvailableCourses: () => AcademicCourse[];
  resetOnboarding: () => void;
}

const defaultSchool = FUTA_INSTITUTION.schools[0]; // School of Computing
const defaultDept = defaultSchool.departments[0]; // Computer Science

const initialState: OnboardingData = {
  institution: FUTA_INSTITUTION,
  school: defaultSchool,
  department: defaultDept,
  faculty: defaultSchool.name,
  academicLevel: {
    id: '300',
    title: '300 Level',
    subtitle: 'Third Year',
    icon: '📗',
    iconBg: '#DCFCE7',
  },
  courses: ['CSC301', 'CSC303', 'CSC305'],
  selectedCourseDetails: [],
  goals: ['exams', 'topics', 'grades', 'organize'],
  learningStyles: ['reading', 'videos', 'ai', 'flashcards'],
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: initialState,
  updateData: () => {},
  setSchool: () => {},
  setDepartment: () => {},
  setAcademicLevel: () => {},
  setCourses: () => {},
  getAvailableCourses: () => [],
  resetOnboarding: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialState);

  const updateData = (patch: Partial<OnboardingData>) => {
    setData((prev) => {
      const updated = { ...prev, ...patch };
      // Keep legacy faculty string in sync with school name if school changed
      if (patch.school && patch.school.name) {
        updated.faculty = patch.school.name;
      }
      return updated;
    });
  };

  const setSchool = (schoolCode: string) => {
    const school = getSchoolByCode(schoolCode);
    if (school) {
      const firstDept = school.departments[0] || null;
      setData((prev) => ({
        ...prev,
        school,
        faculty: school.name,
        department: firstDept,
        courses: [],
        selectedCourseDetails: [],
      }));
    }
  };

  const setDepartment = (deptCode: string) => {
    const found = getDepartmentByCode(deptCode);
    if (found) {
      setData((prev) => ({
        ...prev,
        school: found.school,
        faculty: found.school.name,
        department: found.department,
        courses: [],
        selectedCourseDetails: [],
      }));
    }
  };

  const setAcademicLevel = (level: AcademicLevel | null) => {
    setData((prev) => ({
      ...prev,
      academicLevel: level,
    }));
  };

  const getAvailableCourses = (): AcademicCourse[] => {
    const deptCode = data.department?.code || 'CSC';
    const levelId = data.academicLevel?.id || '300';
    return getCoursesForDepartment(deptCode, levelId);
  };

  const setCourses = (courseIds: string[]) => {
    const available = getAvailableCourses();
    const details = available.filter((c) => courseIds.includes(c.id));
    setData((prev) => ({
      ...prev,
      courses: courseIds,
      selectedCourseDetails: details,
    }));
  };

  const resetOnboarding = () => {
    setData(initialState);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        setSchool,
        setDepartment,
        setAcademicLevel,
        setCourses,
        getAvailableCourses,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return ctx;
}