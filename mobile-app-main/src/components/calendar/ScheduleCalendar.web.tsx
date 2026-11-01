import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { createViewDay, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import 'temporal-polyfill/global';
import '@schedule-x/theme-default/dist/index.css';
import './schedule-calendar.css';
import type { PlannerEvent } from '@/services/studentCalendar';
import { useTheme } from '@/context/ThemeContext';

type Props = { events: PlannerEvent[]; onSelectEvent: (id: string) => void };

const colors = {
  class: { colorName: 'class', lightColors: { main: '#2563EB', container: '#DBEAFE', onContainer: '#173A7A' }, darkColors: { main: '#93B8FF', container: '#284979', onContainer: '#E8F0FF' } },
  study: { colorName: 'study', lightColors: { main: '#0F766E', container: '#DDF5EF', onContainer: '#165A54' }, darkColors: { main: '#68D8C2', container: '#1E514C', onContainer: '#E5FFF9' } },
  assignment: { colorName: 'assignment', lightColors: { main: '#B45309', container: '#FFF1D8', onContainer: '#704008' }, darkColors: { main: '#F1C477', container: '#61492B', onContainer: '#FFF4DB' } },
  exam: { colorName: 'exam', lightColors: { main: '#B54156', container: '#FDE8EC', onContainer: '#7C2434' }, darkColors: { main: '#F2A5B4', container: '#653745', onContainer: '#FFE9ED' } },
};

function toCalendarEvent(event: PlannerEvent) {
  const common = { id: event.id, title: event.courseCode ? `${event.courseCode} · ${event.title}` : event.title, calendarId: event.type, location: event.location };
  if (event.allDay) return { ...common, start: Temporal.PlainDate.from(event.date), end: Temporal.PlainDate.from(event.date) };
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const [year, month, day] = event.date.split('-').map(Number);
  const [startHour, startMinute] = event.startTime.split(':').map(Number);
  const [endHour, endMinute] = event.endTime.split(':').map(Number);
  return {
    ...common,
    start: Temporal.ZonedDateTime.from({ timeZone: zone, year, month, day, hour: startHour, minute: startMinute }),
    end: Temporal.ZonedDateTime.from({ timeZone: zone, year, month, day, hour: endHour, minute: endMinute }),
  };
}

export default function ScheduleCalendar({ events, onSelectEvent }: Props) {
  const { width } = useWindowDimensions();
  const { mode } = useTheme();
  const selectRef = useRef(onSelectEvent);
  selectRef.current = onSelectEvent;
  const [eventsService] = useState(() => createEventsServicePlugin());
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek()],
    locale: 'en-GB',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    defaultView: width < 700 ? 'day' : 'week',
    events: [],
    plugins: [eventsService],
    calendars: colors,
    dayBoundaries: { start: '06:00', end: '22:00' },
    weekOptions: { gridHeight: 1120, gridStep: 60 },
    isResponsive: true,
    callbacks: { onEventClick: event => selectRef.current(String(event.id)) },
  });

  useEffect(() => { eventsService.set(events.map(toCalendarEvent)); }, [events, eventsService]);
  useEffect(() => { calendar?.setTheme(mode); }, [calendar, mode]);

  return <div className={`build-schedule ${mode === 'dark' ? 'build-schedule-dark' : ''}`}><ScheduleXCalendar calendarApp={calendar} /></div>;
}
