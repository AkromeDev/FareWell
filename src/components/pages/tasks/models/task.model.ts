import { TaskEvent, TaskRecurrence, Weekday } from './recurrence.model';

export type TaskType = 'general' | 'massage';

/** The four staff members that own the task routes. */
export type TaskUserId = 'nicolita' | 'mojo' | 'nikkita' | 'annasun';

/**
 * Immutable, versioned definition of a task, derived from the salon cleaning
 * plan. Definitions live in the seed data; nothing mutable (completion history,
 * next due date, urgency) is stored here — those are computed or kept in
 * {@link TaskMutableState}.
 */
export interface TaskDefinition {
  /** Stable id based on category + task (never an array index). */
  id: string;
  /** Original wording from the plan (kept verbatim). */
  name: string;
  description?: string;
  /** Category id (a section/room from the plan). */
  category: string;
  type: TaskType;
  /** Users allowed to see and complete the task. */
  eligibleUsers: TaskUserId[];
  primaryOwner?: TaskUserId;
  recurrence: TaskRecurrence;
  active: boolean;
  notes?: string;
  /** Preferred calendar weekday for otherwise unscheduled tasks. */
  preferredWeekday?: Weekday;
  /** Optional display order within a category. */
  displayOrder?: number;
  sourcePlanId: string;
  sourcePlanVersion: string;
}

/** How a completion resolved — plain work, a clean inspection, or corrective work. */
export type CompletionAction = 'completed' | 'checked-ok' | 'corrective';

/** An immutable record of a single completion. */
export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: TaskUserId;
  userName: string;
  /** ISO 8601 timestamp (UTC). */
  completedAt: string;
  action: CompletionAction;
  note?: string;
  /** For rotating tasks: the zone that was serviced. */
  zone?: string;
}

/** A recorded occurrence of an external event that makes a task actionable. */
export interface TaskTriggerOccurrence {
  id: string;
  taskId: string;
  event: TaskEvent;
  triggeredAt: string;
  triggeredBy: TaskUserId;
}

/**
 * The mutable, persisted state of a task, merged with its definition by id.
 * Shared across all routes/users — this is what makes completion information
 * consistent everywhere.
 */
export interface TaskMutableState {
  taskId: string;
  lastCompletedAt: string | null;
  lastCompletedBy: TaskUserId | null;
  lastCompletedByName: string | null;
  lastAction: CompletionAction | null;
  history: TaskCompletion[];
  /** Advances by one on each completion of a rotating task. */
  rotationIndex: number;
  /** Manually chosen date (ISO) for an ad-hoc task placed on the calendar. */
  plannedDate: string | null;
  /** Open event occurrence awaiting completion (event-triggered tasks). */
  openTrigger: TaskTriggerOccurrence | null;
  /** Set when a seed task is retired but has history worth keeping. */
  archived: boolean;
}

// --------------------------------------------------------------------------
// Derived (computed) view state — never persisted.
// --------------------------------------------------------------------------

/** Coarse urgency level used for styling (never relied on by colour alone). */
export type UrgencyLevel =
  | 'neutral'
  | 'attention'
  | 'warning'
  | 'critical'
  | 'completed'
  | 'waiting'
  | 'seasonal';

/** Fine-grained state used for grouping, ordering and accessible labels. */
export type TaskState =
  | 'overdue'
  | 'dueToday'
  | 'checkDue'
  | 'dueSoon'
  | 'attention'
  | 'upcoming'
  | 'eventActionable'
  | 'waitingForEvent'
  | 'adHoc'
  | 'recentlyCompleted'
  | 'seasonalInactive';

/** Deterministically derived view state for a task at a given moment. */
export interface ComputedTask {
  state: TaskState;
  urgency: UrgencyLevel;
  /** ISO next due date, or null for recurrence types that produce none. */
  nextDueAt: string | null;
  /** Whether the task can be meaningfully completed now. */
  actionable: boolean;
  /** Lower sorts first within a category. */
  sortRank: number;
  /** Current zone for rotating tasks. */
  currentZone?: string;
}

/** A task definition merged with its mutable state and computed view state. */
export interface TaskRecord {
  def: TaskDefinition;
  state: TaskMutableState;
  computed: ComputedTask;
}

/** A calendar occurrence of a task on a specific day. */
export type CalendarItemKind = 'due' | 'completed' | 'check' | 'event';

export interface CalendarOccurrence {
  /** ISO date (yyyy-mm-dd, local) of the occurrence. */
  date: string;
  kind: CalendarItemKind;
}

export interface TaskCategory {
  id: string;
  labelDe: string;
  labelEn: string;
  type: TaskType;
  order: number;
}
