import {
  buildEffectiveDefinitions,
  hasEdits,
  mergeEdits,
  sanitiseEdits,
} from './task-edits';
import {
  CustomTask,
  TaskDefinition,
  TaskDefinitionOverride,
  TaskEditsState,
  createEmptyEdits,
  rec,
} from '../models';

function seedDef(overrides: Partial<TaskDefinition> = {}): TaskDefinition {
  return {
    id: 'kueche--dishwasher',
    nameDe: 'Spülmaschine ausräumen',
    nameEn: 'Empty dishwasher',
    category: 'kueche',
    type: 'general',
    eligibleUsers: ['nicolita', 'mojo'],
    recurrence: rec.fixed(1),
    active: true,
    sourcePlanId: 'p',
    sourcePlanVersion: '1',
    ...overrides,
  };
}

function override(o: Partial<TaskDefinitionOverride> = {}): TaskDefinitionOverride {
  return { updatedAt: '2026-07-16T12:00:00Z', updatedBy: 'mojo', ...o };
}

function edits(
  overrides: Record<string, TaskDefinitionOverride> = {},
  customTasks: CustomTask[] = [],
): TaskEditsState {
  return { overrides, customTasks };
}

const CUSTOM: CustomTask = {
  id: 'custom--abc123',
  nameDe: 'Terrassenpflanzen gießen',
  category: 'pflanzen',
  intervalDays: 3,
  createdAt: '2026-07-16T12:00:00Z',
  createdBy: 'mojo',
};

describe('buildEffectiveDefinitions', () => {
  it('applies a rename to BOTH languages (German-only editing)', () => {
    const { all } = buildEffectiveDefinitions(
      [seedDef()],
      edits({ 'kueche--dishwasher': override({ nameDe: 'Spülmaschine komplett' }) }),
    );
    expect(all[0].nameDe).toBe('Spülmaschine komplett');
    expect(all[0].nameEn).toBe('Spülmaschine komplett');
  });

  it('applies the interval only to interval-based recurrences', () => {
    const fixed = seedDef();
    const event = seedDef({ id: 'laserraum--paper-cover', recurrence: rec.event('client') });
    const o = { intervalDays: 14 };
    const { all } = buildEffectiveDefinitions(
      [fixed, event],
      edits({
        'kueche--dishwasher': override(o),
        'laserraum--paper-cover': override(o),
      }),
    );
    expect(all[0].recurrence).toEqual(rec.fixed(14));
    expect(all[1].recurrence).toEqual(rec.event('client'));
  });

  it('updates the base interval of seasonal recurrences', () => {
    const seasonal = seedDef({ recurrence: rec.seasonal(7, { activeMonths: [4, 5] }) });
    const { all } = buildEffectiveDefinitions(
      [seasonal],
      edits({ 'kueche--dishwasher': override({ intervalDays: 10 }) }),
    );
    expect(all[0].recurrence).toEqual(rec.seasonal(10, { activeMonths: [4, 5] }));
  });

  it('splits user-archived tasks out while keeping them in `all`', () => {
    const { all, userArchived } = buildEffectiveDefinitions(
      [seedDef()],
      edits({ 'kueche--dishwasher': override({ archived: true }) }),
    );
    expect(all.length).toBe(1);
    expect(all[0].active).toBeFalse();
    expect(userArchived.length).toBe(1);
  });

  it('builds custom tasks with type/eligibility from their category', () => {
    const massageCustom: CustomTask = { ...CUSTOM, id: 'custom--m1', category: 'massageraum' };
    const { all } = buildEffectiveDefinitions([], edits({}, [CUSTOM, massageCustom]));
    expect(all[0].type).toBe('general');
    expect(all[0].recurrence).toEqual(rec.fixed(3));
    expect(all[0].nameEn).toBe(CUSTOM.nameDe);
    expect(all[1].type).toBe('massage');
    expect(all[1].eligibleUsers).toContain('nikkita');
  });

  it('never lets a custom task shadow a seed id', () => {
    const rogue: CustomTask = { ...CUSTOM, id: 'kueche--dishwasher' };
    const { all } = buildEffectiveDefinitions([seedDef()], edits({}, [rogue]));
    expect(all.length).toBe(1);
    expect(all[0].nameEn).toBe('Empty dishwasher');
  });
});

describe('sanitiseEdits', () => {
  it('returns empty edits for garbage input', () => {
    expect(sanitiseEdits(undefined)).toEqual(createEmptyEdits());
    expect(sanitiseEdits('nope')).toEqual(createEmptyEdits());
    expect(sanitiseEdits({ overrides: 3, customTasks: 'x' })).toEqual(createEmptyEdits());
  });

  it('drops invalid overrides and clamps intervals', () => {
    const out = sanitiseEdits({
      overrides: {
        good: override({ intervalDays: 7.3 }),
        noStamp: { nameDe: 'x' },
        badInterval: override({ intervalDays: 9999 }),
      },
      customTasks: [],
    });
    expect(Object.keys(out.overrides)).toEqual(['good', 'badInterval']);
    expect(out.overrides['good'].intervalDays).toBe(7.5);
    expect(out.overrides['badInterval'].intervalDays).toBeUndefined();
  });

  it('drops malformed custom tasks and dedupes ids', () => {
    const out = sanitiseEdits({
      overrides: {},
      customTasks: [CUSTOM, { ...CUSTOM }, { ...CUSTOM, id: 'not-custom-prefixed' }, null],
    });
    expect(out.customTasks.length).toBe(1);
    expect(out.customTasks[0].id).toBe(CUSTOM.id);
  });
});

describe('mergeEdits', () => {
  it('lets the newer override win per task (local wins ties)', () => {
    const older = override({ nameDe: 'Alt', updatedAt: '2026-07-16T10:00:00Z' });
    const newer = override({ nameDe: 'Neu', updatedAt: '2026-07-16T11:00:00Z' });
    expect(mergeEdits(edits({ t1: older }), edits({ t1: newer })).overrides['t1'].nameDe).toBe('Neu');
    expect(mergeEdits(edits({ t1: newer }), edits({ t1: older })).overrides['t1'].nameDe).toBe('Neu');
    const tie = override({ nameDe: 'Lokal' });
    expect(
      mergeEdits(edits({ t1: tie }), edits({ t1: override({ nameDe: 'Fern' }) })).overrides['t1']
        .nameDe,
    ).toBe('Lokal');
  });

  it('unions custom tasks by id and keeps overrides of the other side', () => {
    const other: CustomTask = { ...CUSTOM, id: 'custom--other' };
    const merged = mergeEdits(
      edits({ a: override() }, [CUSTOM]),
      edits({ b: override() }, [other, CUSTOM]),
    );
    expect(merged.customTasks.length).toBe(2);
    expect(Object.keys(merged.overrides).sort()).toEqual(['a', 'b']);
  });
});

describe('hasEdits', () => {
  it('is false for empty and true for any override or custom task', () => {
    expect(hasEdits(undefined)).toBeFalse();
    expect(hasEdits(createEmptyEdits())).toBeFalse();
    expect(hasEdits(edits({ t1: override() }))).toBeTrue();
    expect(hasEdits(edits({}, [CUSTOM]))).toBeTrue();
  });
});
