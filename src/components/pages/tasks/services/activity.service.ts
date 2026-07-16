import { Injectable } from '@angular/core';
import { ActivityEntry, TaskRecord, TaskUser } from '../models';

/**
 * Derives the activity feed from the tasks' completion history (single source
 * of truth), filtered by the current route's permissions and sorted newest
 * first.
 */
@Injectable({ providedIn: 'root' })
export class ActivityService {
  /** Activity entries visible to `user`, newest first. */
  entriesForUser(records: TaskRecord[], user: TaskUser, limit = 50): ActivityEntry[] {
    const entries: ActivityEntry[] = [];
    for (const { def, state } of records) {
      if (!user.visibleTypes.includes(def.type)) continue;
      for (const c of state.history) {
        entries.push({
          id: c.id,
          taskId: def.id,
          taskNameDe: def.nameDe,
          taskNameEn: def.nameEn,
          category: def.category,
          type: def.type,
          userId: c.userId,
          userName: c.userName,
          action: c.action,
          at: c.completedAt,
          note: c.note,
          zone: c.zone,
        });
      }
    }
    // ISO 8601 timestamps sort correctly as strings; newest first.
    entries.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
    return entries.slice(0, limit);
  }
}
