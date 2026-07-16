/**
 * Small, dependency-free date helpers. All "calendar day" reasoning is done in
 * the viewer's local time; timestamps are stored as ISO 8601 (UTC) elsewhere.
 */

export const MS_PER_DAY = 86_400_000;
export const MS_PER_HOUR = 3_600_000;

/** Fixed-duration offset (24h × days). Correct for interval *timing*. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/**
 * Local calendar-day offset (DST-safe): the same wall-clock components shifted
 * by `n` whole days. Use this for *calendar* reasoning (weekday resolution,
 * week grids) so a 23/25-hour DST day never shifts the day by one.
 */
export function addCalendarDays(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

/** Local start-of-day (00:00) for the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Local yyyy-mm-dd key (stable for grouping calendar occurrences by day). */
export function isoDay(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Monday-based start of the week containing `date` (local). */
export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sun … 6 = Sat
  const diff = (day + 6) % 7; // days since Monday
  return addCalendarDays(d, -diff);
}

/** The seven local dates of the week starting at `weekStart`. */
export function weekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addCalendarDays(weekStart, i));
}

/** Safe ISO parse — returns null for missing or invalid dates. */
export function parseIso(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const LOCALE: Record<'de' | 'en', string> = { de: 'de-DE', en: 'en-GB' };

/** Local date + time, e.g. "16.07.2026, 14:32" (exact, for tooltips/labels). */
export function formatDateTime(iso: string, lang: 'de' | 'en'): string {
  const d = parseIso(iso);
  if (!d) return '';
  return new Intl.DateTimeFormat(LOCALE[lang], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

/** Local date only, e.g. "16 Jul 2026". */
export function formatDate(iso: string, lang: 'de' | 'en'): string {
  const d = parseIso(iso);
  if (!d) return '';
  return new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: 'medium' }).format(d);
}

/** Short weekday + day number for calendar headers, e.g. "Mi 16". */
export function formatDayHeader(date: Date, lang: 'de' | 'en'): { weekday: string; day: string } {
  const weekday = new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short' }).format(date);
  return { weekday, day: `${date.getDate()}` };
}

/**
 * Human relative time ("2 hours ago", "in 3 days"). Coarse by design — the
 * exact timestamp stays available in a tooltip/secondary label.
 */
export function relativeTime(iso: string, now: Date, lang: 'de' | 'en'): string {
  const d = parseIso(iso);
  if (!d) return '';
  const diffMs = d.getTime() - now.getTime();
  const past = diffMs < 0;
  const abs = Math.abs(diffMs);
  const mins = Math.round(abs / 60_000);
  const hours = Math.round(abs / MS_PER_HOUR);
  const days = Math.round(abs / MS_PER_DAY);

  let value: number;
  let unitDe: string;
  let unitEn: string;
  if (mins < 1) {
    return lang === 'de' ? 'gerade eben' : 'just now';
  } else if (mins < 60) {
    value = mins;
    unitDe = mins === 1 ? 'Minute' : 'Minuten';
    unitEn = mins === 1 ? 'minute' : 'minutes';
  } else if (hours < 24) {
    value = hours;
    unitDe = hours === 1 ? 'Stunde' : 'Stunden';
    unitEn = hours === 1 ? 'hour' : 'hours';
  } else {
    value = days;
    unitDe = days === 1 ? 'Tag' : 'Tagen';
    unitEn = days === 1 ? 'day' : 'days';
  }

  if (lang === 'de') {
    return past ? `vor ${value} ${unitDe}` : `in ${value} ${unitDe}`;
  }
  return past ? `${value} ${unitEn} ago` : `in ${value} ${unitEn}`;
}
