import { Weekday } from './recurrence.model';
import { TaskType, TaskUserId } from './task.model';

/** The two interchangeable task representations. */
export type TaskViewMode = 'list' | 'calendar';

/** A staff member and the visibility/permission rules for their route. */
export interface TaskUser {
  id: TaskUserId;
  /** Display name shown in the UI and activity feed. */
  name: string;
  /** URL segment, e.g. 'nicolita' in /tasks/nicolita. */
  routeSegment: string;
  /** Which top-level route this user lives under. */
  routeArea: 'tasks' | 'massage-tasks';
  /** Task types the user may see and complete. */
  visibleTypes: TaskType[];
  /** Full overview of every category and all activity (Mojo). */
  overview: boolean;
  /** May edit the plan from the UI: rename, rhythm, add, archive (Mojo). */
  canEditTasks?: boolean;
}

/** Weekday schedule for the shared massage room. */
export interface MassageSchedule {
  /** userId → weekdays that person uses the massage room. */
  useDaysByUser: Partial<Record<TaskUserId, Weekday[]>>;
}

/**
 * The single configuration object that drives every route: who the user is,
 * what they can see/complete, how activity is filtered, and the massage-room
 * schedule. Route components read from this rather than hard-coding rules.
 */
export interface TaskAccessConfiguration {
  users: TaskUser[];
  /** Plan name → internal user id (Nicole → nicolita, Joé → mojo, …). */
  identityMap: Record<string, TaskUserId>;
  massageSchedule: MassageSchedule;
  planId: string;
  planVersion: string;
}
