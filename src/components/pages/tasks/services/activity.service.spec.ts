import { ActivityService } from './activity.service';
import { UserContextService } from './user-context.service';
import { TaskCompletion, TaskRecord, TaskUser, createMutableState } from '../models';
import { TASK_USERS } from '../config/task-access.config';

function completion(taskId: string, userId: 'mojo' | 'annasun', name: string): TaskCompletion {
  return {
    id: `c-${taskId}-${userId}`,
    taskId,
    userId,
    userName: name,
    completedAt: '2026-07-16T09:00:00Z',
    action: 'completed',
  };
}

function record(id: string, type: 'general' | 'massage', history: TaskCompletion[]): TaskRecord {
  return {
    def: {
      id,
      nameDe: id,
      nameEn: id,
      category: type === 'massage' ? 'massageraum' : 'laserraum',
      type,
      eligibleUsers: ['mojo'],
      recurrence: { kind: 'fixedInterval', intervalDays: 1 },
      active: true,
      sourcePlanId: 'p',
      sourcePlanVersion: '1',
    },
    state: { ...createMutableState(id), history },
    computed: { state: 'upcoming', urgency: 'neutral', nextDueAt: null, actionable: true, sortRank: 30 },
  };
}

function userById(id: string): TaskUser {
  return TASK_USERS.find((u) => u.id === id)!;
}

describe('Route permission filtering', () => {
  const activity = new ActivityService();
  const ctx = new UserContextService();

  const records: TaskRecord[] = [
    record('general--x', 'general', [completion('general--x', 'mojo', 'Mojo')]),
    record('massage--y', 'massage', [completion('massage--y', 'annasun', 'Annasun')]),
  ];

  it('Nicolita sees general activity only', () => {
    const entries = activity.entriesForUser(records, userById('nicolita'));
    expect(entries.length).toBe(1);
    expect(entries[0].type).toBe('general');
  });

  it('Nikkita and Annasun see the shared massage activity', () => {
    for (const id of ['nikkita', 'annasun']) {
      const entries = activity.entriesForUser(records, userById(id));
      expect(entries.length).toBe(1);
      expect(entries[0].type).toBe('massage');
      expect(entries[0].userName).toBe('Annasun');
    }
  });

  it('Mojo sees all activity', () => {
    const entries = activity.entriesForUser(records, userById('mojo'));
    expect(entries.length).toBe(2);
  });

  it('visible categories follow the user visible types', () => {
    expect(ctx.visibleCategories(userById('nicolita')).every((c) => c.type === 'general')).toBeTrue();
    expect(ctx.visibleCategories(userById('nikkita')).every((c) => c.type === 'massage')).toBeTrue();
    const mojoCats = ctx.visibleCategories(userById('mojo'));
    expect(mojoCats.some((c) => c.type === 'massage')).toBeTrue();
    expect(mojoCats.some((c) => c.type === 'general')).toBeTrue();
  });

  it('resolves users from route segments and rejects unknown ones', () => {
    expect(ctx.resolve('nicolita')?.id).toBe('nicolita');
    expect(ctx.resolve('does-not-exist')).toBeNull();
  });
});
