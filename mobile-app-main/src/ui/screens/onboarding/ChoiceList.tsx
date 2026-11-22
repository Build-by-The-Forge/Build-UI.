import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space, TOUCH_TARGET } from '@/theme/glass/tokens';
import { AppText, GlassInput, GlassNotice } from '@/ui/glass';

/** Same shape as the client lane's onboarding Option. */
export type Choice = { readonly id: string; readonly label: string; readonly detail?: string };

/** Lists longer than this get a filter box. */
const SEARCH_FROM = 8;

function useFilter(options: readonly Choice[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.detail?.toLowerCase().includes(q));
  }, [options, query]);
}

function Row({
  choice,
  selected,
  onPress,
  role,
}: {
  choice: Choice;
  selected: boolean;
  onPress: () => void;
  role: 'radio' | 'checkbox';
}) {
  const { colors, surface } = useGlassTheme();
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={choice.detail ? `${choice.label}, ${choice.detail}` : choice.label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? colors.accent.tint : surface.card,
          borderColor: selected ? colors.text.accent : surface.edge,
          borderTopColor: selected ? colors.text.accent : surface.highlight,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.copy}>
        <AppText variant="bodyStrong" tone={selected ? 'accent' : 'primary'}>
          {choice.label}
        </AppText>
        {choice.detail ? (
          <AppText variant="caption" tone="secondary">
            {choice.detail}
          </AppText>
        ) : null}
      </View>
      <Ionicons
        name={
          role === 'radio'
            ? selected
              ? 'radio-button-on'
              : 'radio-button-off'
            : selected
              ? 'checkbox'
              : 'square-outline'
        }
        size={24}
        color={selected ? colors.text.accent : colors.text.secondary}
      />
    </Pressable>
  );
}

type SingleProps = {
  label: string;
  options: readonly Choice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/** Single choice (school, department, programme, level). Rows never blur: safe in long lists. */
export function ChoiceList({ label, options, selectedId, onSelect }: SingleProps) {
  const [query, setQuery] = useState('');
  const shown = useFilter(options, query);
  return (
    <View style={styles.list} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.length > SEARCH_FROM ? (
        <GlassInput label={`Find a ${label.toLowerCase()}`} icon="search" value={query} onChangeText={setQuery} autoCorrect={false} />
      ) : null}
      {shown.map((o) => (
        <Row key={o.id} choice={o} role="radio" selected={o.id === selectedId} onPress={() => onSelect(o.id)} />
      ))}
      {shown.length === 0 ? <NoMatch query={query} /> : null}
    </View>
  );
}

type MultiProps = {
  label: string;
  options: readonly Choice[];
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
  /** The contract's limit (MAX_PROFILE_COURSES); the count and the limit notice use it. */
  max: number;
  /** Set by the route when a toggle was refused at the limit. */
  limitHit?: boolean;
};

/** Multi choice (courses), with a live count and a limit message. */
export function MultiChoiceList({ label, options, selectedIds, onToggle, max, limitHit }: MultiProps) {
  const [query, setQuery] = useState('');
  const shown = useFilter(options, query);
  return (
    <View style={styles.list} accessibilityLabel={label}>
      <AppText variant="label" tone="accent" accessibilityLiveRegion="polite">
        {selectedIds.length} of {max} selected
      </AppText>
      {limitHit ? (
        <GlassNotice tone="warning" message={`You can choose up to ${max}. Remove one to add another.`} />
      ) : null}
      {options.length > SEARCH_FROM ? (
        <GlassInput label={`Find a ${label.toLowerCase()}`} icon="search" value={query} onChangeText={setQuery} autoCorrect={false} />
      ) : null}
      {shown.map((o) => (
        <Row key={o.id} choice={o} role="checkbox" selected={selectedIds.includes(o.id)} onPress={() => onToggle(o.id)} />
      ))}
      {shown.length === 0 ? <NoMatch query={query} /> : null}
    </View>
  );
}

function NoMatch({ query }: { query: string }) {
  return (
    <AppText tone="secondary" align="center" style={styles.noMatch}>
      {query ? `Nothing matches "${query}".` : 'Nothing to choose from yet.'}
    </AppText>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
  row: {
    minHeight: TOUCH_TARGET + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  copy: { flex: 1, gap: 2 },
  noMatch: { paddingVertical: space.lg },
});
