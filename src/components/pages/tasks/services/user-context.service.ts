import { Injectable } from '@angular/core';
import { TaskCategory, TaskType, TaskUser } from '../models';
import { TASK_CATEGORIES, userBySegment } from '../config/task-access.config';

/**
 * Resolves the active user from the route and answers permission questions.
 * Route configuration determines everything; this service just reads the config
 * so components never hard-code who-can-do-what.
 */
@Injectable({ providedIn: 'root' })
export class UserContextService {
  /** The user for a route segment (e.g. 'nicolita'), or null if unknown. */
  resolve(segment: string | null | undefined): TaskUser | null {
    if (!segment) return null;
    return userBySegment(segment) ?? null;
  }

  canSee(user: TaskUser, type: TaskType): boolean {
    return user.visibleTypes.includes(type);
  }

  canComplete(user: TaskUser, type: TaskType): boolean {
    return user.visibleTypes.includes(type);
  }

  /** Categories the user may see, in plan order. */
  visibleCategories(user: TaskUser): TaskCategory[] {
    return TASK_CATEGORIES.filter((c) => user.visibleTypes.includes(c.type)).sort(
      (a, b) => a.order - b.order,
    );
  }
}
