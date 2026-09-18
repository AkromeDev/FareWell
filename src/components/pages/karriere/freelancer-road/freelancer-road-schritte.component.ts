import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
  type GuideTocItem,
} from 'src/components/molecules/guide';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import {
  ALL_STEPS,
  PHASES,
  PROFESSIONS,
  ROAD_STAND,
  professionById,
  stepAppliesTo,
  type Bi,
  type Phase,
  type ProfessionId,
  type Step,
} from './freelancer-road.data';
import { FreelancerRoadStateService } from './freelancer-road-state.service';

const PAGE_PATH = '/karriere/freelancer-road/schritte';
const LANDING_PATH = '/karriere/freelancer-road';
const ORIGIN = 'https://farewell.salon';

/**
 * Freelancer Road, Schritte-Seite: die interaktive Checkliste. Berufswahl,
 * Häkchen mit Datum und Notizen je Schritt, alles über
 * FreelancerRoadStateService im Browser gespeichert; Export und Import als
 * JSON-Datei, weil gelöschte Website-Daten den Stand mitnehmen.
 *
 * Inhalte (Etappen, Schritte, Kontakte, Joés Erfahrungen) kommen aus
 * freelancer-road.data.ts und werden in beiden Sprachen ins DOM gerendert
 * (<span class="lang de|en">), wie die Prosa der übrigen Karriere-Seiten.
 */
@Component({
  standalone: true,
  selector: 'app-freelancer-road-schritte',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './freelancer-road-schritte.component.html',
  styleUrls: ['./freelancer-road.shared.scss'],
})
export class FreelancerRoadSchritteComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'freelancer-road-schritte-schema';
  readonly state = inject(FreelancerRoadStateService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  readonly phases = PHASES;
  readonly professions = PROFESSIONS;
  readonly stand = ROAD_STAND;
  readonly landingPath = LANDING_PATH;

  /** Aufgeklappte Schritte, nur für die Sitzung. */
  private readonly expanded = signal<Set<string>>(new Set());
  /** Kurze Rückmeldung nach Export/Import/Reset, für die aria-live-Zeile. */
  readonly feedback = signal<Bi | null>(null);
  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;
  private noteTimers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly professionLabel = computed(() => professionById(this.state.profession()));

  /** Schritte, die für den gewählten Beruf gelten (alle, wenn keiner gewählt). */
  readonly visibleSteps = computed(() =>
    ALL_STEPS.filter((s) => stepAppliesTo(s, this.state.profession())),
  );
  readonly hiddenCount = computed(() => ALL_STEPS.length - this.visibleSteps().length);
  readonly visibleDone = computed(() => {
    const done = this.state.done();
    return this.visibleSteps().filter((s) => s.id in done).length;
  });
  readonly percent = computed(() => {
    const total = this.visibleSteps().length;
    return total === 0 ? 0 : Math.round((this.visibleDone() / total) * 100);
  });

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    const total = this.visibleSteps().length;
    const done = this.visibleDone();
    return [
      { value: String(total), label: this.t('Schritte für dich', 'steps for you'), animate: false },
      { value: String(done), label: this.t('erledigt', 'done'), animate: false },
      { value: `${this.percent()}%`, label: this.t('geschafft', 'complete'), animate: false },
      {
        value: this.professionLabel()
          ? this.professionLabel()!.icon
          : this.t('alle', 'all'),
        label: this.professionLabel()
          ? this.bi(this.professionLabel()!.label)
          : this.t('Berufe angezeigt', 'professions shown'),
        animate: false,
        srText: this.professionLabel()
          ? this.t(
              `Gewählter Beruf: ${this.professionLabel()!.label.de}`,
              `Chosen profession: ${this.professionLabel()!.label.en}`,
            )
          : this.t('Noch kein Beruf gewählt, alle Schritte werden angezeigt.', 'No profession chosen yet, all steps are shown.'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'beruf', label: this.t('Dein Beruf', 'Your profession') },
      ...PHASES.map((phase) => ({ id: phase.id, label: this.bi(phase.title) })),
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const title = this.t(
      'Freelancer Road: alle Schritte als Checkliste | FareWell Nürnberg',
      'Freelancer Road: Every Step as a Checklist | FareWell Nuremberg',
    );
    const description = this.t(
      'Die abhakbare Checkliste in die Selbständigkeit bei FareWell Nürnberg: Gewerbe oder freier Beruf, Finanzamt, Kammer, Berufsgenossenschaft, Versicherung, Google-Profil, Website und Marketing. Mit Nummern, Adressen und Joés Erfahrungen. Dein Stand bleibt in deinem Browser.',
      'The tick-off checklist into self-employment at FareWell Nuremberg: trade or liberal profession, tax office, chamber, accident insurer, insurance, Google profile, website and marketing. With phone numbers, addresses and Joé\'s experience. Your progress stays in your browser.',
    );
    const pageUrl = `${ORIGIN}${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? `${ORIGIN}/en` : ORIGIN;
    const prefix = isEn ? '/en' : '';

    this.seo.setPageSeo({ title, description, path: PAGE_PATH });
    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: { '@id': `${ORIGIN}/#website` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: this.t('Karriere', 'Careers'), item: `${ORIGIN}${prefix}/karriere` },
            { '@type': 'ListItem', position: 3, name: 'Freelancer Road', item: `${ORIGIN}${prefix}${LANDING_PATH}` },
            { '@type': 'ListItem', position: 4, name: this.t('Schritte', 'Steps'), item: pageUrl },
          ],
        },
      ],
    });

    if (this.isBrowser) {
      this.state.load();
    }
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
    this.noteTimers.forEach((timer) => clearTimeout(timer));
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
  }

  // ------------------------------------------------------------ Anzeige

  bi(text: Bi): string {
    return this.language.lang() === 'en' ? text.en : text.de;
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
      .map((id) => professionById(id))
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

  chooseProfession(id: ProfessionId): void {
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
    a.download = `freelancer-road-${stamp}.json`;
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
        de: 'Das ist keine Freelancer-Road-Datei. Nichts wurde geändert.',
        en: 'That is not a Freelancer Road file. Nothing was changed.',
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
    const ok = window.confirm(
      this.t(
        'Alle Häkchen, Notizen und die Berufswahl auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen. Exportiere vorher, wenn du unsicher bist.',
        'Delete all ticks, notes and the profession choice on this device? This cannot be undone. Export first if you are unsure.',
      ),
    );
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
