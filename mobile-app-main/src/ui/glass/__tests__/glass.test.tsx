import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  EFFECTS_STORAGE_KEY,
  GlassThemeProvider,
  useGlassTheme,
} from '@/theme/glass/GlassThemeProvider';
import type { GlassTier } from '@/theme/glass/tokens';
import {
  AppText,
  EffectsSettingControl,
  GlassButton,
  GlassCard,
  GlassChip,
  GlassHeader,
  GlassInput,
  GlassScreen,
  GlassSurface,
  GlassTabBar,
} from '@/ui/glass';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

const GIB = 1024 ** 3;
const signals = { platform: 'android' as const, totalMemoryBytes: 8 * GIB, androidApiLevel: 34, reduceMotion: false, reduceTransparency: false };

function withTier(tier: GlassTier, ui: React.ReactElement) {
  return (
    <GlassThemeProvider scheme="light" signals={signals} initialPreference={tier}>
      {ui}
    </GlassThemeProvider>
  );
}

const tabs = [
  { key: 'home', label: 'Home', icon: 'home-outline' as const },
  { key: 'cbt', label: 'CBT', icon: 'create-outline' as const, badge: 2 },
];

function ChromeScreen({ extraBlur = false }: { extraBlur?: boolean }) {
  return (
    <GlassScreen
      header={<GlassHeader title="Screen" />}
      footer={<GlassTabBar items={tabs} activeKey="home" onSelect={() => {}} />}
    >
      {extraBlur ? <GlassSurface kind="sheet" blur /> : null}
      <GlassCard>
        <AppText>Body</AppText>
      </GlassCard>
    </GlassScreen>
  );
}

describe('blur budget', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    ['full', 2],
    ['reduced', 1],
    ['opaque', 0],
  ] as const)('%s treatment renders %i live blur layer(s) for header + tab bar', async (tier, expected) => {
    render(withTier(tier, <ChromeScreen />));
    await waitFor(() => expect(screen.queryAllByTestId('glass-blur')).toHaveLength(expected));
  });

  it('never exceeds the budget when a third surface asks for blur', async () => {
    render(withTier('full', <ChromeScreen extraBlur />));
    await waitFor(() => expect(screen.queryAllByTestId('glass-blur')).toHaveLength(2));
  });

  it('cards never blur, even in full treatment', async () => {
    render(
      withTier(
        'full',
        <GlassScreen>
          <GlassCard>
            <AppText>Row</AppText>
          </GlassCard>
          <GlassSurface kind="card" blur />
        </GlassScreen>,
      ),
    );
    await act(async () => {});
    expect(screen.queryAllByTestId('glass-blur')).toHaveLength(0);
  });

  it('nothing blurs outside a GlassScreen', async () => {
    render(withTier('full', <GlassHeader title="Loose" />));
    await act(async () => {});
    expect(screen.queryAllByTestId('glass-blur')).toHaveLength(0);
  });
});

/** Strip everything that may legitimately differ between treatments: colours, shadows and the blur layer. */
function layoutOnly(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(layoutOnly).filter((n) => n !== null);
  if (!node || typeof node !== 'object') return node;
  const n = node as { type: string; props: Record<string, unknown>; children: unknown };
  if (n.props?.testID === 'glass-blur') return null;
  const style = StyleSheet.flatten(n.props?.style as never) as Record<string, unknown> | undefined;
  const kept: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(style ?? {})) {
    if (!/color|shadow|opacity|backgroundImage/i.test(k)) kept[k] = v;
  }
  return { type: n.type, style: kept, children: layoutOnly(n.children) };
}

describe('treatments change looks, never layout', () => {
  it('a screen with chrome, card, button, input and chip has identical layout in all three treatments', async () => {
    const ui = (
      <GlassScreen header={<GlassHeader title="Same" />} footer={<GlassTabBar items={tabs} activeKey="home" onSelect={() => {}} />}>
        <GlassCard onPress={() => {}} accessibilityLabel="Card">
          <AppText>Card</AppText>
        </GlassCard>
        <GlassButton label="Go" onPress={() => {}} />
        <GlassButton label="Glass" variant="secondary" onPress={() => {}} />
        <GlassInput label="Email" />
        <GlassChip label="CSC 201" selected />
      </GlassScreen>
    );
    const trees: unknown[] = [];
    for (const tier of ['full', 'reduced', 'opaque'] as const) {
      const r = render(withTier(tier, ui));
      await act(async () => {});
      trees.push(layoutOnly(r.toJSON()));
      r.unmount();
    }
    expect(trees[1]).toEqual(trees[0]);
    expect(trees[2]).toEqual(trees[0]);
  });
});

describe('accessibility', () => {
  it('buttons expose role, label and state, and are at least 48dp tall', () => {
    render(withTier('opaque', <GlassButton label="Submit" loading onPress={() => {}} />));
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button.props.accessibilityState).toMatchObject({ disabled: true, busy: true });
    const style = StyleSheet.flatten(
      typeof button.props.style === 'function' ? button.props.style({ pressed: false }) : button.props.style,
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(48);
  });

  it('inputs keep a visible label, announce errors, and toggle secret text', () => {
    render(withTier('opaque', <GlassInput label="Password" secret error="Too short" />));
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByText('Too short').props.accessibilityLiveRegion).toBe('polite');
    const field = screen.getByLabelText('Password');
    expect(field.props.secureTextEntry).toBe(true);
    fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeTruthy();
  });

  it('chips report checked state, not just colour', () => {
    render(withTier('opaque', <GlassChip role="radio" label="Off" selected onPress={() => {}} />));
    expect(screen.getByRole('radio', { name: 'Off' }).props.accessibilityState).toMatchObject({ checked: true });
  });

  it('tab bar tabs are selectable and announce badges', () => {
    const onSelect = jest.fn();
    render(withTier('opaque', <GlassTabBar items={tabs} activeKey="home" onSelect={onSelect} />));
    expect(screen.getByRole('tab', { name: 'Home' }).props.accessibilityState).toMatchObject({ selected: true });
    fireEvent.press(screen.getByRole('tab', { name: 'CBT, 2 new' }));
    expect(onSelect).toHaveBeenCalledWith('cbt');
  });

  it('title text is a header for screen readers', () => {
    render(withTier('opaque', <AppText variant="title1">Results</AppText>));
    expect(screen.getByRole('header', { name: 'Results' })).toBeTruthy();
  });
});

function TierProbe() {
  const t = useGlassTheme();
  return <Text testID="tier">{`${t.tier}|${t.preference}|${t.ready}`}</Text>;
}

describe('GlassThemeProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts opaque, then picks the tier from measured signals', async () => {
    render(
      <GlassThemeProvider scheme="light" signals={signals}>
        <TierProbe />
      </GlassThemeProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('tier').props.children).toBe('full|auto|true'));
  });

  it('a 4 GB phone gets effects off automatically', async () => {
    render(
      <GlassThemeProvider scheme="light" signals={{ ...signals, totalMemoryBytes: 3.7 * GIB }}>
        <TierProbe />
      </GlassThemeProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('tier').props.children).toBe('opaque|auto|true'));
  });

  it('restores and persists the student override from Settings', async () => {
    await AsyncStorage.setItem(EFFECTS_STORAGE_KEY, 'reduced');
    render(
      <GlassThemeProvider scheme="light" signals={signals}>
        <TierProbe />
        <EffectsSettingControl />
      </GlassThemeProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('tier').props.children).toBe('reduced|reduced|true'));
    fireEvent.press(screen.getByTestId('effects-opaque'));
    expect(screen.getByTestId('tier').props.children).toBe('opaque|opaque|true');
    await waitFor(async () => expect(await AsyncStorage.getItem(EFFECTS_STORAGE_KEY)).toBe('opaque'));
  });

  it('ignores a corrupted stored preference', async () => {
    await AsyncStorage.setItem(EFFECTS_STORAGE_KEY, 'ultra');
    render(
      <GlassThemeProvider scheme="light" signals={signals}>
        <TierProbe />
      </GlassThemeProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('tier').props.children).toBe('full|auto|true'));
  });
});

describe('platforms without every accessibility query', () => {
  it('still resolves a theme when reduce-transparency is not implemented (react-native-web)', async () => {
    const { AccessibilityInfo } = jest.requireActual('react-native');
    const original = AccessibilityInfo.isReduceTransparencyEnabled;
    AccessibilityInfo.isReduceTransparencyEnabled = undefined;
    try {
      render(
        <GlassThemeProvider scheme="light" signals={{ platform: 'android', totalMemoryBytes: 8 * GIB, androidApiLevel: 34 }}>
          <TierProbe />
        </GlassThemeProvider>,
      );
      await waitFor(() => expect(screen.getByTestId('tier').props.children).toBe('full|auto|true'));
    } finally {
      AccessibilityInfo.isReduceTransparencyEnabled = original;
    }
  });
});
