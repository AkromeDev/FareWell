import { Component, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QsIconComponent } from 'src/components/atoms/qs-icon/qs-icon.component';
import { QsDonutComponent } from 'src/components/molecules/qs-charts/qs-donut.component';
import { QsStackBarComponent } from 'src/components/molecules/qs-charts/qs-stack-bar.component';
import { QsWeekPlanComponent, WeekDay, WeekLegend } from 'src/components/molecules/qs-charts/qs-week-plan.component';
import { ChartPart } from 'src/components/molecules/qs-charts/tones';
import { UnlockError, UnlockPanelComponent } from 'src/components/molecules/unlock-panel/unlock-panel.component';
import { InternSealService, SealedEnvelope } from 'src/services/intern-seal.service';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import {
  Owner,
  QsExample,
  QsLang,
  QsPartners,
  QsSection,
  QsSplit,
  QsTodo,
  QsWeek,
  QsWeeks,
  QuickStartContent,
  Txt,
  daysBetween,
  euro,
  shortDate,
  tx,
} from './quick-start.model';

/**
 * Die festen Worte der Seite. Alles, was eine Person betrifft, kommt aus dem
 * versiegelten Inhalt; hier stehen nur Beschriftungen, die für jede
 * Quick-Start-Seite gleich sind.
 */
const UI = {
  de: {
    nav: { ziel: 'Ziel', plan: 'Plan', wege: 'Wege', geld: 'Geld', ads: 'Google', todo: 'Aufgaben', fragen: 'Fragen' },
    before: (n: number) => (n === 1 ? 'noch 1 Tag bis zum Start' : `noch ${n} Tage bis zum Start`),
    during: (n: number, total: number) => `Tag ${n} von ${total}`,
    after: 'Quick Start abgeschlossen',
    goal: 'Das Ziel',
    proposal: 'Vorschlag',
    plan: 'Drei Monate',
    planTitle: 'Der Plan',
    month: 'Monat',
    video: 'Video des Monats',
    code: 'Code',
    ways: 'Woher sie kommen',
    money: 'Geld',
    ads: 'Google Ads',
    perMonth: 'pro Monat',
    paidBy: 'zahlt',
    clicks: 'Klicks',
    leads: 'Anfragen',
    use: 'Diese Wörter',
    avoid: 'Nie diese',
    estimate: 'Schätzung aus Branchenwerten 2025/26, je Monat.',
    todo: 'Wer macht was',
    todoTitle: 'Aufgaben',
    due: 'bis',
    done: 'erledigt',
    open: 'offen',
    questions: 'Zu klären',
    questionsTitle: 'Fragen an dich',
    to: 'an',
    status: { ok: 'geht', risk: 'prüfen', no: 'illegal' },
    proposal2: 'Vorschlag',
    advice: 'Empfehlung',
    remark: 'Anmerkung',
    instead: 'Stattdessen',
    recommended: 'Empfohlen',
    good: 'Dafür',
    bad: 'Dagegen',
    minutes: 'Min.',
    perDay: 'pro Tag',
    footer: (date: string) => `Stand ${date}. Diese Seite ist verschlüsselt, nirgends verlinkt und öffnet sich nur mit deinem Passwort.`,
    lockAgain: 'Seite schließen',
    test: 'Testsiegel: diese Fassung ist nur zur Vorschau versiegelt und darf so nicht online gehen.',
    language: 'Sprache',
    weekCaption: 'Wochenplan Deutsch, Minuten pro Tag',
    thisWeek: 'diese Woche',
    walk: (n: number) => `${n} Min. zu Fuß`,
    partnersIn: (n: number, total: number) => `${n} von ${total} dabei`,
    partnerStatus: { plan: 'geplant', besucht: 'besucht', dabei: 'dabei', nein: 'abgesagt' },
    highlight: 'Groupon Basis',
  },
  uk: {
    nav: { ziel: 'Мета', plan: 'План', wege: 'Шляхи', geld: 'Гроші', ads: 'Google', todo: 'Завдання', fragen: 'Питання' },
    before: (n: number) => (n === 1 ? 'ще 1 день до старту' : `ще ${n} дн. до старту`),
    during: (n: number, total: number) => `День ${n} з ${total}`,
    after: 'Quick Start завершено',
    goal: 'Мета',
    proposal: 'Пропозиція',
    plan: 'Три місяці',
    planTitle: 'План',
    month: 'Місяць',
    video: 'Відео місяця',
    code: 'Код',
    ways: 'Звідки приходять клієнти',
    money: 'Гроші',
    ads: 'Google Ads',
    perMonth: 'на місяць',
    paidBy: 'платить',
    clicks: 'кліків',
    leads: 'запитів',
    use: 'Ці слова',
    avoid: 'Ніколи ці',
    estimate: 'Оцінка за галузевими даними 2025/26, на місяць.',
    todo: 'Хто що робить',
    todoTitle: 'Завдання',
    due: 'до',
    done: 'зроблено',
    open: 'відкрито',
    questions: 'Треба з’ясувати',
    questionsTitle: 'Питання до тебе',
    to: 'до',
    status: { ok: 'можна', risk: 'перевірити', no: 'не можна' },
    proposal2: 'Пропозиція',
    advice: 'Рекомендація',
    remark: 'Примітка',
    instead: 'Замість цього',
    recommended: 'Рекомендуємо',
    good: 'За',
    bad: 'Проти',
    minutes: 'хв',
    perDay: 'на день',
    footer: (date: string) => `Стан на ${date}. Ця сторінка зашифрована, ніде не має посилання і відкривається лише твоїм паролем.`,
    lockAgain: 'Закрити сторінку',
    test: 'Тестова печатка: ця версія лише для перегляду і не може бути опублікована.',
    language: 'Мова',
    weekCaption: 'Тижневий план німецької, хвилин на день',
    thisWeek: 'цей тиждень',
    walk: (n: number) => `${n} хв пішки`,
    partnersIn: (n: number, total: number) => `${n} з ${total} вже партнери`,
    partnerStatus: { plan: 'заплановано', besucht: 'відвідано', dabei: 'партнер', nein: 'відмовився' },
    highlight: 'база для Groupon',
  },
};

const OWNER_NAMES: Record<QsLang, Record<Owner, string>> = {
  de: { joe: 'Joé', leo: 'Leo', ruslana: 'Ruslana', beide: 'Beide' },
  uk: { joe: 'Жое', leo: 'Лео', ruslana: 'Руслана', beide: 'Обоє' },
};

type State = 'locked' | 'opening' | 'open';

/** Heutiges Datum als ISO-String in der Zeitzone des Geräts. */
function isoToday(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

/** „DD.MM.YYYY“ → sortierbarer Schlüssel. */
function dueKey(due?: string): string {
  return due ? `${due.slice(6, 10)}${due.slice(3, 5)}${due.slice(0, 2)}` : '99999999';
}

/**
 * Quick Start: eine interne, verschlüsselte Seite je Partnerin oder Partner
 * (3 Monate Marketing ab 15.11.2026). Beim Prerendern und vor dem Passwort
 * zeigt sie nur den Sperrbildschirm; der Inhalt wird erst im Browser
 * entschlüsselt und nie gespeichert. noindex, nicht in der Sitemap, nirgends
 * verlinkt. Klartext und Ablauf: tools/seal-intern.mjs.
 */
@Component({
  selector: 'app-quick-start',
  imports: [QsIconComponent, UnlockPanelComponent, QsDonutComponent, QsStackBarComponent, QsWeekPlanComponent],
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss', './quick-start-sections.scss'],
})
export class QuickStartComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seal = inject(InternSealService);
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);

  private readonly panel = viewChild(UnlockPanelComponent);

  readonly slug: string = this.route.snapshot.data['slug'];
  readonly lockLangs: QsLang[] = this.route.snapshot.data['lockLangs'] ?? ['de'];

  readonly state = signal<State>('locked');
  readonly error = signal<UnlockError>('');
  readonly content = signal<QuickStartContent | null>(null);
  readonly isTest = signal(false);
  readonly today = signal<string | null>(null);

  private envelope: SealedEnvelope | null = null;

  /**
   * Die Sprache folgt dem Umschalter im Seitenkopf (LanguageService), der auf
   * /intern/ nicht wegnavigiert. Kann die Seite die Sprache nicht, gilt ihre erste.
   */
  readonly lang = computed<QsLang>(() => {
    const c = this.content();
    const global = this.language.lang();
    if (!c) return 'de';
    return (c.languages as string[]).includes(global) ? (global as QsLang) : (c.languages[0] ?? 'de');
  });

  readonly ui = computed(() => UI[this.lang()]);
  readonly owners = computed(() => OWNER_NAMES[this.lang()]);

  constructor() {
    this.seo.setPageSeo({
      title: 'Quick Start | FareWell intern',
      description: 'Interne Seite von FareWell. Sie öffnet sich mit einem Passwort.',
      path: this.route.snapshot.data['path'],
      noindex: true,
      alternates: false,
    });
    afterNextRender(() => this.today.set(isoToday()));
  }

  /** Text in der aktuellen Sprache. */
  t(text: Txt | undefined): string {
    return tx(text, this.lang());
  }

  async unlock(password: string): Promise<void> {
    if (!password) {
      this.error.set('required');
      return;
    }
    this.state.set('opening');
    this.error.set('');
    try {
      this.envelope ??= await this.seal.load(this.slug);
      if (!this.envelope) {
        this.error.set('missing');
        this.state.set('locked');
        return;
      }
      const opened = await this.seal.open<QuickStartContent>(this.envelope, password);
      if (!opened) {
        this.error.set('wrong');
        this.state.set('locked');
        this.panel()?.reset();
        return;
      }
      if (opened.v !== 1 || !Array.isArray(opened.months)) {
        this.error.set('broken');
        this.state.set('locked');
        return;
      }
      this.isTest.set(this.envelope.test);
      this.content.set(opened);
      this.state.set('open');
      // Nach dem Öffnen an den Anfang, damit der Fokus nicht im leeren Formular hängt.
      setTimeout(() => document.getElementById('qs-top')?.focus());
    } catch {
      this.error.set('broken');
      this.state.set('locked');
    }
  }

  lockAgain(): void {
    this.content.set(null);
    this.state.set('locked');
    this.error.set('');
    window.scrollTo({ top: 0 });
  }

  // --- Zeitleiste -----------------------------------------------------------

  readonly totalDays = computed(() => {
    const c = this.content();
    return c ? daysBetween(c.start, c.end) : 0;
  });

  /** Wo heute auf der Zeitleiste liegt: Tage seit dem Start (negativ davor). */
  readonly dayIndex = computed(() => {
    const c = this.content();
    const today = this.today();
    return c && today ? daysBetween(c.start, today) : null;
  });

  readonly countdown = computed(() => {
    const i = this.dayIndex();
    const total = this.totalDays();
    const ui = this.ui();
    if (i === null) return '';
    if (i < 0) return ui.before(-i);
    if (i >= total) return ui.after;
    return ui.during(i + 1, total);
  });

  /** Position von heute auf der Leiste in Prozent, begrenzt auf 0 bis 100. */
  readonly todayPct = computed(() => {
    const i = this.dayIndex();
    const total = this.totalDays();
    if (i === null || !total) return null;
    return Math.min(100, Math.max(0, (i / total) * 100));
  });

  readonly monthBands = computed(() => {
    const c = this.content();
    const total = this.totalDays();
    if (!c || !total) return [];
    return c.months.map((m) => ({
      n: m.n,
      left: (daysBetween(c.start, m.from) / total) * 100,
      width: ((daysBetween(m.from, m.to) + 1) / total) * 100,
      occasion: m.occasion
        ? { left: (daysBetween(c.start, m.occasion.date) / total) * 100, label: this.t(m.occasion.label) }
        : null,
    }));
  });

  readonly startLabel = computed(() => (this.content() ? this.fullDate(this.content()!.start) : ''));
  readonly endLabel = computed(() => (this.content() ? this.fullDate(this.content()!.end) : ''));

  fullDate(iso: string): string {
    return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
  }

  short(iso: string): string {
    return shortDate(iso);
  }

  // --- Geld -----------------------------------------------------------------

  splitParts(split: QsSplit): ChartPart[] {
    return split.parts.map((p) => ({ label: this.t(p.label), value: p.pct, tone: p.tone, display: `${p.pct} %` }));
  }

  exampleParts(example: QsExample): ChartPart[] {
    return example.bars.map((b) => ({ label: this.t(b.label), value: b.amount, tone: b.tone, display: euro(b.amount) }));
  }

  euro(amount: number): string {
    return euro(amount);
  }

  // --- Abschnitte -----------------------------------------------------------

  weekLegend(section: QsWeek): WeekLegend[] {
    return section.legend.map((l) => ({ key: l.key, label: this.t(l.label), tone: l.tone }));
  }

  weekDays(section: QsWeek): WeekDay[] {
    return section.days.map((d) => ({ day: this.t(d.day), parts: d.parts }));
  }

  /** Die Wochen des Rhythmus mit Ende, Aktion und der Markierung „diese Woche“. */
  weekCells(section: QsWeeks) {
    const today = this.today();
    const byKey = new Map(section.concepts.map((k) => [k.key, k]));
    return section.weeks.map((w) => {
      const concept = byKey.get(w.key);
      const offset = today ? daysBetween(w.from, today) : -1;
      const end = new Date(Date.UTC(+w.from.slice(0, 4), +w.from.slice(5, 7) - 1, +w.from.slice(8, 10) + 6));
      return {
        from: w.from,
        to: end.toISOString().slice(0, 10),
        label: this.t(concept?.label),
        icon: concept?.icon ?? 'spark',
        tone: concept?.tone ?? 'muted',
        num: concept?.num ?? '',
        status: concept?.status ?? null,
        note: this.t(w.note),
        current: offset >= 0 && offset <= 6,
      };
    });
  }

  partnerCount(section: QsPartners): { done: number; total: number; pct: number } {
    const done = section.items.filter((p) => p.status === 'dabei').length;
    const total = section.items.length;
    return { done, total, pct: total ? (done / total) * 100 : 0 };
  }

  /** Navigation: feste Abschnitte plus die der Person, in Seitenreihenfolge. */
  readonly nav = computed(() => {
    const c = this.content();
    const ui = this.ui();
    if (!c) return [];
    return [
      { id: 'ziel', label: ui.nav.ziel },
      { id: 'plan', label: ui.nav.plan },
      { id: 'wege', label: ui.nav.wege },
      { id: 'geld', label: ui.nav.geld },
      { id: 'ads', label: ui.nav.ads },
      ...c.sections.map((s) => ({ id: s.id, label: this.t(s.nav) })),
      { id: 'aufgaben', label: ui.nav.todo },
      { id: 'fragen', label: ui.nav.fragen },
    ];
  });

  readonly todoColumns = computed(() => {
    const c = this.content();
    if (!c) return [];
    const order: Owner[] = [c.person.owner, 'joe', 'beide'];
    const byOwner = new Map<Owner, QsTodo[]>();
    for (const todo of c.todos) byOwner.set(todo.owner, [...(byOwner.get(todo.owner) ?? []), todo]);
    return order
      .filter((o, i) => order.indexOf(o) === i && byOwner.has(o))
      .map((owner) => {
        const items = [...byOwner.get(owner)!].sort((a, b) => Number(a.done ?? false) - Number(b.done ?? false) || dueKey(a.due).localeCompare(dueKey(b.due)));
        return { owner, items, open: items.filter((i) => !i.done).length };
      });
  });

  trackSection(_: number, section: QsSection): string {
    return section.id;
  }

  setLang(lang: QsLang): void {
    this.language.setLang(lang);
  }
}
