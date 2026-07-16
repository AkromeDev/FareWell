import { CalendarItemKind, TaskRecord } from '../models';
import { RecurrenceService } from '../services/recurrence.service';
import { isoDay, parseIso, sameLocalDay, startOfDay, weekDates } from './date.util';

export interface CalendarCell {
  record: TaskRecord;
  kind: CalendarItemKind;
}

export interface CalendarDay {
  date: Date;
  iso: string;
  isToday: boolean;
  isPast: boolean;
  items: CalendarCell[];
}

export interface CalendarWeek {
  days: CalendarDay[];
  /** Overdue (date-based) tasks not shown on a day this week — always visible. */
  overdue: TaskRecord[];
  /** Event/optional tasks with no concrete date this week. */
  flexible: TaskRecord[];
}

const FLEXIBLE_STATES = new Set(['waitingForEvent', 'adHoc', 'eventActionable']);

function cellRank(cell: CalendarCell): number {
  return cell.kind === 'completed' ? 1 : 0;
}

/**
 * Build the weekly calendar model from the shared records. Uses the recurrence
 * engine to place each task on its real occurrences; recurrence types with no
 * date add no day entries (dates are never invented). Overdue and event/optional
 * tasks are surfaced in dedicated lanes so nothing is lost.
 */
export function buildWeek(
  records: TaskRecord[],
  weekStart: Date,
  now: Date,
  recurrence: RecurrenceService,
): CalendarWeek {
  const dates = weekDates(weekStart);
  const rangeStart = dates[0];
  const rangeEnd = dates[6];
  const todayStart = startOfDay(now);

  const dayCells = new Map<string, CalendarCell[]>();
  for (const d of dates) dayCells.set(isoDay(d), []);

  const overdue: TaskRecord[] = [];
  const flexible: TaskRecord[] = [];

  for (const r of records) {
    if (r.computed.state === 'seasonalInactive') continue;

    const occurrences = recurrence.occurrencesInRange(
      r.def,
      r.state,
      r.computed,
      rangeStart,
      rangeEnd,
      now,
    );

    let placed = false;
    for (const o of occurrences) {
      const cells = dayCells.get(o.date);
      if (cells) {
        cells.push({ record: r, kind: o.kind });
        placed = true;
      }
    }

    const dueDate = parseIso(r.computed.nextDueAt);
    const isOverdue =
      r.computed.state === 'overdue' ||
      (r.computed.state === 'checkDue' && dueDate !== null && dueDate.getTime() < todayStart.getTime());

    if (isOverdue && !placed) {
      overdue.push(r);
    } else if (!placed && FLEXIBLE_STATES.has(r.computed.state)) {
      flexible.push(r);
    }
  }

  for (const cells of dayCells.values()) {
    cells.sort((a, b) => cellRank(a) - cellRank(b) || a.record.computed.sortRank - b.record.computed.sortRank);
  }

  const days: CalendarDay[] = dates.map((date) => ({
    date,
    iso: isoDay(date),
    isToday: sameLocalDay(date, now),
    isPast: startOfDay(date).getTime() < todayStart.getTime(),
    items: dayCells.get(isoDay(date)) ?? [],
  }));

  overdue.sort((a, b) => a.computed.sortRank - b.computed.sortRank);

  return { days, overdue, flexible };
}
