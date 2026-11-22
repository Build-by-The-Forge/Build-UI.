import { call, callPage, type ApiClient } from '@/api/client';
import { ApiError } from '@/api/errors';
import type {
  AcademicProfile,
  AcademicProfileUpdate,
  Course,
  Department,
  Faculty,
  Page,
  Programme,
} from '@/api/types';

/** Largest page the contract allows. */
const PAGE_SIZE = 100;
/** The most items one list is read to the end for. Beyond it the read fails. */
export const MAX_ITEMS = 2_000;

/**
 * Reads every page of a list route, in the backend's own order. A list the
 * backend says is longer than MAX_ITEMS fails with an error instead of being
 * returned cut short, since a partial list would pass for the whole one.
 */
export async function fetchAll<T>(
  load: (limit: number, offset: number) => Promise<Page<T>>,
): Promise<readonly T[]> {
  const items: T[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await load(PAGE_SIZE, offset);
    if (page.pagination.total > MAX_ITEMS) {
      throw new ApiError('INTERNAL_ERROR', 'This list is too long to show here. Narrow it down and try again.', null, null);
    }
    items.push(...page.items);
    if (offset + PAGE_SIZE >= page.pagination.total || page.items.length === 0) break;
  }
  return items;
}

/**
 * The academic reads and writes the onboarding flow and My Courses use. Every
 * answer is the backend's: nothing here invents a faculty, programme or course.
 */
export type AcademicApi = {
  readonly faculties: (signal?: AbortSignal) => Promise<readonly Faculty[]>;
  readonly departments: (facultyId: string, signal?: AbortSignal) => Promise<readonly Department[]>;
  readonly programmes: (departmentId: string, signal?: AbortSignal) => Promise<readonly Programme[]>;
  readonly courses: (departmentId: string, signal?: AbortSignal) => Promise<readonly Course[]>;
  readonly getProfile: (signal?: AbortSignal) => Promise<AcademicProfile>;
  /** Pass a signal so a save that hasn't left the device can be cancelled. */
  readonly saveProfile: (update: AcademicProfileUpdate, signal?: AbortSignal) => Promise<AcademicProfile>;
};

export function createAcademicApi(client: ApiClient, tenantSlug: string): AcademicApi {
  const header = { 'X-Tenant-Slug': tenantSlug };
  return {
    faculties: (signal) =>
      fetchAll((limit, offset) =>
        callPage(client.GET('/catalogue/faculties', { params: { header, query: { limit, offset } }, signal })),
      ),
    departments: (facultyId, signal) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/catalogue/departments', {
            params: { header, query: { faculty_id: facultyId, limit, offset } },
            signal,
          }),
        ),
      ),
    programmes: (departmentId, signal) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/catalogue/programmes', {
            params: { header, query: { department_id: departmentId, limit, offset } },
            signal,
          }),
        ),
      ),
    courses: (departmentId, signal) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/catalogue/courses', {
            params: { header, query: { department_id: departmentId, limit, offset } },
            signal,
          }),
        ),
      ),
    getProfile: (signal) => call(client.GET('/academic/profile', { params: { header }, signal })),
    saveProfile: (update, signal) =>
      call(client.PUT('/academic/profile', { params: { header }, body: update, signal })),
  };
}

/** Levels a programme runs for: one per year, 100 to 600 (the contract's range). */
export function levelsFor(programme: Pick<Programme, 'duration_years'> | null): readonly number[] {
  const years = programme ? Math.min(Math.max(programme.duration_years, 1), 6) : 6;
  return Array.from({ length: years }, (_, i) => (i + 1) * 100);
}

/** The most courses one profile can hold (AcademicProfileUpdate.course_ids). */
export const MAX_PROFILE_COURSES = 30;
