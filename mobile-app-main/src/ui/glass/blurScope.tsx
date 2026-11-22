/**
 * Blur budget. A GlassScreen owns one scope: it holds the Android blur
 * target (the content to blur) and hands out at most `blur.maxLayers` live
 * blur slots for that screen's treatment (2 full, 1 reduced, 0 opaque).
 * A surface that asks for blur after the budget is spent renders its tinted
 * fill alone, which looks nearly the same and costs nothing.
 *
 * Outside a GlassScreen there is no scope, so nothing blurs. List rows and
 * cards never ask for blur at all.
 */
import React, { createContext, useContext, useEffect, useId, useState, useSyncExternalStore } from 'react';
import type { View } from 'react-native';

import { useGlassTheme } from '@/theme/glass/GlassThemeProvider';

/** A tiny store: slots are granted in the order surfaces mount, up to `max`. */
class BlurBudget {
  private ids: string[] = [];
  private listeners = new Set<() => void>();
  constructor(
    readonly target: React.RefObject<View | null>,
    private max: number,
  ) {}
  setMax(max: number) {
    if (max === this.max) return;
    this.max = max;
    this.emit();
  }
  register(id: string) {
    if (!this.ids.includes(id)) this.ids.push(id);
    if (__DEV__ && this.ids.length > this.max && this.max > 0) {
      console.warn(`[glass] blur budget of ${this.max} layer(s) spent on this screen; extra surfaces use a tinted fill.`);
    }
    this.emit();
  }
  unregister(id: string) {
    this.ids = this.ids.filter((x) => x !== id);
    this.emit();
  }
  isGranted = (id: string) => {
    const i = this.ids.indexOf(id);
    return i !== -1 && i < this.max;
  };
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private emit() {
    this.listeners.forEach((fn) => fn());
  }
}

const BlurScopeContext = createContext<BlurBudget | null>(null);

export function BlurScope({
  target,
  children,
}: {
  target: React.RefObject<View | null>;
  children: React.ReactNode;
}) {
  const { blur } = useGlassTheme();
  const [budget] = useState(() => new BlurBudget(target, blur.maxLayers));
  useEffect(() => {
    budget.setMax(blur.maxLayers);
  }, [budget, blur.maxLayers]);
  return <BlurScopeContext.Provider value={budget}>{children}</BlurScopeContext.Provider>;
}

const never = () => () => {};

/**
 * Ask for one live blur layer. Returns the Android blur target when granted,
 * or null. Re-evaluated when the treatment changes (for example when the
 * student switches effects off in Settings).
 */
export function useBlurSlot(requested: boolean): React.RefObject<View | null> | null {
  const scope = useContext(BlurScopeContext);
  const id = useId();
  useEffect(() => {
    if (!requested || !scope) return;
    scope.register(id);
    return () => scope.unregister(id);
  }, [requested, scope, id]);
  const granted = useSyncExternalStore(
    scope ? scope.subscribe : never,
    () => (scope ? scope.isGranted(id) : false),
  );
  return requested && granted && scope ? scope.target : null;
}
