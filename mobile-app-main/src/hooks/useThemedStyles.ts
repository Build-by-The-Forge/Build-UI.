import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

function rgb(value: unknown): number[] | null {
  if (typeof value !== 'string' || !/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value)) return null;
  const hex = value.length === 4 ? value.slice(1).split('').map(c => c + c).join('') : value.slice(1);
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
}

function darkColor(key: string, value: unknown) {
  const channels = rgb(value);
  if (!channels) return value;
  const [r, g, b] = channels;
  const brightness = (r + g + b) / 3;
  const neutral = Math.max(r, g, b) - Math.min(r, g, b) < 48;
  if (key === 'backgroundColor') {
    if (brightness > 225) return '#172235';
    if (brightness > 190) return '#223149';
  }
  if (key === 'borderColor' && brightness > 175) return '#334155';
  if (key === 'color' && neutral) {
    if (brightness < 110) return '#F8FAFC';
    if (brightness < 190) return '#A5B4C8';
  }
  return value;
}

export function useThemedStyles<T extends Record<string, any>>(styles: T): T {
  const { mode } = useTheme();
  return useMemo(() => {
    if (mode === 'light') return styles;
    return Object.fromEntries(Object.entries(styles).map(([name, style]) => {
      const flat = StyleSheet.flatten(style) || {};
      return [name, Object.fromEntries(Object.entries(flat).map(([key, value]) => [key, darkColor(key, value)]))];
    })) as T;
  }, [mode, styles]);
}
