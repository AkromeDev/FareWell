import { TaskDataMigrationService } from './task-migration.service';
import { PersistedTaskState, STORAGE_SCHEMA_VERSION } from '../models';
import { TASK_SEED, assertUniqueSeedIds } from '../data/task-seed.data';

describe('TaskDataMigrationService', () => {
  let svc: TaskDataMigrationService;

  beforeEach(() => {
    svc = new TaskDataMigrationService();
  });

  it('returns a safe empty state for null/corrupt input', () => {
    const s = svc.normalise(null, '2026-07-16');
    expect(s.schemaVersion).toBe(STORAGE_SCHEMA_VERSION);
    expect(s.tasks).toEqual({});
    expect(s.prefs).toEqual({});
  });

  it('sanitises invalid stored dates to null and drops invalid history', () => {
    const raw = {
      schemaVersion: 1,
      seedVersion: 'x',
      tasks: {
        t1: {
          taskId: 't1',
          lastCompletedAt: 'not-a-date',
          plannedDate: 'also-bad',
          history: [{ id: 'ok', taskId: 't1', userId: 'mojo', completedAt: '2026-07-01T10:00:00Z' }, { bogus: true }],
        },
      },
      prefs: {},
    } as unknown as PersistedTaskState;

    const s = svc.normalise(raw, '2026-07-16');
    expect(s.tasks['t1'].lastCompletedAt).toBeNull();
    expect(s.tasks['t1'].plannedDate).toBeNull();
    expect(s.tasks['t1'].history.length).toBe(1);
  });

  it('merges seed: adds missing tasks, keeps history, archives retired ids', () => {
    const base = svc.normalise(null, '2026-07-16');
    base.tasks['retired--old'] = {
      taskId: 'retired--old',
      lastCompletedAt: '2026-07-01T10:00:00Z',
      lastCompletedBy: 'mojo',
      lastCompletedByName: 'Mojo',
      lastAction: 'completed',
      history: [
        { id: 'h1', taskId: 'retired--old', userId: 'mojo', userName: 'Mojo', completedAt: '2026-07-01T10:00:00Z', action: 'completed' },
      ],
      rotationIndex: 0,
      plannedDate: null,
      openTrigger: null,
      archived: false,
    };

    const merged = svc.mergeSeed(base, TASK_SEED, '2026-07-16');

    // Every seed task now has a state entry.
    for (const def of TASK_SEED) {
      expect(merged.tasks[def.id]).toBeDefined();
    }
    // Retired task is archived but its history is preserved.
    expect(merged.tasks['retired--old'].archived).toBeTrue();
    expect(merged.tasks['retired--old'].history.length).toBe(1);
  });
});

describe('Seed data integrity', () => {
  it('has no duplicate stable ids', () => {
    const deduped = assertUniqueSeedIds(TASK_SEED);
    expect(deduped.length).toBe(TASK_SEED.length);
  });

  it('fails fast on duplicate ids in dev (clear development warning)', () => {
    const dup = [...TASK_SEED, TASK_SEED[0]];
    expect(() => assertUniqueSeedIds(dup)).toThrowError(/Duplicate seed task ids/);
  });

  it('covers every task row from the plan (89 tasks)', () => {
    expect(TASK_SEED.length).toBe(89);
  });

  it('marks only Massageraum tasks as massage type', () => {
    for (const def of TASK_SEED) {
      const expected = def.category === 'massageraum' ? 'massage' : 'general';
      expect(def.type).toBe(expected);
    }
  });

  it('gives massage tasks the shared massage eligibility', () => {
    const massage = TASK_SEED.filter((d) => d.type === 'massage');
    expect(massage.length).toBeGreaterThan(0);
    for (const d of massage) {
      expect(d.eligibleUsers.sort()).toEqual(['annasun', 'mojo', 'nikkita']);
    }
  });
});
