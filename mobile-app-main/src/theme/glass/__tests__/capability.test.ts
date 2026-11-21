import {
  decideTier,
  isEffectsPreference,
  resolveTier,
  type CapabilitySignals,
} from '../capability';

const GIB = 1024 ** 3;
const android = (overrides: Partial<CapabilitySignals> = {}): CapabilitySignals => ({
  platform: 'android',
  totalMemoryBytes: 7.5 * GIB,
  androidApiLevel: 34,
  reduceMotion: false,
  reduceTransparency: false,
  ...overrides,
});

describe('decideTier', () => {
  it('gives full glass to an 8 GB Android 14 phone', () => {
    expect(decideTier(android()).tier).toBe('full');
  });

  it('gives reduced glass to a 6 GB phone', () => {
    expect(decideTier(android({ totalMemoryBytes: 5.6 * GIB })).tier).toBe('reduced');
  });

  it('turns effects off on a 4 GB phone (the minimum target)', () => {
    expect(decideTier(android({ totalMemoryBytes: 3.7 * GIB })).tier).toBe('opaque');
  });

  it('turns effects off at exactly the low-memory edge minus one byte', () => {
    expect(decideTier(android({ totalMemoryBytes: 5 * GIB - 1 })).tier).toBe('opaque');
    expect(decideTier(android({ totalMemoryBytes: 5 * GIB })).tier).toBe('reduced');
    expect(decideTier(android({ totalMemoryBytes: 7 * GIB - 1 })).tier).toBe('reduced');
    expect(decideTier(android({ totalMemoryBytes: 7 * GIB })).tier).toBe('full');
  });

  it('is conservative when memory is unknown or nonsense', () => {
    expect(decideTier(android({ totalMemoryBytes: null })).tier).toBe('opaque');
    expect(decideTier(android({ totalMemoryBytes: 0 })).tier).toBe('opaque');
    expect(decideTier(android({ totalMemoryBytes: Number.NaN })).tier).toBe('opaque');
  });

  it('turns effects off below Android 12 or when the API level is unknown', () => {
    expect(decideTier(android({ androidApiLevel: 30, totalMemoryBytes: 12 * GIB })).tier).toBe('opaque');
    expect(decideTier(android({ androidApiLevel: null })).tier).toBe('opaque');
    expect(decideTier(android({ androidApiLevel: 31 })).tier).toBe('full');
  });

  it('honours the OS accessibility settings even on a high-end phone', () => {
    const big = { totalMemoryBytes: 16 * GIB };
    expect(decideTier(android({ ...big, reduceMotion: true })).tier).toBe('opaque');
    expect(decideTier(android({ ...big, reduceTransparency: true })).tier).toBe('opaque');
  });

  it('always explains itself in plain English', () => {
    for (const s of [android(), android({ totalMemoryBytes: 3 * GIB }), android({ reduceMotion: true })]) {
      expect(decideTier(s).reason).toMatch(/\w+/);
    }
  });

  it('does not apply Android memory rules to iOS', () => {
    expect(decideTier(android({ platform: 'ios', totalMemoryBytes: 4 * GIB, androidApiLevel: null })).tier).toBe('full');
  });
});

describe('resolveTier', () => {
  const auto = decideTier(android({ totalMemoryBytes: 3 * GIB }));

  it('uses the automatic decision when the preference is auto', () => {
    expect(resolveTier('auto', auto)).toBe('opaque');
  });

  it('lets the student override it in either direction', () => {
    expect(resolveTier('full', auto)).toBe('full');
    expect(resolveTier('reduced', decideTier(android()))).toBe('reduced');
  });
});

describe('isEffectsPreference', () => {
  it('accepts only the four known values', () => {
    expect(['auto', 'full', 'reduced', 'opaque'].every(isEffectsPreference)).toBe(true);
    expect(isEffectsPreference('max')).toBe(false);
    expect(isEffectsPreference(null)).toBe(false);
  });
});
