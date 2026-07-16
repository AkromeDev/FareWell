import { hasProgress, mergeStates } from './supabase-task-repository';
import {
  PersistedTaskState,
  TaskCompletion,
  createEmptyState,
  createMutableState,
} from '../models';

function completion(id: string, at: string, user: 'mojo' | 'nicolita' = 'mojo'): TaskCompletion {
  return {
    id,
    taskId: 't1',
    userId: user,
    userName: user === 'mojo' ? 'Mojo' : 'Nicolita',
    completedAt: at,
    action: 'completed',
  };
}

function stateWith(
  tasks: PersistedTaskState['tasks'],
  prefs: PersistedTaskState['prefs'] = {},
): PersistedTaskState {
  return { ...createEmptyState('seed-x'), tasks, prefs };
}

describe('hasProgress', () => {
  it('is false for empty and prefs-only states', () => {
    expect(hasProgress(createEmptyState('s'))).toBeFalse();
    expect(hasProgress(stateWith({ t1: createMutableState('t1') }))).toBeFalse();
  });

  it('is true for any completion, rotation, trigger or planned date', () => {
    const base = createMutableState('t1');
    expect(hasProgress(stateWith({ t1: { ...base, lastCompletedAt: '2026-07-16T10:00:00Z' } }))).toBeTrue();
    expect(hasProgress(stateWith({ t1: { ...base, rotationIndex: 2 } }))).toBeTrue();
    expect(hasProgress(stateWith({ t1: { ...base, plannedDate: '2026-07-20' } }))).toBeTrue();
    expect(
      hasProgress(
        stateWith({
          t1: {
            ...base,
            openTrigger: {
              id: 'o1',
              taskId: 't1',
              event: 'client',
              triggeredAt: '2026-07-16T09:00:00Z',
              triggeredBy: 'mojo',
            },
          },
        }),
      ),
    ).toBeTrue();
  });
});

describe('mergeStates', () => {
  // The race the merge exists for: device A completed locally (unpushed)
  // while device B's completion of ANOTHER task landed remotely.
  it('keeps an unpushed local completion when remote wrote a different task', () => {
    const cA = completion('cA', '2026-07-16T10:00:00Z');
    const cB = completion('cB', '2026-07-16T10:00:05Z', 'nicolita');
    const local = stateWith({
      t1: { ...createMutableState('t1'), lastCompletedAt: cA.completedAt, history: [cA] },
    });
    const remote = stateWith({
      t2: { ...createMutableState('t2'), lastCompletedAt: cB.completedAt, history: [{ ...cB, taskId: 't2' }] },
    });

    const merged = mergeStates(local, remote);
    expect(merged.tasks['t1'].history.length).toBe(1);
    expect(merged.tasks['t1'].lastCompletedAt).toBe(cA.completedAt);
    expect(merged.tasks['t2'].history.length).toBe(1);
  });

  it('unions histories of the SAME task by completion id, newest first', () => {
    const cOld = completion('c-old', '2026-07-15T08:00:00Z');
    const cLocal = completion('c-local', '2026-07-16T10:00:00Z');
    const cRemote = completion('c-remote', '2026-07-16T10:00:30Z', 'nicolita');
    const local = stateWith({
      t1: { ...createMutableState('t1'), lastCompletedAt: cLocal.completedAt, history: [cLocal, cOld] },
    });
    const remote = stateWith({
      t1: {
        ...createMutableState('t1'),
        lastCompletedAt: cRemote.completedAt,
        lastCompletedBy: 'nicolita',
        lastCompletedByName: 'Nicolita',
        history: [cRemote, cOld],
      },
    });

    const merged = mergeStates(local, remote);
    expect(merged.tasks['t1'].history.map((h) => h.id)).toEqual(['c-remote', 'c-local', 'c-old']);
    // Remote completed later → remote wins the scalar fields.
    expect(merged.tasks['t1'].lastCompletedBy).toBe('nicolita');
    expect(merged.tasks['t1'].lastCompletedAt).toBe(cRemote.completedAt);
  });

  it('lets the newer LOCAL side win scalars while keeping remote history', () => {
    const cRemote = completion('c-remote', '2026-07-16T09:00:00Z', 'nicolita');
    const cLocal = completion('c-local', '2026-07-16T11:00:00Z');
    const local = stateWith({
      t1: { ...createMutableState('t1'), lastCompletedAt: cLocal.completedAt, history: [cLocal] },
    });
    const remote = stateWith({
      t1: {
        ...createMutableState('t1'),
        lastCompletedAt: cRemote.completedAt,
        lastCompletedBy: 'nicolita',
        history: [cRemote],
      },
    });

    const merged = mergeStates(local, remote);
    expect(merged.tasks['t1'].lastCompletedAt).toBe(cLocal.completedAt);
    expect(merged.tasks['t1'].history.length).toBe(2);
  });

  it('takes the max rotationIndex and keeps archived sticky', () => {
    const local = stateWith({
      t1: { ...createMutableState('t1'), rotationIndex: 3, archived: false },
    });
    const remote = stateWith({
      t1: { ...createMutableState('t1'), rotationIndex: 5, archived: true },
    });
    const merged = mergeStates(local, remote);
    expect(merged.tasks['t1'].rotationIndex).toBe(5);
    expect(merged.tasks['t1'].archived).toBeTrue();
  });

  it('caps the merged history like the app does', () => {
    const mk = (i: number) => completion(`c${i}`, `2026-06-${String((i % 28) + 1).padStart(2, '0')}T0${i % 9}:00:00Z`);
    const local = stateWith({
      t1: { ...createMutableState('t1'), history: Array.from({ length: 150 }, (_, i) => mk(i)) },
    });
    const remote = stateWith({
      t1: { ...createMutableState('t1'), history: Array.from({ length: 150 }, (_, i) => mk(i + 150)) },
    });
    expect(mergeStates(local, remote).tasks['t1'].history.length).toBe(200);
  });

  it('unions prefs with the local side winning conflicts', () => {
    const local = stateWith({}, { mojo: { viewMode: 'calendar', collapsedCategories: {}, activityCollapsed: false } });
    const remote = stateWith(
      {},
      {
        mojo: { viewMode: 'list', collapsedCategories: {}, activityCollapsed: true },
        annasun: { viewMode: 'list', collapsedCategories: { wc: true }, activityCollapsed: true },
      },
    );
    const merged = mergeStates(local, remote);
    expect(merged.tasks).toEqual({});
    expect(merged.prefs['mojo'].viewMode).toBe('calendar');
    expect(merged.prefs['annasun'].collapsedCategories['wc']).toBeTrue();
  });
});
