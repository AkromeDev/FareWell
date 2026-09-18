import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { FreelancerRoadStateService } from './freelancer-road-state.service';
import { ALL_STEPS } from './freelancer-road.data';

const KEY = 'fw_freelancer_road_v1';

describe('FreelancerRoadStateService', () => {
  let service: FreelancerRoadStateService;

  beforeEach(() => {
    localStorage.removeItem(KEY);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(FreelancerRoadStateService);
    service.load();
  });

  afterEach(() => {
    localStorage.removeItem(KEY);
  });

  it('starts empty and persistent in a browser', () => {
    expect(service.loaded()).toBeTrue();
    expect(service.persistent()).toBeTrue();
    expect(service.hasAnyData()).toBeFalse();
    expect(service.doneCount()).toBe(0);
  });

  it('toggles a step with a timestamp and persists it', () => {
    const id = ALL_STEPS[0].id;
    service.toggleDone(id);
    expect(service.isDone(id)).toBeTrue();
    expect(service.doneAt(id)).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    const stored = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    expect(stored.done[id]).toBe(service.doneAt(id));

    service.toggleDone(id);
    expect(service.isDone(id)).toBeFalse();
  });

  it('drops empty notes instead of storing blanks', () => {
    const id = ALL_STEPS[1].id;
    service.setNote(id, '  Hallo  ');
    expect(service.note(id)).toBe('  Hallo  ');
    service.setNote(id, '   ');
    expect(service.note(id)).toBe('');
    expect(service.hasAnyData()).toBeFalse();
  });

  it('reloads what was stored', () => {
    const id = ALL_STEPS[2].id;
    service.setProfession('kosmetik');
    service.toggleDone(id);
    service.setNote(id, 'Angerufen, Nummer 3 war richtig.');

    // Ein frischer Service aus einem neuen TestBed liest denselben Speicher.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const again = TestBed.inject(FreelancerRoadStateService);
    again.load();
    expect(again.profession()).toBe('kosmetik');
    expect(again.isDone(id)).toBeTrue();
    expect(again.note(id)).toBe('Angerufen, Nummer 3 war richtig.');
  });

  it('round-trips through export and import, ignoring unknown ids', () => {
    const id = ALL_STEPS[3].id;
    service.toggleDone(id);
    service.setNote(id, 'n');
    const json = service.exportJson();

    service.reset();
    expect(service.hasAnyData()).toBeFalse();

    const tampered = JSON.parse(json);
    tampered.done['does-not-exist'] = new Date().toISOString();
    tampered.notes['does-not-exist'] = 'x';
    const result = service.importJson(JSON.stringify(tampered));

    expect(result.ok).toBeTrue();
    expect(result.steps).toBe(1);
    expect(result.notes).toBe(1);
    expect(service.isDone(id)).toBeTrue();
    expect(service.isDone('does-not-exist')).toBeFalse();
  });

  it('rejects files that are not a road snapshot', () => {
    expect(service.importJson('not json').ok).toBeFalse();
    expect(service.importJson('[1,2,3]').ok).toBeFalse();
    expect(service.importJson('{"done": "nope"}').ok).toBeFalse();
    expect(service.hasAnyData()).toBeFalse();
  });
});
