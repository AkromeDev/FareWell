import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ALL_STEPS, PROFESSIONS, type ProfessionId } from './freelancer-road.data';

/**
 * Persistierter Stand der Freelancer Road: gewählter Beruf, abgehakte Schritte
 * (mit Datum) und Notizen je Schritt.
 *
 * Lebt ausschließlich im Browser der Person (localStorage, ein Schlüssel).
 * Nichts davon verlässt das Gerät: kein Backend, kein Sync, keine Auswertung.
 * Genau deshalb steht auf der Seite die Warnung, dass gelöschte
 * Website-Daten den Stand mitnehmen, und deshalb gibt es Export/Import.
 *
 * Beim Prerendern gibt es keinen Speicher: `load()` ist dann ein No-op und
 * die Seite rendert den leeren Zustand, den der Browser danach überschreibt
 * (die App hydratisiert nicht, sie rendert clientseitig neu).
 */

const STORAGE_KEY = 'fw_freelancer_road_v1';
const SCHEMA = 1;

export interface RoadSnapshot {
  schema: number;
  updatedAt: string;
  profession: ProfessionId | null;
  /** Schritt-ID → ISO-Datum des Abhakens. */
  done: Record<string, string>;
  /** Schritt-ID → Notiztext. */
  notes: Record<string, string>;
}

export interface ImportResult {
  ok: boolean;
  /** Anzahl der übernommenen Schritte und Notizen (nur bei ok). */
  steps?: number;
  notes?: number;
  error?: 'parse' | 'schema';
}

@Injectable({ providedIn: 'root' })
export class FreelancerRoadStateService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly profession = signal<ProfessionId | null>(null);
  readonly done = signal<Record<string, string>>({});
  readonly notes = signal<Record<string, string>>({});
  /** true, sobald load() im Browser gelaufen ist (steuert Hinweise im UI). */
  readonly loaded = signal(false);
  /** false, wenn localStorage fehlt oder wirft (privater Modus, Quota). */
  readonly persistent = signal(false);
  /** Wann zuletzt gespeichert wurde, für das Kleingedruckte. */
  readonly updatedAt = signal<string | null>(null);

  readonly doneCount = computed(() => Object.keys(this.done()).length);
  readonly hasAnyData = computed(
    () =>
      this.profession() !== null ||
      Object.keys(this.done()).length > 0 ||
      Object.values(this.notes()).some((n) => n.trim().length > 0),
  );

  load(): void {
    if (!this.isBrowser) {
      return;
    }
    this.persistent.set(this.probe());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = this.parse(raw);
        if (parsed) {
          this.apply(parsed);
        }
      }
    } catch {
      /* Speicher nicht lesbar: leer starten, nichts kaputt machen. */
    }
    this.loaded.set(true);
  }

  setProfession(id: ProfessionId | null): void {
    this.profession.set(id);
    this.persist();
  }

  isDone(stepId: string): boolean {
    return stepId in this.done();
  }

  doneAt(stepId: string): string | null {
    return this.done()[stepId] ?? null;
  }

  toggleDone(stepId: string): void {
    const next = { ...this.done() };
    if (stepId in next) {
      delete next[stepId];
    } else {
      next[stepId] = new Date().toISOString();
    }
    this.done.set(next);
    this.persist();
  }

  note(stepId: string): string {
    return this.notes()[stepId] ?? '';
  }

  setNote(stepId: string, text: string): void {
    const next = { ...this.notes() };
    if (text.trim().length === 0) {
      delete next[stepId];
    } else {
      next[stepId] = text;
    }
    this.notes.set(next);
    this.persist();
  }

  reset(): void {
    this.profession.set(null);
    this.done.set({});
    this.notes.set({});
    this.updatedAt.set(null);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  /** Aktueller Stand als JSON-Text (für den Download). */
  exportJson(): string {
    return JSON.stringify(this.snapshot(), null, 2);
  }

  /**
   * Importiert einen Export. Vereinigt mit dem vorhandenen Stand, der Import
   * gewinnt bei Konflikten. Unbekannte Schritt-IDs werden verworfen, damit ein
   * alter Export nach einer Inhaltsänderung nichts Verwaistes hinterlässt.
   */
  importJson(text: string): ImportResult {
    const parsed = this.parse(text);
    if (!parsed) {
      return { ok: false, error: 'parse' };
    }
    const known = new Set(ALL_STEPS.map((s) => s.id));
    const done = { ...this.done() };
    const notes = { ...this.notes() };
    let steps = 0;
    let noteCount = 0;
    for (const [id, date] of Object.entries(parsed.done)) {
      if (known.has(id)) {
        done[id] = date;
        steps++;
      }
    }
    for (const [id, note] of Object.entries(parsed.notes)) {
      if (known.has(id) && note.trim().length > 0) {
        notes[id] = note;
        noteCount++;
      }
    }
    this.done.set(done);
    this.notes.set(notes);
    if (parsed.profession) {
      this.profession.set(parsed.profession);
    }
    this.persist();
    return { ok: true, steps, notes: noteCount };
  }

  private snapshot(): RoadSnapshot {
    return {
      schema: SCHEMA,
      updatedAt: new Date().toISOString(),
      profession: this.profession(),
      done: this.done(),
      notes: this.notes(),
    };
  }

  private apply(snap: RoadSnapshot): void {
    this.profession.set(snap.profession);
    this.done.set(snap.done);
    this.notes.set(snap.notes);
    this.updatedAt.set(snap.updatedAt);
  }

  private persist(): void {
    if (!this.isBrowser) {
      return;
    }
    const snap = this.snapshot();
    this.updatedAt.set(snap.updatedAt);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      this.persistent.set(true);
    } catch {
      this.persistent.set(false);
    }
  }

  /** Streng genug, dass fremde oder kaputte Dateien nichts anrichten. */
  private parse(raw: string): RoadSnapshot | null {
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
    if (!value || typeof value !== 'object') {
      return null;
    }
    const v = value as Record<string, unknown>;
    const professionIds = new Set<string>(PROFESSIONS.map((p) => p.id));
    const profession =
      typeof v['profession'] === 'string' && professionIds.has(v['profession'])
        ? (v['profession'] as ProfessionId)
        : null;
    const done = this.stringRecord(v['done']);
    const notes = this.stringRecord(v['notes']);
    if (!done || !notes) {
      return null;
    }
    return {
      schema: typeof v['schema'] === 'number' ? v['schema'] : SCHEMA,
      updatedAt: typeof v['updatedAt'] === 'string' ? v['updatedAt'] : new Date().toISOString(),
      profession,
      done,
      notes,
    };
  }

  private stringRecord(value: unknown): Record<string, string> | null {
    if (value === undefined || value === null) {
      return {};
    }
    if (typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }
    const out: Record<string, string> = {};
    for (const [k, val] of Object.entries(value as Record<string, unknown>)) {
      if (typeof val === 'string' && k.length <= 64 && val.length <= 20000) {
        out[k] = val;
      }
    }
    return out;
  }

  private probe(): boolean {
    try {
      const key = '__fw_road_probe__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
}
