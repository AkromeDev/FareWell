import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { RoadStateService } from './road-state.service';
import { ROAD, roadSteps, type Bi, type RoadDefinition } from './road.model';
import { FREELANCER_ROAD } from './freelancer-road.data';
import { GASTRO_ROAD } from './gastro-road.data';

const ROADS: RoadDefinition[] = [FREELANCER_ROAD, GASTRO_ROAD];

function serviceFor(road: RoadDefinition): RoadStateService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      { provide: PLATFORM_ID, useValue: 'browser' },
      { provide: ROAD, useValue: road },
      RoadStateService,
    ],
  });
  const service = TestBed.inject(RoadStateService);
  service.load();
  return service;
}

for (const road of ROADS) {
  describe(`RoadStateService (${road.name})`, () => {
    const steps = roadSteps(road);
    let service: RoadStateService;

    beforeEach(() => {
      localStorage.removeItem(road.storageKey);
      service = serviceFor(road);
    });

    afterEach(() => {
      localStorage.removeItem(road.storageKey);
    });

    it('starts empty and persistent in a browser', () => {
      expect(service.loaded()).toBeTrue();
      expect(service.persistent()).toBeTrue();
      expect(service.hasAnyData()).toBeFalse();
      expect(service.doneCount()).toBe(0);
      expect(service.visibleSteps().length).toBe(steps.length);
    });

    it('toggles a step with a timestamp and persists it', () => {
      const id = steps[0].id;
      service.toggleDone(id);
      expect(service.isDone(id)).toBeTrue();
      expect(service.doneAt(id)).toMatch(/^\d{4}-\d{2}-\d{2}T/);

      const stored = JSON.parse(localStorage.getItem(road.storageKey) ?? '{}');
      expect(stored.done[id]).toBe(service.doneAt(id));

      service.toggleDone(id);
      expect(service.isDone(id)).toBeFalse();
    });

    it('drops empty notes instead of storing blanks', () => {
      const id = steps[1].id;
      service.setNote(id, '  Hallo  ');
      expect(service.note(id)).toBe('  Hallo  ');
      service.setNote(id, '   ');
      expect(service.note(id)).toBe('');
      expect(service.hasAnyData()).toBeFalse();
    });

    it('reloads what was stored', () => {
      const id = steps[2].id;
      const profession = road.professions[0].id;
      service.setProfession(profession);
      service.toggleDone(id);
      service.setNote(id, 'Angerufen, Nummer 3 war richtig.');

      // Ein frischer Service aus einem neuen TestBed liest denselben Speicher.
      const again = serviceFor(road);
      expect(again.profession()).toBe(profession);
      expect(again.isDone(id)).toBeTrue();
      expect(again.note(id)).toBe('Angerufen, Nummer 3 war richtig.');
    });

    it('filters steps by the chosen profession and counts what is hidden', () => {
      for (const profession of road.professions) {
        service.setProfession(profession.id);
        const visible = service.visibleSteps();
        expect(visible.length + service.hiddenCount()).toBe(steps.length);
        expect(
          visible.every((s) => !s.professions?.length || s.professions.includes(profession.id)),
        ).toBeTrue();
      }
      service.setProfession(null);
      expect(service.hiddenCount()).toBe(0);
    });

    it('round-trips through export and import, ignoring unknown ids', () => {
      const id = steps[3].id;
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

  describe(`${road.name} content`, () => {
    const steps = roadSteps(road);
    const professionIds = new Set(road.professions.map((p) => p.id));

    function texts(): Bi[] {
      const out: Bi[] = [];
      for (const phase of road.phases) {
        out.push(phase.tag, phase.title, phase.lead);
        for (const step of phase.steps) {
          out.push(step.title, step.summary, ...step.details);
          if (step.joe) out.push(step.joe);
          if (step.farewell) out.push(step.farewell);
          for (const link of step.links ?? []) out.push(link.label);
          for (const contact of step.contacts ?? []) if (contact.hours) out.push(contact.hours);
        }
      }
      for (const profession of road.professions) out.push(profession.label, profession.status);
      out.push(...Object.values(road.copy).filter((v): v is Bi => typeof v === 'object'));
      return out;
    }

    it('has unique step ids that fit the storage limits', () => {
      const ids = steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.every((id) => id.length > 0 && id.length <= 64)).toBeTrue();
    });

    it('only filters by professions that exist', () => {
      const unknown = steps.flatMap((s) => s.professions ?? []).filter((p) => !professionIds.has(p));
      expect(unknown).toEqual([]);
    });

    it('has both languages everywhere and no dash as a sentence separator', () => {
      for (const text of texts()) {
        expect(text.de.trim().length).withContext(JSON.stringify(text)).toBeGreaterThan(0);
        expect(text.en.trim().length).withContext(JSON.stringify(text)).toBeGreaterThan(0);
        expect(/ [–—] /.test(text.de) || / [–—] /.test(text.en))
          .withContext(JSON.stringify(text))
          .toBeFalse();
      }
    });
  });
}

describe('Roads side by side', () => {
  afterEach(() => {
    for (const road of ROADS) localStorage.removeItem(road.storageKey);
  });

  it('keep separate storage keys', () => {
    expect(new Set(ROADS.map((r) => r.storageKey)).size).toBe(ROADS.length);
  });

  it('do not share progress, and one road\'s export is harmless in the other', () => {
    const freelancer = serviceFor(FREELANCER_ROAD);
    const id = roadSteps(FREELANCER_ROAD)[0].id;
    freelancer.setProfession('kosmetik');
    freelancer.toggleDone(id);
    const exported = freelancer.exportJson();

    const gastro = serviceFor(GASTRO_ROAD);
    expect(gastro.hasAnyData()).toBeFalse();

    const result = gastro.importJson(exported);
    expect(result.ok).toBeTrue();
    expect(result.steps).toBe(0);
    expect(gastro.profession()).toBeNull();
    expect(gastro.hasAnyData()).toBeFalse();
  });
});
