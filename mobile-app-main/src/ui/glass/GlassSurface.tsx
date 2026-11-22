/**
 * The glass primitive. Layers, bottom to top:
 *   1. soft outset shadow (CSS box-shadow, not drawn under the fill)
 *   2. optional live blur of the content behind (budgeted, see blurScope)
 *   3. tinted translucent fill (opaque in the opaque treatment)
 *   4. 1dp hairline edge with a brighter top edge: the inner highlight
 * Border width and padding never change between treatments, so switching
 * effects off moves nothing on screen.
 */
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';
import { radius as radii } from '@/theme/glass/tokens';

import { useBlurSlot } from './blurScope';

export type SurfaceKind = 'card' | 'chrome' | 'sheet' | 'input';
export type SurfaceElevation = 'none' | 'card' | 'raised' | 'chrome';

export type GlassSurfaceProps = ViewProps & {
  kind?: SurfaceKind;
  /**
   * Ask for live blur. Only chrome and sheets may blur, never anything inside
   * a scrolling list. Granted only if the treatment and the screen's budget allow.
   */
  blur?: boolean;
  radius?: number;
  elevation?: SurfaceElevation;
  /** Round only some corners (tab bars, sheets). */
  corners?: { topLeft?: boolean; topRight?: boolean; bottomLeft?: boolean; bottomRight?: boolean };
  style?: StyleProp<ViewStyle>;
};

export function GlassSurface({
  kind = 'card',
  blur = false,
  radius = radii.xl,
  elevation = kind === 'card' ? 'card' : 'none',
  corners,
  style,
  children,
  ...rest
}: GlassSurfaceProps) {
  const theme = useGlassTheme();
  const canBlur = blur && (kind === 'chrome' || kind === 'sheet') && theme.blur.maxLayers > 0;
  const target = useBlurSlot(canBlur);
  const blurOn = canBlur && target !== null;

  const r = (on?: boolean) => (corners ? (on ? radius : 0) : radius);
  const shape: ViewStyle = {
    borderTopLeftRadius: r(corners?.topLeft),
    borderTopRightRadius: r(corners?.topRight),
    borderBottomLeftRadius: r(corners?.bottomLeft),
    borderBottomRightRadius: r(corners?.bottomRight),
  };
  const fill = theme.surface[kind];

  return (
    <View
      {...rest}
      style={[shape, elevation !== 'none' && { boxShadow: theme.shadow[elevation] }, style]}
    >
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, shape, { overflow: 'hidden' }]}>
        {blurOn ? (
          <BlurView
            testID="glass-blur"
            style={StyleSheet.absoluteFill}
            intensity={theme.blur.intensity}
            tint={theme.scheme === 'dark' ? 'dark' : 'light'}
            blurMethod="dimezisBlurViewSdk31Plus"
            blurTarget={target ?? undefined}
          />
        ) : null}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
      </View>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          shape,
          {
            borderWidth: 1,
            borderColor: theme.surface.edge,
            borderTopColor: theme.surface.highlight,
          },
        ]}
      />
      {children}
    </View>
  );
}
