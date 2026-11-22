import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ApiError } from '@/api/errors';
import CbtAttemptScreen from '@/app/dashboard/cbtattempt';
import CbtResultScreen from '@/app/dashboard/cbtresult';

// The first render of a screen can be slow on a loaded machine.
configure({ asyncUtilTimeout: 5000 });
jest.setTimeout(30000);

const mockReplace = jest.fn();
const mockApi = {
  attempt: jest.fn(),
  questions: jest.fn(),
  answers: jest.fn(),
  saveAnswer: jest.fn(),
  submit: jest.fn(),
  result: jest.fn(),
};

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ attemptId: 'a1' }),
  useRouter: () => ({ replace: mockReplace, back: jest.fn(), push: jest.fn() }),
}));
jest.mock('@/features/cbt', () => ({ cbtApi: () => mockApi }));

const future = () => new Date(Date.now() + 30 * 60_000).toISOString();
const past = () => new Date(Date.now() - 60_000).toISOString();
const attempt = (over: Record<string, unknown> = {}) => ({
  id: 'a1',
  assessment_id: 'as1',
  status: 'in_progress',
  started_at: new Date().toISOString(),
  expires_at: future(),
  submitted_at: null,
  ...over,
});
const questions = {
  attempt_id: 'a1',
  assessment_id: 'as1',
  questions: [
    { assessment_question_id: 'q1', sequence: 1, prompt: 'What is 2 + 2?', marks: 1, options: [{ position: 0, text: 'Three' }, { position: 1, text: 'Four' }] },
    { assessment_question_id: 'q2', sequence: 2, prompt: 'Second?', marks: 1, options: [{ position: 0, text: 'Yes' }, { position: 1, text: 'No' }] },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockApi.attempt.mockResolvedValue(attempt());
  mockApi.questions.mockResolvedValue(questions);
  mockApi.answers.mockResolvedValue({ attempt_id: 'a1', answers: [] });
  mockApi.saveAnswer.mockResolvedValue({});
  mockApi.submit.mockResolvedValue(attempt({ status: 'submitted' }));
});

describe('attempt screen', () => {
  it('shows the server questions and saves a chosen answer', async () => {
    render(<CbtAttemptScreen />);
    expect(await screen.findByText('What is 2 + 2?')).toBeTruthy();
    fireEvent.press(screen.getByText('Four'));
    await waitFor(() => expect(mockApi.saveAnswer).toHaveBeenCalledWith('a1', 'q1', 1));
  });

  it('puts the choice back and says so when saving fails', async () => {
    mockApi.saveAnswer.mockRejectedValue(new ApiError('NETWORK_ERROR', 'offline', null, null));
    render(<CbtAttemptScreen />);
    fireEvent.press(await screen.findByText('Four'));
    expect(await screen.findByText(/was not saved/)).toBeTruthy();
    expect(screen.getByLabelText('Question 1')).toBeTruthy(); // still unanswered in the palette
  });

  it('warns about unanswered questions, then submits and opens the result', async () => {
    render(<CbtAttemptScreen />);
    fireEvent.press(await screen.findByText('Four'));
    await waitFor(() => expect(mockApi.saveAnswer).toHaveBeenCalled());
    fireEvent.press(screen.getByText('Submit'));
    expect(screen.getByText(/1 question is unanswered and will score zero/)).toBeTruthy();
    fireEvent.press(screen.getAllByText('Submit')[1]);
    await waitFor(() => expect(mockApi.submit).toHaveBeenCalledWith('a1'));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith({ pathname: '/dashboard/cbtresult', params: { attemptId: 'a1' } }));
  });

  it('stays on the attempt when submitting fails, so it can be retried', async () => {
    mockApi.submit.mockRejectedValue(new ApiError('NETWORK_ERROR', 'offline', null, null));
    render(<CbtAttemptScreen />);
    await screen.findByText('What is 2 + 2?');
    fireEvent.press(screen.getByText('Submit'));
    fireEvent.press(screen.getAllByText('Submit')[1]);
    expect(await screen.findByText('offline')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('submits what is saved when the deadline has passed, and takes no more answers', async () => {
    mockApi.attempt.mockResolvedValue(attempt({ expires_at: past() }));
    render(<CbtAttemptScreen />);
    await waitFor(() => expect(mockApi.submit).toHaveBeenCalledTimes(1));
    fireEvent.press(await screen.findByText('Four'));
    expect(mockApi.saveAnswer).not.toHaveBeenCalled();
  });

  it('does not hammer a dead connection at the deadline, and lets the student retry', async () => {
    mockApi.attempt.mockResolvedValue(attempt({ expires_at: past() }));
    mockApi.submit.mockRejectedValue(new ApiError('NETWORK_ERROR', 'offline', null, null));
    render(<CbtAttemptScreen />);
    fireEvent.press(await screen.findByText('Send my answers'));
    await waitFor(() => expect(mockApi.submit).toHaveBeenCalledTimes(2));
    await new Promise((r) => setTimeout(r, 300));
    expect(mockApi.submit).toHaveBeenCalledTimes(2); // one automatic try, one by the student
  });

  it('marks what is saved when a save is refused because time ran out', async () => {
    mockApi.saveAnswer.mockRejectedValue(new ApiError('ATTEMPT_EXPIRED', 'x', 409, 'r'));
    render(<CbtAttemptScreen />);
    fireEvent.press(await screen.findByText('Four'));
    await waitFor(() => expect(mockApi.submit).toHaveBeenCalledWith('a1'));
  });

  it('goes straight to the result for an attempt that was already submitted', async () => {
    mockApi.attempt.mockResolvedValue(attempt({ status: 'submitted' }));
    render(<CbtAttemptScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalled());
    expect(mockApi.submit).not.toHaveBeenCalled();
  });
});

describe('result screen', () => {
  it('shows the backend score, not a made-up one', async () => {
    mockApi.result.mockResolvedValue({
      attempt_id: 'a1', assessment_id: 'as1', total_score: 1, max_score: 4, percentage: 25, passed: false, graded_at: new Date().toISOString(),
      breakdown: [{ assessment_question_id: 'q1', selected_option_index: 1, awarded_marks: null, max_marks: 2, is_correct: null }],
    });
    mockApi.questions.mockResolvedValue(questions);
    render(<CbtResultScreen />);
    expect(await screen.findByText('25%')).toBeTruthy();
    expect(screen.getByText('1 of 4 marks')).toBeTruthy();
    expect(screen.getByText('Not passed')).toBeTruthy();
    expect(screen.queryByText('95%')).toBeNull();
    expect(screen.getByText(/isn't available for this assessment yet/)).toBeTruthy();
  });

  it('says the result is not released yet instead of showing a score', async () => {
    mockApi.result.mockRejectedValue(new ApiError('RESULT_NOT_RELEASED', 'x', 409, 'r'));
    render(<CbtResultScreen />);
    expect(await screen.findByText(/has not been released yet/)).toBeTruthy();
    expect(screen.queryByText(/marks/)).toBeNull();
  });
});
