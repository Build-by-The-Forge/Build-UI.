import type { components } from './generated/schema';

type Schemas = components['schemas'];

export type ErrorCode = Schemas['ErrorCode'];
export type AuthSession = Schemas['AuthSession'];
export type User = Schemas['User'];
export type Membership = Schemas['Membership'];
export type Faculty = Schemas['Faculty'];
export type Department = Schemas['Department'];
export type Programme = Schemas['Programme'];
export type Course = Schemas['Course'];
export type AcademicProfile = Schemas['AcademicProfile'];
export type AcademicProfileUpdate = Schemas['AcademicProfileUpdate'];
export type Assessment = Schemas['Assessment'];
export type AttemptPolicy = Schemas['AttemptPolicy'];
export type Attempt = Schemas['Attempt'];
export type AttemptQuestion = Schemas['AttemptQuestion'];
export type AttemptQuestions = Schemas['AttemptQuestions'];
export type AttemptAnswer = Schemas['AttemptAnswer'];
export type AttemptAnswers = Schemas['AttemptAnswers'];
export type AttemptResult = Schemas['AttemptResult'];
export type QuestionResult = Schemas['QuestionResult'];

export type Pagination = { readonly total: number; readonly limit: number; readonly offset: number };
export type Page<T> = { readonly items: readonly T[]; readonly pagination: Pagination };
