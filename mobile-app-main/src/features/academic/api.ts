import { call, callPage, type ApiClient } from '@/api/client';
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
/** Stops a misbehaving list from looping forever. */
const MAX_ITEMS = 2_000;

/** Reads every page of a list route, in the backend's own order. */
export async function fetchAll<T>(
  load: (limit: number, offset: number) => Promise<Page<T>>,
): Promise<readonly T[]> {
  const items: T[] = [];
  for (let offset = 0; offset < MAX_ITEMS; offset += PAGE_SIZE) {
    const page = await load(PAGE_SIZE, offset);
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
  readonly faculties: () => Promise<readonly Faculty[]>;
  readonly departments: (facultyId: string) => Promise<readonly Department[]>;
  readonly programmes: (departmentId: string) => Promise<readonly Programme[]>;
  readonly courses: (departmentId: string) => Promise<readonly Course[]>;
  readonly getProfile: () => Promise<AcademicProfile>;
  readonly saveProfile: (update: AcademicProfileUpdate) => Promise<AcademicProfile>;
};

export function createAcademicApi(client: ApiClient, tenantSlug: string): AcademicApi {
  const header = { 'X-Tenant-Slug': tenantSlug };
  return {
    faculties: () =>
      fetchAll((limit, offset) =>
        callPage(client.GET('/catalogue/faculties', { params: { header, query: { limit, offset } } })),
      ),
    departments: (facultyId) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/catalogue/departments', {
            params: { header, query: { faculty_id: facultyId, limit, offset } },
          }),
        ),
      ),
    programmes: (departmentId) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/catalogue/programmes', {
            params: { header, query: { department_id: departmentId, limit, offset } },
          }),
        ),
      ),
    courses: (departmentId) =>
      fetchAll((limit, offset) =>
        callPage(
          client.GET('/catalogue/courses', {
            params: { header, query: { department_id: departmentId, limit, offset } },
          }),
        ),
      ),
    getProfile: () => call(client.GET('/academic/profile', { params: { header } })),
    saveProfile: (update) => call(client.PUT('/academic/profile', { params: { header }, body: update })),
  };
}

/** Levels a programme runs for: one per year, 100 to 600 (the contract's range). */
export function levelsFor(programme: Pick<Programme, 'duration_years'> | null): readonly number[] {
  const years = programme ? Math.min(Math.max(programme.duration_years, 1), 6) : 6;
  return Array.from({ length: years }, (_, i) => (i + 1) * 100);
}

/** The most courses one profile can hold (AcademicProfileUpdate.course_ids). */
export const MAX_PROFILE_COURSES = 30;
