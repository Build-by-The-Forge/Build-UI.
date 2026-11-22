import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ApiError } from '@/api/errors';
import colors from '@/theme/colors';

type Props = {
  readonly status: 'loading' | 'ready' | 'error';
  readonly error: ApiError | null;
  readonly onRetry: () => void;
  /** Shown when the load worked but returned nothing. */
  readonly empty?: string;
  readonly isEmpty?: boolean;
  readonly children: React.ReactNode;
};

/** Loading, failure with a retry, empty, or the content: never a silent blank. */
export function LoadBoundary({ status, error, onRetry, empty, isEmpty, children }: Props) {
  if (status === 'loading') {
    return (
      <View style={styles.box} accessibilityLabel="Loading">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (status === 'error') {
    return (
      <View style={styles.box}>
        <Text style={styles.message} accessibilityRole="alert">
          {error?.message ?? 'Something went wrong. Please try again.'}
        </Text>
        <Pressable onPress={onRetry} accessibilityRole="button" style={styles.retry}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
  if (isEmpty) {
    return (
      <View style={styles.box}>
        <Text style={styles.message}>{empty ?? 'Nothing to show yet.'}</Text>
      </View>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  box: { paddingVertical: 24, alignItems: 'center', gap: 12 },
  message: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retry: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, backgroundColor: colors.primaryTint },
  retryText: { color: colors.primary, fontWeight: '700' },
});
