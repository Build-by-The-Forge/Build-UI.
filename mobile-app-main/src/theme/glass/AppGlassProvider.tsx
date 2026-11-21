import React from 'react';

import { useTheme } from '@/context/ThemeContext';

import { GlassThemeProvider } from './GlassThemeProvider';

/** Connects the glass theme to the app's existing light/dark preference. */
export function AppGlassProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  return <GlassThemeProvider scheme={mode}>{children}</GlassThemeProvider>;
}
