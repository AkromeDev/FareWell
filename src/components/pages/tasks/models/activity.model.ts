import { CompletionAction, TaskType, TaskUserId } from './task.model';

/**
 * A single entry in the activity feed. Derived from completion history so it is
 * always consistent with the underlying tasks (there is no separate stored
 * activity log to drift out of sync).
 */
export interface ActivityEntry {
  /** Equals the originating completion id. */
  id: string;
  taskId: string;
  taskName: string;
  category: string;
  type: TaskType;
  userId: TaskUserId;
  userName: string;
  action: CompletionAction;
  /** ISO 8601 timestamp (UTC). */
  at: string;
  note?: string;
  zone?: string;
}
