import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { GlassThemeProvider } from '@/theme/glass/GlassThemeProvider';
import { GlassButton } from '@/ui/glass';
import {
  ChoiceList,
  MultiChoiceList,
  OnboardingDoneView,
  OnboardingLayout,
  type Choice,
} from '@/ui/screens/onboarding';
import { LoadBoundary } from '@/ui/states';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

const wrap = (ui: React.ReactElement) => (
  <GlassThemeProvider scheme="light" initialPreference="opaque" signals={{ reduceMotion: false, reduceTransparency: false }}>
    {ui}
  </GlassThemeProvider>
);

const schools: Choice[] = [
  { id: 'seet', label: 'School of Engineering', detail: 'SEET' },
  { id: 'sops', label: 'School of Physical Sciences', detail: 'SOPS' },
];

describe('OnboardingLayout', () => {
  it('announces progress as a step count', () => {
    render(
      wrap(
        <OnboardingLayout step={2} total={5} title="Where do you study?" actions={<GlassButton label="Continue" onPress={() => {}} />}>
          <Text>body</Text>
        </OnboardingLayout>,
      ),
    );
    const bar = screen.getByRole('progressbar');
    expect(bar.props.accessibilityValue).toMatchObject({ now: 2, max: 5, text: 'Step 2 of 5' });
    expect(screen.getByRole('header', { name: 'Where do you study?' })).toBeTruthy();
  });

  it('shows Back only when the route allows it', () => {
    const onBack = jest.fn();
    const { rerender } = render(
      wrap(<OnboardingLayout step={1} total={5} title="T" actions={null}><Text>b</Text></OnboardingLayout>),
    );
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
    rerender(wrap(<OnboardingLayout step={1} total={5} title="T" onBack={onBack} actions={null}><Text>b</Text></OnboardingLayout>));
    fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalled();
  });
});

describe('ChoiceList', () => {
  it('is a radio group with the selection checked', () => {
    const onSelect = jest.fn();
    render(wrap(<ChoiceList label="School" options={schools} selectedId="sops" onSelect={onSelect} />));
    expect(screen.getByRole('radio', { name: 'School of Physical Sciences, SOPS' }).props.accessibilityState).toMatchObject({ checked: true });
    fireEvent.press(screen.getByRole('radio', { name: 'School of Engineering, SEET' }));
    expect(onSelect).toHaveBeenCalledWith('seet');
  });

  it('adds a filter for long lists and narrows by label or detail', () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ id: `d${i}`, label: `Department ${i}`, detail: i === 7 ? 'Computer Science' : undefined }));
    render(wrap(<ChoiceList label="Department" options={many} selectedId={null} onSelect={() => {}} />));
    fireEvent.changeText(screen.getByLabelText('Find a department'), 'computer');
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    fireEvent.changeText(screen.getByLabelText('Find a department'), 'zzz');
    expect(screen.getByText('Nothing matches "zzz".')).toBeTruthy();
  });

  it('has no filter for short lists', () => {
    render(wrap(<ChoiceList label="School" options={schools} selectedId={null} onSelect={() => {}} />));
    expect(screen.queryByLabelText('Find a school')).toBeNull();
  });
});

describe('MultiChoiceList', () => {
  const courses: Choice[] = [
    { id: 'c1', label: 'CSC 201', detail: 'Computer Programming' },
    { id: 'c2', label: 'MTS 202', detail: 'Linear Algebra' },
  ];

  it('counts the selection against the limit and toggles', () => {
    const onToggle = jest.fn();
    render(wrap(<MultiChoiceList label="Course" options={courses} selectedIds={['c1']} onToggle={onToggle} max={30} />));
    expect(screen.getByText('1 of 30 selected')).toBeTruthy();
    fireEvent.press(screen.getByRole('checkbox', { name: 'MTS 202, Linear Algebra' }));
    expect(onToggle).toHaveBeenCalledWith('c2');
  });

  it('explains the limit when the route refused a toggle', () => {
    render(wrap(<MultiChoiceList label="Course" options={courses} selectedIds={['c1', 'c2']} onToggle={() => {}} max={2} limitHit />));
    expect(screen.getByText('You can choose up to 2. Remove one to add another.')).toBeTruthy();
  });
});

describe('OnboardingDoneView', () => {
  it('lists what was saved and blocks Back while saving', () => {
    render(
      wrap(
        <OnboardingDoneView
          step={5}
          total={5}
          summary={[
            { label: 'Department', value: 'Computer Science' },
            { label: 'Level', value: '200' },
          ]}
          onFinish={() => {}}
          onBack={() => {}}
          saving
        />,
      ),
    );
    expect(screen.getByLabelText('Department: Computer Science')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Save and go to my dashboard' }).props.accessibilityState).toMatchObject({ busy: true });
  });
});

describe('LoadBoundary', () => {
  const child = <Text>content</Text>;
  it.each([
    ['loading', 'state-loading'],
    ['offline', 'state-offline'],
    ['error', 'state-error'],
  ] as const)('%s renders its state, not the content', (status, testID) => {
    render(wrap(<LoadBoundary status={status} onRetry={() => {}}>{child}</LoadBoundary>));
    expect(screen.getByTestId(testID)).toBeTruthy();
    expect(screen.queryByText('content')).toBeNull();
  });

  it('empty shows the empty state; ready shows content', () => {
    const { rerender } = render(
      wrap(<LoadBoundary status="ready" isEmpty empty={{ title: 'No schools yet' }} onRetry={() => {}}>{child}</LoadBoundary>),
    );
    expect(screen.getByText('No schools yet')).toBeTruthy();
    rerender(wrap(<LoadBoundary status="ready" onRetry={() => {}}>{child}</LoadBoundary>));
    expect(screen.getByText('content')).toBeTruthy();
  });

  it('offline says a connection is needed and retries', () => {
    const onRetry = jest.fn();
    render(wrap(<LoadBoundary status="offline" what="your courses" onRetry={onRetry}>{child}</LoadBoundary>));
    expect(screen.getByText(/needs the internet to load your courses/)).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });
});
