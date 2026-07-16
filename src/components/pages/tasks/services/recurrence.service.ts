import { Injectable } from '@angular/core';
import {
  CalendarOccurrence,
  ComputedTask,
  MassageSchedule,
  TaskDefinition,
  TaskMutableState,
  TaskRecurrence,
  TaskState,
  UrgencyLevel,
  Weekday,
} from '../models';
import { MASSAGE_SCHEDULE, allMassageUseDays } from '../config/task-access.config';
import {
  MS_PER_DAY,
  MS_PER_HOUR,
  addCalendarDays,
  isoDay,
  parseIso,
  sameLocalDay,
  startOfDay,
} from '../utils/date.util';

/** Tunable thresholds for the gradual urgency system (in days / hours). */
const DUE_SOON_DAYS = 2;
const ATTENTION_DAYS = 4;
const RECENT_HOURS = 24;

/** state → coarse urgency level + sort rank (lower sorts first). */
const STATE_META: Record<TaskState, { urgency: UrgencyLevel; rank: number }> = {
  overdue: { urgency: 'critical', rank: 0 },
  dueToday: { urgency: 'critical', rank: 10 },
  checkDue: { urgency: 'warning', rank: 12 },
  dueSoon: { urgency: 'warning', rank: 20 },
  attention: { urgency: 'attention', rank: 25 },
  upcoming: { urgency: 'neutral', rank: 30 },
  eventActionable: { urgency: 'warning', rank: 40 },
  waitingForEvent: { urgency: 'waiting', rank: 50 },
  adHoc: { urgency: 'neutral', rank: 52 },
  recentlyCompleted: { urgency: 'completed', rank: 60 },
  seasonalInactive: { urgency: 'seasonal', rank: 70 },
};

/**
 * Central, deterministic recurrence + urgency engine.
 *
 * Every method is a pure function of its inputs and an explicit `now`, so the
 * logic is independently unit-testable without Angular. Nothing here reads the
 * clock or storage. The massage-room weekday schedule is the only external
 * dependency and can be overridden (see {@link schedule}).
 */
@Injectable({ providedIn: 'root' })
export class RecurrenceService {
  /** Overridable in tests; defaults to the configured massage-room schedule. */
  schedule: MassageSchedule = MASSAGE_SCHEDULE;

  /** Derive the full view state for a task at `now`. */
  compute(def: TaskDefinition, state: TaskMutableState, now: Date): ComputedTask {
    const r = def.recurrence;
    const last = parseIso(state.lastCompletedAt);
    const recent =
      last !== null && now.getTime() - last.getTime() < RECENT_HOURS * MS_PER_HOUR;

    let result: { state: TaskState; nextDueAt: string | null; currentZone?: string };

    switch (r.kind) {
      case 'fixedInterval':
        result = this.intervalStates(r.intervalDays, last, now, recent);
        break;
      case 'checkInterval':
        result = this.asCheck(this.intervalStates(r.intervalDays, last, now, recent));
        break;
      case 'rotating': {
        result = this.intervalStates(r.intervalDays, last, now, recent);
        result.currentZone = r.zones.length
          ? r.zones[((state.rotationIndex % r.zones.length) + r.zones.length) % r.zones.length]
          : undefined;
        break;
      }
      case 'seasonalInterval':
        result = this.seasonalStates(r, last, now, recent);
        break;
      case 'scheduledWeekdays':
        result = this.weekdayStates(r, last, now, recent);
        break;
      case 'eventTriggered':
        result = this.eventStates(state, recent);
        break;
      case 'eventWithFollowUp':
        result = this.eventFollowUpStates(r.followUpDays, state, last, now, recent);
        break;
      case 'adHoc':
        result = this.adHocStates(state, now, recent);
        break;
      default:
        result = { state: 'upcoming', nextDueAt: null };
    }

    const meta = STATE_META[result.state];
    return {
      state: result.state,
      urgency: meta.urgency,
      nextDueAt: result.nextDueAt,
      actionable: result.state !== 'seasonalInactive',
      sortRank: meta.rank,
      currentZone: result.currentZone,
    };
  }

  // ---- per-kind logic ----------------------------------------------------

  private intervalStates(
    intervalDays: number,
    last: Date | null,
    now: Date,
    recent: boolean,
  ): { state: TaskState; nextDueAt: string | null } {
    if (!Number.isFinite(intervalDays) || intervalDays <= 0) {
      // Invalid interval → never overdue, surface as optional.
      return { state: 'adHoc', nextDueAt: null };
    }
    const nextDue = last ? new Date(last.getTime() + intervalDays * MS_PER_DAY) : now;
    const remaining = nextDue.getTime() - now.getTime();
    const soonMs = DUE_SOON_DAYS * MS_PER_DAY;

    let state: TaskState;
    if (recent && remaining > soonMs) {
      state = 'recentlyCompleted';
    } else if (remaining < 0 && !sameLocalDay(nextDue, now)) {
      state = 'overdue';
    } else if (sameLocalDay(nextDue, now)) {
      state = 'dueToday';
    } else if (remaining <= soonMs) {
      state = 'dueSoon';
    } else if (remaining <= ATTENTION_DAYS * MS_PER_DAY || remaining <= intervalDays * 0.2 * MS_PER_DAY) {
      state = 'attention';
    } else {
      state = 'upcoming';
    }
    return { state, nextDueAt: nextDue.toISOString() };
  }

  private asCheck(res: { state: TaskState; nextDueAt: string | null }): {
    state: TaskState;
    nextDueAt: string | null;
  } {
    if (res.state === 'overdue' || res.state === 'dueToday' || res.state === 'dueSoon') {
      return { state: 'checkDue', nextDueAt: res.nextDueAt };
    }
    return res;
  }

  private seasonalStates(
    r: Extract<TaskRecurrence, { kind: 'seasonalInterval' }>,
    last: Date | null,
    now: Date,
    recent: boolean,
  ): { state: TaskState; nextDueAt: string | null } {
    const month = now.getMonth() + 1;
    if (r.activeMonths && !r.activeMonths.includes(month)) {
      return {
        state: 'seasonalInactive',
        nextDueAt: this.nextActiveMonthStart(now, r.activeMonths)?.toISOString() ?? null,
      };
    }
    let interval = r.baseIntervalDays;
    for (const override of r.seasonalOverrides ?? []) {
      if (override.months.includes(month)) interval = override.intervalDays;
    }
    return this.intervalStates(interval, last, now, recent);
  }

  private weekdayStates(
    r: Extract<TaskRecurrence, { kind: 'scheduledWeekdays' }>,
    last: Date | null,
    now: Date,
    recent: boolean,
  ): { state: TaskState; nextDueAt: string | null } {
    const weekdays = this.resolveWeekdays(r);
    if (weekdays.length === 0) {
      return { state: 'adHoc', nextDueAt: null };
    }
    const prevOcc = this.occurrenceOnOrBefore(now, weekdays);
    const nextOcc = this.occurrenceAfter(now, weekdays);
    const doneForPrev =
      last !== null && startOfDay(last).getTime() >= startOfDay(prevOcc).getTime();

    if (recent && doneForPrev) {
      return { state: 'recentlyCompleted', nextDueAt: nextOcc.toISOString() };
    }
    if (!doneForPrev) {
      if (sameLocalDay(prevOcc, now)) {
        return { state: 'dueToday', nextDueAt: startOfDay(now).toISOString() };
      }
      return { state: 'overdue', nextDueAt: prevOcc.toISOString() };
    }
    const remaining = nextOcc.getTime() - now.getTime();
    if (remaining <= DUE_SOON_DAYS * MS_PER_DAY) {
      return { state: 'dueSoon', nextDueAt: nextOcc.toISOString() };
    }
    return { state: 'upcoming', nextDueAt: nextOcc.toISOString() };
  }

  private eventStates(
    state: TaskMutableState,
    recent: boolean,
  ): { state: TaskState; nextDueAt: string | null } {
    if (recent) return { state: 'recentlyCompleted', nextDueAt: null };
    if (state.openTrigger) {
      return { state: 'eventActionable', nextDueAt: state.openTrigger.triggeredAt };
    }
    return { state: 'waitingForEvent', nextDueAt: null };
  }

  private eventFollowUpStates(
    followUpDays: number,
    state: TaskMutableState,
    last: Date | null,
    now: Date,
    recent: boolean,
  ): { state: TaskState; nextDueAt: string | null } {
    const followDue = last ? new Date(last.getTime() + followUpDays * MS_PER_DAY) : null;
    if (recent) {
      return { state: 'recentlyCompleted', nextDueAt: followDue?.toISOString() ?? null };
    }
    if (state.openTrigger) {
      return { state: 'eventActionable', nextDueAt: state.openTrigger.triggeredAt };
    }
    if (followDue) {
      if (now.getTime() >= followDue.getTime()) {
        return { state: 'checkDue', nextDueAt: followDue.toISOString() };
      }
      return { state: 'upcoming', nextDueAt: followDue.toISOString() };
    }
    return { state: 'waitingForEvent', nextDueAt: null };
  }

  private adHocStates(
    state: TaskMutableState,
    now: Date,
    recent: boolean,
  ): { state: TaskState; nextDueAt: string | null } {
    if (recent) return { state: 'recentlyCompleted', nextDueAt: null };
    const planned = parseIso(state.plannedDate);
    if (planned) {
      if (sameLocalDay(planned, now)) {
        return { state: 'dueToday', nextDueAt: startOfDay(now).toISOString() };
      }
      if (startOfDay(planned).getTime() > startOfDay(now).getTime()) {
        return { state: 'upcoming', nextDueAt: planned.toISOString() };
      }
      // Planned day has passed without action: ad-hoc tasks never become
      // overdue, so it reverts to the optional/flexible group (still surfaced
      // in the calendar's flexible lane) rather than a past due date that
      // would fall out of the visible week entirely.
    }
    return { state: 'adHoc', nextDueAt: null };
  }

  // ---- weekday helpers ---------------------------------------------------

  /** Resolve the effective weekdays for a scheduled-weekday recurrence. */
  resolveWeekdays(r: Extract<TaskRecurrence, { kind: 'scheduledWeekdays' }>): Weekday[] {
    if (r.useDayGroup === 'all') {
      return allMassageUseDays(this.schedule) as Weekday[];
    }
    return r.weekdays ?? [];
  }

  private occurrenceOnOrBefore(from: Date, weekdays: Weekday[]): Date {
    const start = startOfDay(from);
    for (let i = 0; i < 7; i++) {
      const d = addCalendarDays(start, -i);
      if (weekdays.includes(d.getDay() as Weekday)) return d;
    }
    return start;
  }

  private occurrenceAfter(from: Date, weekdays: Weekday[]): Date {
    const start = startOfDay(from);
    for (let i = 1; i <= 7; i++) {
      const d = addCalendarDays(start, i);
      if (weekdays.includes(d.getDay() as Weekday)) return d;
    }
    return addCalendarDays(start, 7);
  }

  private nextActiveMonthStart(from: Date, activeMonths: number[]): Date | null {
    for (let i = 1; i <= 12; i++) {
      const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
      if (activeMonths.includes(d.getMonth() + 1)) return d;
    }
    return null;
  }

  // ---- calendar occurrences ---------------------------------------------

  /**
   * Occurrences of a task within [rangeStart, rangeEnd] (inclusive local days),
   * used to place task entries in the weekly calendar. Recurrence types that do
   * not produce a date add no `due` markers — no calendar dates are invented.
   */
  occurrencesInRange(
    def: TaskDefinition,
    state: TaskMutableState,
    computed: ComputedTask,
    rangeStart: Date,
    rangeEnd: Date,
    now: Date,
  ): CalendarOccurrence[] {
    const out: CalendarOccurrence[] = [];
    const start = startOfDay(rangeStart);
    const end = startOfDay(rangeEnd);
    const inRange = (d: Date) => {
      const t = startOfDay(d).getTime();
      return t >= start.getTime() && t <= end.getTime();
    };

    // Completed marker on the day it was last done.
    const last = parseIso(state.lastCompletedAt);
    const completedDays = new Set<string>();
    if (last && inRange(last)) {
      const key = isoDay(last);
      completedDays.add(key);
      out.push({ date: key, kind: 'completed' });
    }

    const r = def.recurrence;
    if (r.kind === 'scheduledWeekdays') {
      const weekdays = this.resolveWeekdays(r);
      for (let i = 0; i <= 366; i++) {
        const d = addCalendarDays(start, i);
        if (d.getTime() > end.getTime()) break;
        if (weekdays.includes(d.getDay() as Weekday) && !completedDays.has(isoDay(d))) {
          out.push({ date: isoDay(d), kind: 'due' });
        }
      }
      return out;
    }

    if (r.kind === 'eventTriggered' || r.kind === 'eventWithFollowUp') {
      if (state.openTrigger) {
        const t = parseIso(state.openTrigger.triggeredAt);
        if (t && inRange(t)) out.push({ date: isoDay(t), kind: 'event' });
      }
      if (r.kind === 'eventWithFollowUp' && computed.nextDueAt) {
        const d = parseIso(computed.nextDueAt);
        if (d && inRange(d)) out.push({ date: isoDay(d), kind: 'check' });
      }
      return out;
    }

    if (computed.state === 'seasonalInactive') return out;

    // Fixed / check / seasonal / rotating / ad-hoc with a concrete next due.
    if (computed.nextDueAt) {
      const due = parseIso(computed.nextDueAt);
      if (due && inRange(due) && !completedDays.has(isoDay(due))) {
        const kind = r.kind === 'checkInterval' || computed.state === 'checkDue' ? 'check' : 'due';
        out.push({ date: isoDay(due), kind });
      }
    }
    return out;
  }

  /** Human-readable recurrence description for cards and details. */
  describeRecurrence(def: TaskDefinition, lang: 'de' | 'en'): string {
    const r = def.recurrence;
    const de = lang === 'de';
    switch (r.kind) {
      case 'fixedInterval':
        return this.describeInterval(r.intervalDays, de, false);
      case 'checkInterval':
        return de
          ? `Kontrolle alle ${this.days(r.intervalDays, de)}`
          : `Inspection every ${this.days(r.intervalDays, de)}`;
      case 'rotating':
        return de
          ? `Rotation alle ${this.days(r.intervalDays, de)}`
          : `Rotation every ${this.days(r.intervalDays, de)}`;
      case 'seasonalInterval': {
        if (r.activeMonths) {
          return de
            ? `Saisonal, alle ${this.days(r.baseIntervalDays, de)}`
            : `Seasonal, every ${this.days(r.baseIntervalDays, de)}`;
        }
        return de
          ? `Alle ${this.days(r.baseIntervalDays, de)} (saisonal angepasst)`
          : `Every ${this.days(r.baseIntervalDays, de)} (seasonally adjusted)`;
      }
      case 'scheduledWeekdays':
        return this.describeWeekdays(r, de);
      case 'eventTriggered':
        return this.describeEvent(r.event, de);
      case 'eventWithFollowUp':
        return de
          ? `${this.describeEvent(r.event, de)}, Nachkontrolle nach ${this.days(r.followUpDays, de)}`
          : `${this.describeEvent(r.event, de)}, recheck after ${this.days(r.followUpDays, de)}`;
      case 'adHoc':
        return de ? 'Bei Gelegenheit' : 'When quiet';
      default:
        return '';
    }
  }

  private describeInterval(days: number, de: boolean, _check: boolean): string {
    if (days < 1) {
      const hours = Math.round(days * 24);
      return de ? `Alle ${hours} Stunden` : `Every ${hours} hours`;
    }
    return de ? `Alle ${this.days(days, de)}` : `Every ${this.days(days, de)}`;
  }

  private days(days: number, de: boolean): string {
    if (days < 1) {
      const hours = Math.round(days * 24);
      return de ? `${hours} Std.` : `${hours}h`;
    }
    const whole = Math.floor(days);
    const halfDay = days - whole >= 0.25;
    const label = de ? (whole === 1 ? 'Tag' : 'Tage') : whole === 1 ? 'day' : 'days';
    if (halfDay) {
      return de ? `${whole},5 ${label}` : `${whole}.5 ${label}`;
    }
    return `${whole} ${label}`;
  }

  private describeWeekdays(
    r: Extract<TaskRecurrence, { kind: 'scheduledWeekdays' }>,
    de: boolean,
  ): string {
    const names = de
      ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdays = this.resolveWeekdays(r).map((d) => names[d]);
    const phase = r.phase
      ? de
        ? { before: ' (vor der Schicht)', during: ' (während der Nutzung)', after: ' (nach der Schicht)' }[r.phase]
        : { before: ' (before shift)', during: ' (during use)', after: ' (after shift)' }[r.phase]
      : '';
    const base = de ? `An Nutzungstagen: ${weekdays.join(', ')}` : `On use days: ${weekdays.join(', ')}`;
    return base + phase;
  }

  private describeEvent(event: string, de: boolean): string {
    const map: Record<string, { de: string; en: string }> = {
      client: { de: 'Nach jedem Kunden', en: 'After each client' },
      use: { de: 'Nach jeder Nutzung', en: 'After each use' },
      treatment: { de: 'Nach jeder Behandlung', en: 'After each treatment' },
    };
    const entry = map[event] ?? { de: 'Nach Ereignis', en: 'After event' };
    return de ? entry.de : entry.en;
  }
}
