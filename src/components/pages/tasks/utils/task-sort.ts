import { TaskCategory, TaskRecord } from '../models';

/**
 * Order tasks by urgency (sortRank) then by soonest next due, then by the
 * category display order, then name. Deterministic and stable.
 */
export function sortByUrgency(records: TaskRecord[]): TaskRecord[] {
  return [...records].sort((a, b) => {
    if (a.computed.sortRank !== b.computed.sortRank) {
      return a.computed.sortRank - b.computed.sortRank;
    }
    const an = a.computed.nextDueAt;
    const bn = b.computed.nextDueAt;
    if (an && bn && an !== bn) return an < bn ? -1 : 1;
    if (an && !bn) return -1;
    if (!an && bn) return 1;
    const ao = a.def.displayOrder ?? 9999;
    const bo = b.def.displayOrder ?? 9999;
    if (ao !== bo) return ao - bo;
    // German is the primary language; comparing one fixed language keeps the
    // order stable across the DE/EN toggle.
    return a.def.nameDe.localeCompare(b.def.nameDe, 'de');
  });
}

export interface CategoryGroup {
  category: TaskCategory;
  records: TaskRecord[];
  /** Count of records needing attention (overdue / due today / due soon / check). */
  urgentCount: number;
}

const URGENT_STATES = new Set(['overdue', 'dueToday', 'dueSoon', 'checkDue', 'eventActionable']);

/** Group records into their categories (empty categories are dropped). */
export function groupByCategory(
  records: TaskRecord[],
  categories: TaskCategory[],
): CategoryGroup[] {
  const byCat = new Map<string, TaskRecord[]>();
  for (const r of records) {
    const list = byCat.get(r.def.category) ?? [];
    list.push(r);
    byCat.set(r.def.category, list);
  }
  const groups: CategoryGroup[] = [];
  for (const category of categories) {
    const list = byCat.get(category.id);
    if (!list || list.length === 0) continue;
    const sorted = sortByUrgency(list);
    groups.push({
      category,
      records: sorted,
      urgentCount: sorted.filter((r) => URGENT_STATES.has(r.computed.state)).length,
    });
  }
  return groups;
}
