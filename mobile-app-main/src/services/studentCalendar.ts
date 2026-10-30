import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

const KEY = 'build.student-calendar.v1';
export const EVENT_TYPES = ['class', 'study', 'assignment', 'exam'] as const;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const plannerEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().regex(/^[\p{L}\p{N}][\p{L}\p{N}\s&(),.'/:!?+-]{2,79}$/u, 'Enter a title of 3–80 characters.'),
  type: z.enum(EVENT_TYPES),
  date: z.string().regex(datePattern, 'Use YYYY-MM-DD for the date.').refine(value => {
    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime()) && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10));
  }, 'Enter a real calendar date.'),
  allDay: z.boolean(),
  startTime: z.string().regex(timePattern, 'Use HH:MM for the start time.'),
  endTime: z.string().regex(timePattern, 'Use HH:MM for the end time.'),
  courseCode: z.string().trim().max(20).regex(/^$|^[A-Za-z]{2,5}\s?\d{3,4}[A-Za-z]?$/, 'Use a course code like MTH 101.'),
  location: z.string().trim().max(80).default(''),
  notes: z.string().trim().max(500),
}).refine(value => value.allDay || value.endTime > value.startTime, { path: ['endTime'], message: 'End time must be after start time.' });

export type PlannerEvent = z.infer<typeof plannerEventSchema>;

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

export function sortPlannerEvents(events: PlannerEvent[]): PlannerEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || (a.allDay ? '' : a.startTime).localeCompare(b.allDay ? '' : b.startTime));
}

export async function loadPlannerEvents(): Promise<PlannerEvent[]> {
  const saved = await AsyncStorage.getItem(KEY);
  if (!saved) return [];
  return z.array(plannerEventSchema).parse(JSON.parse(saved));
}

export async function savePlannerEvents(events: PlannerEvent[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(z.array(plannerEventSchema).parse(events)));
}
