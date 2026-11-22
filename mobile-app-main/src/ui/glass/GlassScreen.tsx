/**
 * Screen root. Draws the ambient background, makes the content the Android
 * blur target, and floats optional glass chrome (a header and a bottom bar)
 * over it. Content scrolls underneath the chrome; read the chrome heights
 * with `useChromeInsets()` to pad scroll content.
 */
import { BlurTargetView } from 'expo-blur';
import React, { createContext, useContext, useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { AmbientBackground } from './AmbientBackground';
import { BlurScope } from './blurScope';

type ChromeInsets = { top: number; bottom: number };
const ChromeInsetsContext = createContext<ChromeInsets>({ top: 0, bottom: 0 });

export function useChromeInsets(): ChromeInsets {
  return useContext(ChromeInsetsContext);
}

type Props = {
  children: React.ReactNode;
  /** Usually a GlassHeader. Floats at the top. */
  header?: React.ReactNode;
  /** Usually a GlassTabBar or a bottom action bar. Floats at the bottom. */
  footer?: React.ReactNode;
  testID?: string;
};

export function GlassScreen({ children, header, footer, testID }: Props) {
  const target = useRef<View | null>(null);
  const [insets, setInsets] = useState<ChromeInsets>({ top: 0, bottom: 0 });
  const onHeader = (e: LayoutChangeEvent) => {
    const top = Math.round(e.nativeEvent.layout.height);
    setInsets((i) => (i.top === top ? i : { ...i, top }));
  };
  const onFooter = (e: LayoutChangeEvent) => {
    const bottom = Math.round(e.nativeEvent.layout.height);
    setInsets((i) => (i.bottom === bottom ? i : { ...i, bottom }));
  };

  return (
    <BlurScope target={target}>
      <ChromeInsetsContext.Provider value={insets}>
        <View style={styles.root} testID={testID}>
          <BlurTargetView ref={target} style={StyleSheet.absoluteFill}>
            <AmbientBackground />
            {children}
          </BlurTargetView>
          {header ? (
            <View style={styles.header} onLayout={onHeader}>
              {header}
            </View>
          ) : null}
          {footer ? (
            <View style={styles.footer} onLayout={onFooter}>
              {footer}
            </View>
          ) : null}
        </View>
      </ChromeInsetsContext.Provider>
    </BlurScope>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
