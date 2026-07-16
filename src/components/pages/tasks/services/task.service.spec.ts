import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { STORAGE_KEY, TaskUser } from '../models';
import { TASK_USERS } from '../config/task-access.config';

function user(id: string): TaskUser {
  return TASK_USERS.find((u) => u.id === id)!;
}

describe('TaskService (integration)', () => {
  let svc: TaskService;
  const mojo = user('mojo');
  const nicolita = user('nicolita');
  const nikkita = user('nikkita');
  const annasun = user('annasun');

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({});
    svc = TestBed.inject(TaskService);
  });

  it('records completion with user + timestamp and appends immutable history', () => {
    const rec = svc.visibleRecords(mojo).find((r) => r.def.type === 'general')!;
    svc.complete(rec.def.id, mojo);
    const after = svc.visibleRecords(mojo).find((r) => r.def.id === rec.def.id)!;
    expect(after.state.lastCompletedBy).toBe('mojo');
    expect(after.state.lastCompletedAt).toBeTruthy();
    expect(after.state.history.length).toBe(1);
  });

  it('recalculates the next due date after completing a date-based task', () => {
    const rec = svc.visibleRecords(mojo).find(
      (r) => r.def.recurrence.kind === 'fixedInterval',
    )!;
    svc.complete(rec.def.id, mojo);
    const after = svc.visibleRecords(mojo).find((r) => r.def.id === rec.def.id)!;
    expect(after.computed.nextDueAt).toBeTruthy();
    expect(new Date(after.computed.nextDueAt!).getTime()).toBeGreaterThan(Date.now());
  });

  it('shares completion across routes (Annasun completes → Nikkita sees it)', () => {
    const rec = svc.visibleRecords(annasun).find((r) => r.def.type === 'massage')!;
    svc.complete(rec.def.id, annasun);
    const seen = svc.visibleRecords(nikkita).find((r) => r.def.id === rec.def.id)!;
    expect(seen.state.lastCompletedByName).toBe('Annasun');
  });

  it('supports undo of the last completion', () => {
    const rec = svc.visibleRecords(mojo).find((r) => r.def.type === 'general')!;
    svc.complete(rec.def.id, mojo);
    expect(svc.canUndo()).toBeTrue();
    svc.undoLast();
    const after = svc.visibleRecords(mojo).find((r) => r.def.id === rec.def.id)!;
    expect(after.state.history.length).toBe(0);
    expect(after.state.lastCompletedAt).toBeNull();
  });

  it('persists the selected view per user across reloads', () => {
    svc.setViewMode('mojo', 'calendar');
    expect(svc.prefs('mojo').viewMode).toBe('calendar');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const reloaded = TestBed.inject(TaskService);
    expect(reloaded.prefs('mojo').viewMode).toBe('calendar');
  });

  it('never exposes massage tasks to Nicolita', () => {
    expect(svc.visibleRecords(nicolita).some((r) => r.def.type === 'massage')).toBeFalse();
  });

  it('advances the zone when a rotating task is completed', () => {
    const rotating = svc.visibleRecords(mojo).find((r) => r.def.recurrence.kind === 'rotating')!;
    const before = rotating.computed.currentZone;
    svc.complete(rotating.def.id, mojo);
    const after = svc.visibleRecords(mojo).find((r) => r.def.id === rotating.def.id)!;
    expect(after.state.rotationIndex).toBe(1);
    expect(after.computed.currentZone).not.toBe(before);
  });

  it('logs an event occurrence for event-triggered tasks', () => {
    const eventTask = svc.visibleRecords(mojo).find(
      (r) => r.def.recurrence.kind === 'eventTriggered',
    )!;
    svc.triggerEvent(eventTask.def.id, mojo);
    const after = svc.visibleRecords(mojo).find((r) => r.def.id === eventTask.def.id)!;
    expect(after.state.openTrigger).toBeTruthy();
    expect(after.computed.state).toBe('eventActionable');
  });
});
