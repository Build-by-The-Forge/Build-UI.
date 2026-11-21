import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space } from '@/theme/glass/tokens';

import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';

type Props = {
  visible: boolean;
  title: string;
  /** Called by the scrim, the Android back button, or a close action. */
  onClose: () => void;
  /** 'sheet' slides from the bottom; 'dialog' is centred (confirmations). */
  presentation?: 'sheet' | 'dialog';
  children?: React.ReactNode;
  /** Buttons, stacked full width. */
  actions?: React.ReactNode;
  /** Block dismiss by scrim and back button (e.g. while submitting a CBT). */
  dismissible?: boolean;
};

/**
 * Modal sheet or dialog. A modal opens in its own Android window, which a
 * blur target in the screen cannot reach, so the sheet uses the strong
 * `sheet` fill over a tinted scrim instead of live blur. This keeps the blur
 * budget for the screen chrome and costs nothing on low-end phones.
 */
export function GlassModal({
  visible,
  title,
  onClose,
  presentation = 'sheet',
  children,
  actions,
  dismissible = true,
}: Props) {
  const { surface, duration } = useGlassTheme();
  const insets = useSafeAreaInsets();
  const sheet = presentation === 'sheet';
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType={duration.base === 0 ? 'none' : sheet ? 'slide' : 'fade'}
      onRequestClose={dismissible ? onClose : () => {}}
    >
      <View style={[styles.root, sheet ? styles.bottom : styles.center]}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: surface.scrim }]}
          accessibilityRole="button"
          accessibilityLabel="Close"
          disabled={!dismissible}
          onPress={onClose}
        />
        <GlassSurface
          kind="sheet"
          elevation="raised"
          radius={radius.xxl}
          corners={sheet ? { topLeft: true, topRight: true } : undefined}
          style={[styles.panel, sheet ? { paddingBottom: insets.bottom + space.xl } : styles.dialog]}
          accessibilityViewIsModal
        >
          {sheet ? <View style={styles.grabber} importantForAccessibility="no" /> : null}
          <AppText variant="title2">{title}</AppText>
          <ScrollView style={styles.body} contentContainerStyle={{ gap: space.md }}>
            {children}
          </ScrollView>
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </GlassSurface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bottom: { justifyContent: 'flex-end' },
  center: { justifyContent: 'center', paddingHorizontal: space.xxl },
  panel: { padding: space.xxl, gap: space.lg, maxHeight: '88%' },
  dialog: {},
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(100, 116, 139, 0.5)',
    marginTop: -space.sm,
  },
  body: { flexGrow: 0 },
  actions: { gap: space.sm },
});
