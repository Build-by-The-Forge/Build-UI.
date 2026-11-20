import { call, callPage, type ApiClient } from '@/api/client';
import type {
  Assessment,
  Attempt,
  AttemptAnswer,
  AttemptAnswers,
  AttemptQuestions,
  AttemptResult,
} from '@/api/types';
import { fetchAll } from '@/features/academic/api';

/**
 * The assessment routes, as the contract defines them. The backend owns
 * grading, deadlines, attempt limits and what a result may reveal; this only
 * sends the student's choices and returns what it answers.
 */
export type CbtApi = {
  readonly assessments: (courseId?: string) => Promise<readonly Assessment[]>;
  /** This student's attempts, newest first. */
  readonly attempts: () => Promise<readonly Attempt[]>;
  /** Starts an attempt, or returns the one already in progress. */
  readonly startAttempt: (assessmentId: string) => Promise<Attempt>;
  readonly attempt: (attemptId: string) => Promise<Attempt>;
  readonly questions: (attemptId: string) => Promise<AttemptQuestions>;
  readonly answers: (attemptId: string) => Promise<AttemptAnswers>;
  readonly saveAnswer: (attemptId: string, assessmentQuestionId: string, optionIndex: number) => Promise<AttemptAnswer>;
  readonly deleteAnswer: (attemptId: string, assessmentQuestionId: string) => Promise<void>;
  /** Grades the saved answers once. Repeating it is safe. */
  readonly submit: (attemptId: string) => Promise<Attempt>;
  readonly result: (attemptId: string) => Promise<AttemptResult>;
};

export function createCbtApi(client: ApiClient, tenantSlug: string): CbtApi {
  const header = { 'X-Tenant-Slug': tenantSlug };
  return {
    assessments: (courseId) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/assessment/assessments', {
            params: { header, query: { ...(courseId ? { course_id: courseId } : {}), limit, offset } },
          }),
        ),
      ),
    attempts: () =>
      fetchAll((limit, offset) =>
        callPage(client.GET('/assessment/attempts', { params: { header, query: { limit, offset } } })),
      ),
    startAttempt: (assessmentId) =>
      call(
        client.POST('/assessment/assessments/{assessment_id}/attempts', {
          params: { header, path: { assessment_id: assessmentId } },
        }),
      ),
    attempt: (attemptId) =>
      call(client.GET('/assessment/attempts/{attempt_id}', { params: { header, path: { attempt_id: attemptId } } })),
    questions: (attemptId) =>
      call(
        client.GET('/assessment/attempts/{attempt_id}/questions', {
          params: { header, path: { attempt_id: attemptId } },
        }),
      ),
    answers: (attemptId) =>
      call(
        client.GET('/assessment/attempts/{attempt_id}/answers', {
          params: { header, path: { attempt_id: attemptId } },
        }),
      ),
    saveAnswer: (attemptId, assessmentQuestionId, optionIndex) =>
      call(
        client.PUT('/assessment/attempts/{attempt_id}/answers/{assessment_question_id}', {
          params: { header, path: { attempt_id: attemptId, assessment_question_id: assessmentQuestionId } },
          body: { selected_option_index: optionIndex },
        }),
      ),
    deleteAnswer: async (attemptId, assessmentQuestionId) => {
      await call(
        client.DELETE('/assessment/attempts/{attempt_id}/answers/{assessment_question_id}', {
          params: { header, path: { attempt_id: attemptId, assessment_question_id: assessmentQuestionId } },
        }),
      );
    },
    submit: (attemptId) =>
      call(
        client.POST('/assessment/attempts/{attempt_id}/submit', {
          params: { header, path: { attempt_id: attemptId } },
        }),
      ),
    result: (attemptId) =>
      call(
        client.GET('/assessment/attempts/{attempt_id}/result', {
          params: { header, path: { attempt_id: attemptId } },
        }),
      ),
  };
}
