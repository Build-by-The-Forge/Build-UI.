import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useId, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius, space, TOUCH_TARGET, type as typeScale } from '@/theme/glass/tokens';

import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';

type Props = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  /** Always visible above the field; a placeholder is not a label. */
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  hint?: string;
  error?: string | null;
  /** Shows a show or hide toggle and starts hidden. */
  secret?: boolean;
};

export function GlassInput({ label, icon, hint, error, secret = false, editable = true, ...rest }: Props) {
  const { colors } = useGlassTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secret);
  const labelId = useId();
  const message = error || hint;
  const ring = error ? colors.text.danger : focused ? colors.focusRing : 'transparent';

  return (
    <View style={styles.wrap}>
      <AppText variant="label" tone="secondary" nativeID={labelId}>
        {label}
      </AppText>
      <GlassSurface kind="input" radius={radius.lg} elevation="none">
        <View style={[styles.row, { borderColor: ring }, !editable && styles.disabled]}>
          {icon ? <Ionicons name={icon} size={20} color={colors.text.secondary} /> : null}
          <TextInput
            {...rest}
            editable={editable}
            accessibilityLabel={label}
            accessibilityLabelledBy={labelId}
            accessibilityHint={error ?? hint}
            secureTextEntry={hidden}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            placeholderTextColor={colors.text.secondary}
            selectionColor={colors.accent.brand}
            style={[styles.input, typeScale.body, { color: colors.text.primary }]}
          />
          {secret ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              onPress={() => setHidden((h) => !h)}
              style={styles.toggle}
            >
              <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.text.secondary} />
            </Pressable>
          ) : null}
        </View>
      </GlassSurface>
      {message ? (
        <AppText
          variant="caption"
          tone={error ? 'danger' : 'secondary'}
          accessibilityLiveRegion={error ? 'polite' : 'none'}
        >
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  input: { flex: 1, minHeight: TOUCH_TARGET, paddingVertical: space.sm },
  toggle: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.md,
  },
  disabled: { opacity: 0.5 },
});
