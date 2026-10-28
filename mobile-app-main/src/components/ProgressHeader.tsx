import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';

interface ProgressHeaderProps {
  step: number;
  total: number;
  onBack: () => void;
}

export default function ProgressHeader({ step, total, onBack }: ProgressHeaderProps) {
  const segments = Array.from({ length: total }, (_, i) => i < step);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          {segments.map((filled, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                { backgroundColor: filled ? colors.progressFill : colors.progressTrack },
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepLabel}>
          Step {step} of {total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
});