import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

type Mode = 'light' | 'dark';
const storageKey = 'build-color-mode';
const modeSchema = z.string().regex(/^(light|dark)$/);
const ThemeContext = createContext<{ mode: Mode; setMode: (mode: Mode) => void; ready: boolean; error: string }>({ mode: 'light', setMode: () => {}, ready: true, error: '' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(Platform.OS === 'web');
  const [error, setError] = useState('');
  const [mode, setModeState] = useState<Mode>(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return 'light';
    try {
      const saved = window.localStorage.getItem(storageKey);
      return modeSchema.safeParse(saved).success ? saved as Mode : 'light';
    } catch { return 'light'; }
  });
  useEffect(() => {
    if (Platform.OS === 'web') return;
    AsyncStorage.getItem(storageKey).then(saved => {
      if (modeSchema.safeParse(saved).success) setModeState(saved as Mode);
    }).catch(() => setError('Could not load your appearance preference.')).finally(() => setReady(true));
  }, []);
  const setMode = (next: Mode) => {
    if (!modeSchema.safeParse(next).success) { setError('Invalid appearance choice.'); return; }
    setError('');
    setModeState(next);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try { window.localStorage.setItem(storageKey, next); } catch { setError('Appearance changed, but could not be saved.'); }
    } else AsyncStorage.setItem(storageKey, next).catch(() => setError('Appearance changed, but could not be saved.'));
  };
  return <ThemeContext.Provider value={{ mode, setMode, ready, error }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
