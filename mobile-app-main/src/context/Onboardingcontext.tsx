import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { AcademicProfile } from '@/api/types';
import { onSignedOut } from '@/auth';

export type NamedRef = { readonly id: string; readonly name: string };
export type ProgrammeRef = NamedRef & { readonly code: string; readonly durationYears: number | null };

/**
 * What the student is choosing while the onboarding screens are open. It is a
 * draft: nothing here is true until putAcademicProfile accepts it, and the
 * backend's profile (see features/academic) is what the rest of the app reads.
 * Goals and learning styles have no field in the contract, so they stay on
 * this device and in memory only.
 */
export type OnboardingData = {
  faculty: NamedRef | null;
  department: NamedRef | null;
  programme: ProgrammeRef | null;
  level: number | null;
  courseIds: string[];
  goals: string[];
  learningStyles: string[];
};

export type OnboardingContextType = {
  data: OnboardingData;
  updateData: (patch: Partial<OnboardingData>) => void;
  /** Choosing a different programme drops the level and courses chosen for the old one. */
  setProgramme: (faculty: NamedRef, department: NamedRef, programme: ProgrammeRef) => void;
  setLevel: (level: number) => void;
  setCourseIds: (ids: string[]) => void;
  /** Starts the draft from what the backend already holds, so editing begins there. */
  loadFromProfile: (profile: AcademicProfile) => void;
  resetOnboarding: () => void;
};

const initialState: OnboardingData = {
  faculty: null,
  department: null,
  programme: null,
  level: null,
  courseIds: [],
  goals: [],
  learningStyles: [],
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialState);

  // Nothing chosen by one student may be visible to the next on this device.
  useEffect(() => onSignedOut(() => setData(initialState)), []);

  const updateData = useCallback((patch: Partial<OnboardingData>) => setData((prev) => ({ ...prev, ...patch })), []);

  const setProgramme = useCallback((faculty: NamedRef, department: NamedRef, programme: ProgrammeRef) => {
    setData((prev) =>
      prev.programme?.id === programme.id
        ? prev
        : { ...prev, faculty, department, programme, level: null, courseIds: [] },
    );
  }, []);

  const setLevel = useCallback((level: number) => setData((prev) => ({ ...prev, level })), []);
  const setCourseIds = useCallback((courseIds: string[]) => setData((prev) => ({ ...prev, courseIds })), []);

  const loadFromProfile = useCallback((profile: AcademicProfile) => {
    setData((prev) => ({
      ...prev,
      faculty: profile.faculty,
      department: profile.department,
      programme: profile.programme
        ? { id: profile.programme.id, name: profile.programme.name, code: profile.programme.code, durationYears: null }
        : null,
      level: profile.level,
      courseIds: profile.courses.map((c) => c.id),
    }));
  }, []);

  const resetOnboarding = useCallback(() => setData(initialState), []);

  const value = useMemo(
    () => ({ data, updateData, setProgramme, setLevel, setCourseIds, loadFromProfile, resetOnboarding }),
    [data, updateData, setProgramme, setLevel, setCourseIds, loadFromProfile, resetOnboarding],
  );
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextType {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return ctx;
}
