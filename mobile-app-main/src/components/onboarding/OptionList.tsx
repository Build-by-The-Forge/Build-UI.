import { Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '@/theme/colors';

export type Option = { readonly id: string; readonly label: string; readonly detail?: string };

type Props = {
  readonly options: readonly Option[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
};

/** A single-choice list. Selection is shown by state and a check, not colour alone. */
export function OptionList({ options, selectedId, onSelect }: Props) {
  return (
    <View style={styles.list}>
      {options.map((option) => {
        const selected = option.id === selectedId;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.detail ? `${option.label}, ${option.detail}` : option.label}
            style={[styles.row, selected && styles.rowSelected]}
          >
            <View style={styles.copy}>
              <Text style={styles.label}>{option.label}</Text>
              {option.detail ? <Text style={styles.detail}>{option.detail}</Text> : null}
            </View>
            {selected ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
  },
  rowSelected: { borderColor: colors.primaryBorder, backgroundColor: colors.primaryTint },
  copy: { flex: 1 },
  label: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  detail: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  check: { color: colors.primary, fontSize: 16, fontWeight: '800' },
});
