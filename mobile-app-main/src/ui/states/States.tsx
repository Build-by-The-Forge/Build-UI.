/**
 * Shared empty, loading, error and lost-connection states. Every screen uses
 * these so a load is never a silent blank and every failure offers a way on.
 *
 * Release 1 is online-first: "lost connection" says the action needs a
 * connection and offers a retry. It is not an offline mode and caches nothing.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space } from '@/theme/glass/tokens';
import { AppText, GlassButton, GlassNotice } from '@/ui/glass';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Placeholder rows while content loads. Static (no shimmer), so it costs nothing and respects reduced motion. */
export function SkeletonRows({ rows = 3, label = 'Loading' }: { rows?: number; label?: string }) {
  const { surface } = useGlassTheme();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
      style={styles.skeleton}
      testID="state-loading"
    >
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={[styles.skeletonRow, { backgroundColor: surface.card, borderColor: surface.edge }]}>
          <View style={[styles.bar, { width: '55%', backgroundColor: surface.edge }]} />
          <View style={[styles.bar, styles.barThin, { width: '35%', backgroundColor: surface.edge }]} />
        </View>
      ))}
    </View>
  );
}

type EmptyProps = {
  title: string;
  message?: string;
  icon?: IconName;
  /** Usually a primary or secondary GlassButton. */
  action?: React.ReactNode;
  testID?: string;
};

export function EmptyState({ title, message, icon = 'file-tray-outline', action, testID = 'state-empty' }: EmptyProps) {
  const { colors } = useGlassTheme();
  return (
    <View style={styles.center} testID={testID}>
      <View style={[styles.iconTile, { backgroundColor: colors.accent.tint }]}>
        <Ionicons name={icon} size={28} color={colors.text.accent} />
      </View>
      <AppText variant="title3" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText tone="secondary" align="center">
          {message}
        </AppText>
      ) : null}
      {action}
    </View>
  );
}

type ErrorProps = {
  message?: string | null;
  onRetry?: () => void;
  title?: string;
};

export function ErrorState({ message, onRetry, title = "Couldn't load this" }: ErrorProps) {
  return (
    <View style={styles.block} testID="state-error">
      <GlassNotice
        tone="danger"
        title={title}
        message={message ?? 'Something went wrong. Please try again.'}
        action={onRetry ? <GlassButton label="Try again" variant="ghost" icon="refresh" onPress={onRetry} /> : undefined}
      />
    </View>
  );
}

/** Online-first notice for a request that failed because the phone is offline. */
export function LostConnectionState({ onRetry, what = 'this' }: { onRetry?: () => void; what?: string }) {
  return (
    <View style={styles.block} testID="state-offline">
      <GlassNotice
        tone="warning"
        title="No connection"
        message={`BUILD needs the internet to load ${what}. Check your data or Wi-Fi, then try again.`}
        action={onRetry ? <GlassButton label="Try again" variant="ghost" icon="refresh" onPress={onRetry} /> : undefined}
      />
    </View>
  );
}

export type LoadStatus = 'loading' | 'ready' | 'error' | 'offline';

type BoundaryProps = {
  status: LoadStatus;
  error?: { message?: string } | null;
  onRetry: () => void;
  isEmpty?: boolean;
  empty?: { title: string; message?: string; icon?: IconName; action?: React.ReactNode };
  loadingLabel?: string;
  /** What is being loaded, for the lost-connection message ("your courses"). */
  what?: string;
  children: React.ReactNode;
};

/** Loading, lost connection, failure with retry, empty, or the content. Same contract as the client lane's LoadBoundary. */
export function LoadBoundary({ status, error, onRetry, isEmpty, empty, loadingLabel, what, children }: BoundaryProps) {
  if (status === 'loading') return <SkeletonRows label={loadingLabel} />;
  if (status === 'offline') return <LostConnectionState onRetry={onRetry} what={what} />;
  if (status === 'error') return <ErrorState message={error?.message} onRetry={onRetry} />;
  if (isEmpty) return <EmptyState title={empty?.title ?? 'Nothing here yet'} message={empty?.message} icon={empty?.icon} action={empty?.action} />;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  skeleton: { gap: space.sm },
  skeletonRow: { padding: space.lg, borderRadius: radius.lg, borderWidth: 1, gap: space.sm },
  bar: { height: 14, borderRadius: 7 },
  barThin: { height: 10 },
  center: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg },
  iconTile: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  block: { paddingVertical: space.sm },
});
