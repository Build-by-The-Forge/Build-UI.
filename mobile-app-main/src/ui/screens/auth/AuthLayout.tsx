import { Image } from 'expo-image';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space } from '@/theme/glass/tokens';
import { AppText, GlassScreen, GlassSurface } from '@/ui/glass';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Below the card: "Don't have an account? Sign up". */
  footer?: React.ReactNode;
  testID?: string;
};

/**
 * Shared frame for sign-in, sign-up and email verification: brand mark,
 * title, one glass card holding the form, and a footer link. Scrolls when
 * the keyboard is up or the font is large, so nothing is ever cut off.
 */
export function AuthLayout({ title, subtitle, children, footer, testID }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useGlassTheme();
  return (
    <GlassScreen testID={testID}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + space.xxxl, paddingBottom: insets.bottom + space.xxl },
          ]}
        >
          <View style={styles.brand} accessible accessibilityRole="image" accessibilityLabel="BUILD">
            <Image source={require('../../../../assets/images/logo.png')} style={styles.logo} contentFit="contain" />
            <AppText variant="title1" style={[styles.wordmark, { color: colors.text.accent }]} accessibilityElementsHidden>
              BUILD
            </AppText>
          </View>
          <View style={styles.heading}>
            <AppText variant="title1" align="center">
              {title}
            </AppText>
            {subtitle ? (
              <AppText tone="secondary" align="center">
                {subtitle}
              </AppText>
            ) : null}
          </View>
          <GlassSurface kind="card" radius={radius.xxl} elevation="raised" style={styles.card}>
            {children}
          </GlassSurface>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: space.gutter, gap: space.xxl, justifyContent: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
  logo: { width: 44, height: 44 },
  wordmark: { letterSpacing: -0.5 },
  heading: { gap: space.xs },
  card: { padding: space.xxl, gap: space.lg },
  footer: { alignItems: 'center' },
});
