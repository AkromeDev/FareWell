import { RecurrenceService } from './recurrence.service';
import {
  MassageSchedule,
  TaskDefinition,
  TaskMutableState,
  TaskRecurrence,
  createMutableState,
  rec,
} from '../models';
import { MS_PER_DAY } from '../utils/date.util';

const NOW = new Date('2026-07-16T10:00:00'); // local

function def(recurrence: TaskRecurrence, overrides: Partial<TaskDefinition> = {}): TaskDefinition {
  return {
    id: 't1',
    nameDe: 'Testaufgabe',
    nameEn: 'Test task',
    category: 'laserraum',
    type: 'general',
    eligibleUsers: ['mojo'],
    recurrence,
    active: true,
    sourcePlanId: 'p',
    sourcePlanVersion: '1',
    ...overrides,
  };
}

function state(overrides: Partial<TaskMutableState> = {}): TaskMutableState {
  return { ...createMutableState('t1'), ...overrides };
}

function daysAgo(n: number): string {
  return new Date(NOW.getTime() - n * MS_PER_DAY).toISOString();
}

describe('RecurrenceService', () => {
  let svc: RecurrenceService;

  beforeEach(() => {
    svc = new RecurrenceService();
  });

  describe('fixed interval (whole days)', () => {
    it('is overdue when last completion is older than the interval', () => {
      const c = svc.compute(def(rec.fixed(7)), state({ lastCompletedAt: daysAgo(9) }), NOW);
      expect(c.state).toBe('overdue');
      expect(c.urgency).toBe('critical');
    });

    it('is upcoming well before the due date', () => {
      const c = svc.compute(def(rec.fixed(30)), state({ lastCompletedAt: daysAgo(3) }), NOW);
      expect(c.state).toBe('upcoming');
    });

    it('treats a never-completed task as due today (not overdue)', () => {
      const c = svc.compute(def(rec.fixed(30)), state(), NOW);
      expect(c.state).toBe('dueToday');
    });
  });

  describe('decimal-comma intervals', () => {
    it('0,5 days = 12 hours from last completion', () => {
      const last = new Date('2026-07-16T00:00:00');
      const c = svc.compute(def(rec.fixed(0.5)), state({ lastCompletedAt: last.toISOString() }), NOW);
      const expected = new Date(last.getTime() + 12 * 3_600_000).toISOString();
      expect(c.nextDueAt).toBe(expected);
    });

    it('3,5 days = 3 days and 12 hours (no rounding)', () => {
      const last = new Date('2026-07-13T10:00:00');
      const c = svc.compute(def(rec.fixed(3.5)), state({ lastCompletedAt: last.toISOString() }), NOW);
      const expected = new Date(last.getTime() + 3.5 * MS_PER_DAY).toISOString();
      expect(c.nextDueAt).toBe(expected);
    });
  });

  describe('event-triggered (after client / use / treatment)', () => {
    for (const event of ['client', 'use', 'treatment'] as const) {
      it(`"after ${event}" waits for the event and is never overdue`, () => {
        const c = svc.compute(def(rec.event(event)), state(), NOW);
        expect(c.state).toBe('waitingForEvent');
        expect(c.nextDueAt).toBeNull();
        expect(c.actionable).toBeTrue();
      });
    }

    it('becomes actionable once an event occurrence is recorded', () => {
      const st = state({
        openTrigger: { id: 'o', taskId: 't1', event: 'use', triggeredAt: NOW.toISOString(), triggeredBy: 'mojo' },
      });
      const c = svc.compute(def(rec.event('use')), st, NOW);
      expect(c.state).toBe('eventActionable');
    });
  });

  describe('scheduled weekdays (on use days)', () => {
    it('resolves useDayGroup "all" to the configured Mon/Wed/Thu', () => {
      const schedule: MassageSchedule = { useDaysByUser: { annasun: [1, 3], nikkita: [4] } };
      svc.schedule = schedule;
      const weekdays = svc.resolveWeekdays({ kind: 'scheduledWeekdays', useDayGroup: 'all' });
      expect(weekdays).toEqual([1, 3, 4]);
    });

    it('is due today when today is a use day and not yet done', () => {
      const c = svc.compute(def(rec.weekdays({ weekdays: [NOW.getDay() as 0] })), state(), NOW);
      expect(c.state).toBe('dueToday');
    });

    it('is overdue when a past use day was missed', () => {
      const yesterday = ((NOW.getDay() + 6) % 7) as 0;
      const c = svc.compute(def(rec.weekdays({ weekdays: [yesterday] })), state(), NOW);
      expect(c.state).toBe('overdue');
    });
  });

  describe('check interval (check 30)', () => {
    it('labels a past-due inspection as checkDue, not overdue', () => {
      const c = svc.compute(def(rec.check(30)), state({ lastCompletedAt: daysAgo(31) }), NOW);
      expect(c.state).toBe('checkDue');
    });
  });

  describe('event with follow-up (after use, recheck 1)', () => {
    it('schedules a recheck one day after the last completion', () => {
      const last = daysAgo(2);
      const c = svc.compute(def(rec.eventFollowUp('use', 1)), state({ lastCompletedAt: last }), NOW);
      expect(c.state).toBe('checkDue');
      const expected = new Date(new Date(last).getTime() + 1 * MS_PER_DAY).toISOString();
      expect(c.nextDueAt).toBe(expected);
    });
  });

  describe('seasonal rules', () => {
    it('halves winter watering frequency (Nov–Feb → 14 days)', () => {
      const winterNow = new Date('2026-01-15T10:00:00');
      const r = rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] });
      const last = new Date('2026-01-05T10:00:00');
      const c = svc.compute(def(r), state({ lastCompletedAt: last.toISOString() }), winterNow);
      const expected = new Date(last.getTime() + 14 * MS_PER_DAY).toISOString();
      expect(c.nextDueAt).toBe(expected);
    });

    it('uses the base interval in summer', () => {
      const summerNow = new Date('2026-07-16T10:00:00');
      const r = rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] });
      const last = new Date('2026-07-06T10:00:00');
      const c = svc.compute(def(r), state({ lastCompletedAt: last.toISOString() }), summerNow);
      const expected = new Date(last.getTime() + 7 * MS_PER_DAY).toISOString();
      expect(c.nextDueAt).toBe(expected);
    });

    it('fertilizing is seasonally inactive outside Apr–Sep', () => {
      const janNow = new Date('2026-01-15T10:00:00');
      const r = rec.seasonal(21, { activeMonths: [4, 5, 6, 7, 8, 9] });
      const c = svc.compute(def(r), state(), janNow);
      expect(c.state).toBe('seasonalInactive');
      expect(c.actionable).toBeFalse();
    });

    it('fertilizing is active in season', () => {
      const mayNow = new Date('2026-05-15T10:00:00');
      const r = rec.seasonal(21, { activeMonths: [4, 5, 6, 7, 8, 9] });
      const c = svc.compute(def(r), state({ lastCompletedAt: daysAgo(30) }), mayNow);
      expect(c.state).not.toBe('seasonalInactive');
    });
  });

  describe('ad-hoc and rotating', () => {
    it('ad-hoc tasks stay optional and never overdue', () => {
      const c = svc.compute(def(rec.adHoc()), state(), NOW);
      expect(c.state).toBe('adHoc');
      expect(c.nextDueAt).toBeNull();
    });

    it('ad-hoc planned for today is due today', () => {
      const c = svc.compute(def(rec.adHoc()), state({ plannedDate: NOW.toISOString() }), NOW);
      expect(c.state).toBe('dueToday');
    });

    it('ad-hoc with a future planned date is upcoming', () => {
      const future = new Date(NOW.getTime() + 3 * MS_PER_DAY).toISOString();
      const c = svc.compute(def(rec.adHoc()), state({ plannedDate: future }), NOW);
      expect(c.state).toBe('upcoming');
    });

    it('ad-hoc with a past planned date reverts to optional (never overdue, stays surfaced)', () => {
      const past = new Date(NOW.getTime() - 5 * MS_PER_DAY).toISOString();
      const c = svc.compute(def(rec.adHoc()), state({ plannedDate: past }), NOW);
      expect(c.state).toBe('adHoc');
      expect(c.nextDueAt).toBeNull();
    });

    it('rotating tasks expose the current zone by rotation index', () => {
      const zones = ['A', 'B', 'C'];
      const c0 = svc.compute(def(rec.rotating(7, zones)), state({ rotationIndex: 0 }), NOW);
      const c1 = svc.compute(def(rec.rotating(7, zones)), state({ rotationIndex: 1 }), NOW);
      expect(c0.currentZone).toBe('A');
      expect(c1.currentZone).toBe('B');
    });
  });

  describe('robustness', () => {
    it('invalid interval never becomes overdue', () => {
      const c = svc.compute(def(rec.fixed(0)), state({ lastCompletedAt: daysAgo(100) }), NOW);
      expect(c.state).toBe('adHoc');
      expect(c.nextDueAt).toBeNull();
    });
  });
});
