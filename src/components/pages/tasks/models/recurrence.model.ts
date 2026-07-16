/**
 * Discriminated recurrence model for salon tasks.
 *
 * The attached cleaning plan mixes several *kinds* of recurrence — fixed-day
 * intervals, weekday schedules, event triggers, inspections, seasonal rules
 * and rotations. Each is modelled as its own variant so a rule only ever
 * carries the fields relevant to its `kind`. Urgency and next-due dates are
 * *derived* from these rules (see RecurrenceService) and are never stored as an
 * editable source value.
 */

/** JavaScript `Date.getDay()` convention: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** External events that make an event-triggered task actionable. */
export type TaskEvent = 'client' | 'use' | 'treatment';

/** An alternate interval that applies only during the given calendar months. */
export interface SeasonalOverride {
  /** 1-based months (1 = January … 12 = December). */
  months: number[];
  intervalDays: number;
}

/** Repeat every N days measured from the last completion. Supports decimals. */
export interface FixedIntervalRecurrence {
  kind: 'fixedInterval';
  /** Whole or fractional days, e.g. 1, 7, 0.5 (= 12h), 3.5 (= 3d 12h). */
  intervalDays: number;
}

/** Due on specific weekdays (e.g. massage "on use days"). */
export interface ScheduledWeekdaysRecurrence {
  kind: 'scheduledWeekdays';
  /** Explicit weekdays. Ignored when `useDayGroup` is set. */
  weekdays?: Weekday[];
  /** Resolve weekdays from the configured massage-room schedule at runtime. */
  useDayGroup?: 'all';
  /** Optional distinction used for labels/ordering within a use day. */
  phase?: 'before' | 'during' | 'after';
}

/** Triggered by an external event, not by the calendar. Never "overdue". */
export interface EventTriggeredRecurrence {
  kind: 'eventTriggered';
  event: TaskEvent;
}

/** Present for inspection every N days ("check X"); completion resets it. */
export interface CheckIntervalRecurrence {
  kind: 'checkInterval';
  intervalDays: number;
}

/**
 * Interval recurrence whose behaviour depends on the season.
 * - `activeMonths` set → task is *seasonally inactive* outside those months.
 * - `seasonalOverrides` → alternate interval in the listed months
 *   (e.g. winter watering).
 */
export interface SeasonalIntervalRecurrence {
  kind: 'seasonalInterval';
  baseIntervalDays: number;
  activeMonths?: number[];
  seasonalOverrides?: SeasonalOverride[];
}

/** Perform after each event, plus a follow-up check N days later. */
export interface EventWithFollowUpRecurrence {
  kind: 'eventWithFollowUp';
  event: TaskEvent;
  followUpDays: number;
}

/** Optional, opportunity task ("when quiet"). Never automatically overdue. */
export interface AdHocRecurrence {
  kind: 'adHoc';
}

/** Weekly (or N-day) rotation cycling through a list of zones. */
export interface RotatingRecurrence {
  kind: 'rotating';
  intervalDays: number;
  zones: string[];
}

export type TaskRecurrence =
  | FixedIntervalRecurrence
  | ScheduledWeekdaysRecurrence
  | EventTriggeredRecurrence
  | CheckIntervalRecurrence
  | SeasonalIntervalRecurrence
  | EventWithFollowUpRecurrence
  | AdHocRecurrence
  | RotatingRecurrence;

export type RecurrenceKind = TaskRecurrence['kind'];

/** Concise recurrence-builder helpers used by the seed data. */
export const rec = {
  fixed: (intervalDays: number): FixedIntervalRecurrence => ({
    kind: 'fixedInterval',
    intervalDays,
  }),
  check: (intervalDays: number): CheckIntervalRecurrence => ({
    kind: 'checkInterval',
    intervalDays,
  }),
  event: (event: TaskEvent): EventTriggeredRecurrence => ({
    kind: 'eventTriggered',
    event,
  }),
  eventFollowUp: (event: TaskEvent, followUpDays: number): EventWithFollowUpRecurrence => ({
    kind: 'eventWithFollowUp',
    event,
    followUpDays,
  }),
  weekdays: (
    opts: Omit<ScheduledWeekdaysRecurrence, 'kind'>,
  ): ScheduledWeekdaysRecurrence => ({ kind: 'scheduledWeekdays', ...opts }),
  seasonal: (
    baseIntervalDays: number,
    opts: Omit<SeasonalIntervalRecurrence, 'kind' | 'baseIntervalDays'> = {},
  ): SeasonalIntervalRecurrence => ({
    kind: 'seasonalInterval',
    baseIntervalDays,
    ...opts,
  }),
  adHoc: (): AdHocRecurrence => ({ kind: 'adHoc' }),
  rotating: (intervalDays: number, zones: string[]): RotatingRecurrence => ({
    kind: 'rotating',
    intervalDays,
    zones,
  }),
};
