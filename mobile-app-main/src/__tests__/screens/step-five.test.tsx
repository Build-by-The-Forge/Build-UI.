import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ApiError } from '@/api/errors';
import Step5Summary from '@/app/(onboarding)/step-five';

const mockSave = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));
jest.mock('@/features/academic/ProfileProvider', () => ({
  useAcademicProfile: () => ({ save: mockSave }),
}));
jest.mock('@/context/Onboardingcontext', () => ({
  useOnboarding: () => ({
    data: {
      faculty: { id: 'f1', name: 'School of Computing' },
      department: { id: 'd1', name: 'Computer Science' },
      programme: { id: 'p1', name: 'B.Tech Computer Science', code: 'CSC', durationYears: 5 },
      level: 300,
      courseIds: ['c1', 'c2'],
      goals: [],
      learningStyles: [],
    },
  }),
}));

beforeEach(() => {
  mockSave.mockReset();
  mockReplace.mockReset();
});

describe('onboarding summary', () => {
  it('shows what the student chose', () => {
    render(<Step5Summary />);
    expect(screen.getByText('300 Level')).toBeTruthy();
    expect(screen.getByText('Computer Science')).toBeTruthy();
    expect(screen.getByText('2 courses')).toBeTruthy();
  });

  it('sends the whole profile and only then goes to the dashboard', async () => {
    mockSave.mockResolvedValue({});
    render(<Step5Summary />);
    fireEvent.press(screen.getByText('Start Learning  →'));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/dashboard/home'), { timeout: 5000 });
    expect(mockSave).toHaveBeenCalledWith({ programme_id: 'p1', level: 300, course_ids: ['c1', 'c2'] });
  });

  it('stays put and says why when the backend refuses the profile', async () => {
    mockSave.mockRejectedValue(
      new ApiError('VALIDATION_FAILED', 'x', 422, 'r', [
        { field: 'body.course_ids', code: 'invalid', message: 'A course is no longer available' },
      ]),
    );
    render(<Step5Summary />);
    fireEvent.press(screen.getByText('Start Learning  →'));
    expect(await screen.findByText('A course is no longer available')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
