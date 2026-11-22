import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import type { AcademicProfile } from '@/api/types';
import { ProfileProvider, useAcademicProfile } from '../ProfileProvider';

jest.setTimeout(30000);

const profileFor = (name: string): AcademicProfile => ({
  programme: { id: `p-${name}`, name: `Programme ${name}`, code: name },
  department: { id: `d-${name}`, name: `Department ${name}` },
  faculty: { id: 'f', name: 'School' },
  level: 300,
  courses: [],
  complete: true,
  updated_at: null,
});

// --- a controllable session -------------------------------------------------
type Snapshot = { status: string; userId: string | null; reason: null };
let mockSnapshot: Snapshot = { status: 'signedIn', userId: 'A', reason: null };
let mockGate = 'app';
const mockListeners = new Set<() => void>();
const setSession = (userId: string | null) => {
  mockSnapshot = { status: userId ? 'signedIn' : 'signedOut', userId, reason: null };
  mockGate = userId ? 'app' : 'auth';
  mockListeners.forEach((l) => l());
};

jest.mock('@/auth', () => ({
  getSessionManager: () => ({
    client: {},
    subscribe: (l: () => void) => {
      mockListeners.add(l);
      return () => mockListeners.delete(l);
    },
    getSnapshot: () => mockSnapshot,
  }),
}));
jest.mock('@/auth/SessionProvider', () => ({ useSession: () => ({ gate: mockGate }) }));
jest.mock('@/api/config', () => ({ apiConfig: () => ({ tenantSlug: 'futa' }) }));

// --- a controllable academic API ---------------------------------------------
type Pending = { resolve: (p: AcademicProfile) => void; signal: AbortSignal | undefined; update: unknown };
const saves: Pending[] = [];
const mockApi = {
  getProfile: jest.fn(async (_signal?: AbortSignal) => profileFor(mockSnapshot.userId ?? 'none')),
  saveProfile: jest.fn(
    (update: unknown, signal?: AbortSignal) =>
      new Promise<AcademicProfile>((resolve) => {
        saves.push({ resolve, signal, update });
      }),
  ),
};
jest.mock('../api', () => ({ createAcademicApi: () => mockApi }));

const wrapper = ({ children }: { children: React.ReactNode }) => <ProfileProvider>{children}</ProfileProvider>;

beforeEach(() => {
  saves.length = 0;
  mockApi.getProfile.mockClear();
  mockApi.saveProfile.mockClear();
  setSession('A');
});

describe('ProfileProvider across sessions', () => {
  it('reads the signed-in student\'s profile and drops it on sign-out', async () => {
    const { result } = renderHook(() => useAcademicProfile(), { wrapper });
    await waitFor(() => expect(result.current.profile?.programme?.code).toBe('A'));
    act(() => setSession(null));
    await waitFor(() => expect(result.current.profile).toBeNull());
    expect(result.current.status).toBe('idle');
  });

  it('never writes student A\'s late save into student B\'s session', async () => {
    const { result } = renderHook(() => useAcademicProfile(), { wrapper });
    await waitFor(() => expect(result.current.profile?.programme?.code).toBe('A'));

    // A starts a save that is still in flight...
    let savePromise!: Promise<AcademicProfile>;
    act(() => {
      savePromise = result.current.save({ programme_id: 'p-A', level: 300, course_ids: [] });
    });
    expect(saves).toHaveLength(1);
    const aSave = saves[0];

    // ...A signs out and B signs in on the same device.
    act(() => setSession(null));
    act(() => setSession('B'));
    await waitFor(() => expect(result.current.profile?.programme?.code).toBe('B'));

    // The request that hadn't finished was cancelled with A's session...
    expect(aSave.signal?.aborted).toBe(true);

    // ...and even if A's answer arrives anyway, it doesn't touch B's state.
    await act(async () => {
      aSave.resolve(profileFor('A'));
      await savePromise;
    });
    expect(result.current.profile?.programme?.code).toBe('B');
    expect(result.current.status).toBe('ready');
  });

  it('applies a save to the session that started it', async () => {
    const { result } = renderHook(() => useAcademicProfile(), { wrapper });
    await waitFor(() => expect(result.current.profile?.programme?.code).toBe('A'));
    let savePromise!: Promise<AcademicProfile>;
    act(() => {
      savePromise = result.current.save({ programme_id: 'p-A2', level: 400, course_ids: [] });
    });
    await act(async () => {
      saves[0].resolve({ ...profileFor('A'), level: 400 });
      await savePromise;
    });
    expect(result.current.profile?.level).toBe(400);
  });

  it('ignores a profile read for A that finishes after B signed in', async () => {
    let releaseA!: (p: AcademicProfile) => void;
    mockApi.getProfile.mockImplementationOnce(
      () => new Promise<AcademicProfile>((resolve) => (releaseA = resolve)),
    );
    const { result } = renderHook(() => useAcademicProfile(), { wrapper });
    await waitFor(() => expect(mockApi.getProfile).toHaveBeenCalledTimes(1));
    act(() => setSession('B'));
    await waitFor(() => expect(result.current.profile?.programme?.code).toBe('B'));
    await act(async () => {
      releaseA(profileFor('A'));
    });
    expect(result.current.profile?.programme?.code).toBe('B');
  });
});
