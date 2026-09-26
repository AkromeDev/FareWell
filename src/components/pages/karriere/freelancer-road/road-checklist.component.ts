import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GUIDE_COMPONENTS } from 'src/components/molecules/guide';
import { LanguageService, Lang } from 'src/services/language.service';
import { ROAD, professionIn, stepAppliesTo, type Bi, type Phase, type Step } from './road.model';
import { RoadStateService } from './road-state.service';

/**
 * Die abhakbare Checkliste einer Road: Auswahl (Beruf oder Vorhaben),
 * Fortschritt, Speicherhinweis, Export/Import/Reset und alle Etappen mit ihren
 * Schritten (Häkchen mit Datum, Details, Kontakte, Links, Notizen).
 *
 * Kennt keine konkrete Road: Inhalt und die wenigen abweichenden Texte kommen
 * über das ROAD-Token, der Stand über RoadStateService. Beides stellt die
 * Seiten-Komponente bereit (Freelancer Road, Gastro Road).
 *
 * Der Host ist ein direktes Kind von `.gd-wrap` und ein Block, damit die
 * Sektionen darin wie direkte Kinder fließen. Mobil ordnet _guide.scss jedes
 * Kind von `.gd-wrap` hinter das Intro, den Host eingeschlossen.
 */
@Component({
  standalone: true,
  selector: 'app-road-checklist',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective],
  templateUrl: './road-checklist.component.html',
  styleUrls: ['./freelancer-road.shared.scss'],
  styles: [':host { display: block; }'],
})
export class RoadChecklistComponent implements OnDestroy {
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly road = inject(ROAD);
  readonly state = inject(RoadStateService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  /** Aufgeklappte Schritte, nur für die Sitzung. */
  private readonly expanded = signal<Set<string>>(new Set());
  /** Kurze Rückmeldung nach Export/Import/Reset, für die aria-live-Zeile. */
  readonly feedback = signal<Bi | null>(null);
  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;
  private noteTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /** „Freelancer-Road", „Gastro-Road": für Wortzusammensetzungen wie „…-Datei". */
  readonly fileWord = this.road.name.replace(/\s+/g, '-');

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  ngOnDestroy(): void {
    this.noteTimers.forEach((timer) => clearTimeout(timer));
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
  }

  // ------------------------------------------------------------ Anzeige

  bi(text: Bi): string {
    return this.language.lang() === 'en' ? text.en : text.de;
  }

  /** Setzt eine Zahl in einen Text mit Platzhalter {n}. */
  count(text: string, n: number): string {
    return text.replace('{n}', String(n));
  }

  stepsOf(phase: Phase): Step[] {
    const profession = this.state.profession();
    return phase.steps.filter((s) => stepAppliesTo(s, profession));
  }

  phaseDone(phase: Phase): number {
    const done = this.state.done();
    return this.stepsOf(phase).filter((s) => s.id in done).length;
  }

  isExpanded(id: string): boolean {
    return this.expanded().has(id);
  }

  toggleExpanded(id: string): void {
    const next = new Set(this.expanded());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.expanded.set(next);
  }

  weightLabel(weight: Step['weight']): string {
    switch (weight) {
      case 'pflicht':
        return this.t('Pflicht', 'Required');
      case 'empfohlen':
        return this.t('Empfohlen', 'Recommended');
      default:
        return this.t('Optional', 'Optional');
    }
  }

  professionTags(step: Step): string {
    if (!step.professions || step.professions.length === 0 || this.state.profession()) {
      return '';
    }
    return step.professions
      .map((id) => professionIn(this.road, id))
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => this.bi(p.label))
      .join(' · ');
  }

  doneAtLabel(id: string): string {
    const iso = this.state.doneAt(id);
    if (!iso) {
      return '';
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const formatted = date.toLocaleDateString(this.lang === 'en' ? 'en-GB' : 'de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return this.t(`Erledigt am ${formatted}`, `Done on ${formatted}`);
  }

  telHref(phone: string): string {
    return 'tel:+49' + phone.replace(/[^\d]/g, '').replace(/^0/, '');
  }

  // ------------------------------------------------------------ Aktionen

  chooseProfession(id: string): void {
    this.state.setProfession(this.state.profession() === id ? null : id);
  }

  toggleDone(id: string): void {
    this.state.toggleDone(id);
  }

  onNoteInput(id: string, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const existing = this.noteTimers.get(id);
    if (existing) {
      clearTimeout(existing);
    }
    this.noteTimers.set(
      id,
      setTimeout(() => {
        this.state.setNote(id, value);
        this.noteTimers.delete(id);
      }, 400),
    );
  }

  onNoteBlur(id: string, event: Event): void {
    const existing = this.noteTimers.get(id);
    if (existing) {
      clearTimeout(existing);
      this.noteTimers.delete(id);
    }
    this.state.setNote(id, (event.target as HTMLTextAreaElement).value);
  }

  exportState(): void {
    if (!this.isBrowser) {
      return;
    }
    const blob = new Blob([this.state.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `${this.road.slug}-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.say({
      de: 'Datei heruntergeladen. Bewahre sie dort auf, wo du sie wiederfindest.',
      en: 'File downloaded. Keep it somewhere you will find it again.',
    });
  }

  openImport(): void {
    this.fileInput?.nativeElement.click();
  }

  async onImportFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      this.say({ de: 'Die Datei ließ sich nicht lesen.', en: 'The file could not be read.' });
      return;
    }
    const result = this.state.importJson(text);
    if (!result.ok) {
      this.say({
        de: `Das ist keine ${this.fileWord}-Datei. Nichts wurde geändert.`,
        en: `That is not a ${this.road.name} file. Nothing was changed.`,
      });
      return;
    }
    this.say({
      de: `Import fertig: ${result.steps} Häkchen und ${result.notes} Notizen übernommen.`,
      en: `Import done: ${result.steps} ticks and ${result.notes} notes taken over.`,
    });
  }

  resetState(): void {
    if (!this.isBrowser) {
      return;
    }
    const ok = window.confirm(this.bi(this.road.copy.resetConfirm));
    if (!ok) {
      return;
    }
    this.state.reset();
    this.expanded.set(new Set());
    this.say({ de: 'Alles zurückgesetzt.', en: 'Everything has been reset.' });
  }

  private say(message: Bi): void {
    this.feedback.set(message);
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.feedbackTimer = setTimeout(() => this.feedback.set(null), 6000);
  }
}
