import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
  type GuideTocItem,
} from 'src/components/molecules/guide';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import { KARRIERE_EMAIL, KARRIERE_PHONE } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/masseur-bademeister-blind-nuernberg';
const ORIGIN = 'https://farewell.salon';
const LOGO_URL = `${ORIGIN}/assets/images/logo/android-chrome-512x512.png`;

/**
 * Veröffentlichungsdatum der Seite und Ablauf der Anzeige (datePosted plus
 * sechs Monate). Beide fest verdrahtet, nicht aus `new Date()` berechnet:
 * Ein mitwanderndes datePosted lässt die Stelle in der Google-Jobsuche
 * dauerhaft als „heute veröffentlicht" erscheinen. Läuft validThrough ab und
 * die Stelle ist noch offen, hier beide Werte neu setzen.
 */
const DATE_POSTED = '2026-08-16';
const VALID_THROUGH = '2027-02-16';

/** Minimales HTML-Escaping für die eingebettete Stellenbeschreibung. */
function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function list(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

/**
 * Stellenseite Masseur:in und medizinische:r Bademeister:in, gerichtet an
 * blinde und sehbehinderte Bewerber:innen. Sie existiert zusätzlich zur
 * allgemeinen Masseur:innen-Seite, weil die praktischen Fragen andere sind
 * und wir sie direkt beantworten statt sie erfragen zu lassen.
 *
 * Sprachaufbau bewusst anders als der Rest des Baukastens: Der Fließtext
 * steht pro Abschnitt zuerst komplett auf Deutsch (Block mit lang="de"),
 * darunter komplett auf Englisch (Block mit lang="en" unter der dezenten
 * Überschrift „In English"). Deshalb gibt es die Listen hier als getrennte
 * De-/En-Arrays statt über t(); nur Hero, Überschriften, TOC und Metadaten
 * folgen weiter der URL-Sprache. Begründung im Template-Kommentar.
 *
 * Bewusst KEINE Unterklasse von KarriereDetailPage: Diese Stelle gibt es auch
 * als Festanstellung (employmentType FULL_TIME/PART_TIME statt nur
 * CONTRACTOR), und die geteilten Deal-/FAQ-Bausteine sind rein freiberuflich
 * formuliert. Der Bewerbungsblock ist ebenfalls eigen, weil hier Anruf und
 * E-Mail gleichberechtigte Wege sind (eigener Telefon-Button statt Instagram).
 */
@Component({
  standalone: true,
  selector: 'app-masseur-bademeister-karriere',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './masseur-bademeister-karriere.component.html',
})
export class MasseurBademeisterKarriereComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);

  /**
   * Zwei getrennte JSON-LD-Blöcke statt eines @graph: Die JobPosting steht als
   * eigenständiges Dokument im Head (vorgegebene Struktur, deutsche Copy,
   * unabhängig von der URL-Sprache), WebPage und Breadcrumb bleiben im Graph
   * und folgen weiter der Seitensprache.
   */
  private readonly jobPostingLdId = 'masseur-bademeister-jobposting-schema';
  private readonly pageLdId = 'masseur-bademeister-webpage-schema';

  readonly email = KARRIERE_EMAIL;
  readonly phone = KARRIERE_PHONE;

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  /**
   * Kennzahlen bewusst deutsch (die Seite liest sich deutsch zuerst) und mit
   * srText als vollständigem Satz: Wert und Label allein wären linear gelesen
   * zusammenhanglose Fragmente („beides", „0", „3", „willkommen").
   */
  readonly stats: GuideStat[] = [
    {
      value: 'beides',
      label: 'Festanstellung oder selbständig',
      srText: 'Festanstellung oder selbständige Tätigkeit, beides ist möglich.',
      animate: false,
    },
    {
      value: '0',
      label: 'Stufen bis in den Behandlungsraum',
      srText: 'Null Stufen bis in den Behandlungsraum.',
      animate: false,
    },
    {
      value: '3',
      label: 'Behandlungsräume',
      srText: 'Drei Behandlungsräume.',
    },
    {
      value: 'willkommen',
      label: 'Blindenführhund',
      srText: 'Blindenführhund willkommen.',
      animate: false,
    },
  ];

  get toc(): GuideTocItem[] {
    return [
      { id: 'beruf', label: this.t('Der Beruf ist längst offen', 'A profession long open') },
      { id: 'weg', label: this.t('Der Weg zu uns', 'Getting here') },
      { id: 'salon', label: this.t('Was schon da ist', 'What is already in place') },
      { id: 'keine-baeder', label: this.t('Massage, keine Bäder', 'Massage, no baths') },
      { id: 'modelle', label: this.t('Zwei Wege, beide offen', 'Two arrangements, both open') },
      { id: 'unterstuetzung', label: this.t('Was wir stellen', 'What we provide') },
      { id: 'rahmen', label: this.t('Die Rahmendaten', 'The practical details') },
      { id: 'bewerben', label: this.t('Bewerben', 'Apply') },
    ];
  }

  /** Checkliste „Was schon da ist", deutsch; speist auch das JSON-LD. */
  readonly inPlaceDe: string[] = [
    'Stufenfreier Eingang, Aufzug im Haus, keine Treppe bis in den Behandlungsraum.',
    'Ein eingerichteter Massage-Arbeitsplatz, an dem bereits behandelt wird: Liege, Wäsche, Öle, alles vorhanden.',
    'Feste, dauerhafte Plätze für alle Produkte und Materialien. Nichts wandert, nichts wird umgeräumt, ohne dass wir es absprechen.',
    'Ein kleines Team mit kurzen Wegen und direkter Absprache.',
    'Drei Behandlungsräume in einem überschaubaren Grundriss.',
    'Du bist nie allein im Salon. Es ist immer mindestens eine weitere Person da, die kurz einspringen kann, wenn etwas gebraucht wird.',
    'Für den Kalender und die Terminübersicht richten wir eine Sprachsteuerung ein. Welche Lösung wir nehmen, entscheiden wir mit dir, nicht für dich.',
  ];

  /** Checkliste „Was schon da ist", englisch; speist auch das JSON-LD auf /en. */
  readonly inPlaceEn: string[] = [
    'A step-free entrance, a lift in the building and not a single stair on the way to the treatment room.',
    'A working massage setup where treatments already take place: couch, linen, oils, everything in place.',
    'Fixed permanent positions for all products and materials. Nothing wanders, and nothing gets moved without agreeing it first.',
    'A small team with short paths and direct communication.',
    'Three treatment rooms on a compact floor plan.',
    'You are never alone in the salon. There is always at least one other person present who can step in for a moment if something is needed.',
    'For the calendar and the appointment overview we will set up voice control software. Which solution we use is something we decide with you, not for you.',
  ];

  /** Checkliste „Was wir stellen", deutsch; speist auch das JSON-LD. */
  readonly weProvideDe: string[] = [
    'Eine Einarbeitung in deinem Tempo: Räume, Abläufe, Team.',
    'Die Anpassung des Arbeitsplatzes, geplant mit dir statt für dich.',
    'Unterstützung bei den Anträgen auf Arbeitsassistenz und technische Hilfsmittel, etwa beim Inklusionsamt.',
    'Dein Blindenführhund ist bei uns willkommen.',
  ];

  /** Checkliste „Was wir stellen", englisch; speist auch das JSON-LD auf /en. */
  readonly weProvideEn: string[] = [
    'An induction at your pace: rooms, routines, team.',
    'Adapting the workplace, planned with you rather than for you.',
    'Support with applying for work assistance (Arbeitsassistenz) and technical aids, for example at the Inklusionsamt, the inclusion office.',
    'Your guide dog is welcome here.',
  ];

  /**
   * Die vollständige deutsche Seitencopy als escaptes HTML für das
   * JobPosting-Feld `description` — auch auf /en, weil die Anzeige selbst
   * deutsch ist (`inLanguage: 'de'`).
   *
   * Der Fließtext steht damit zweimal im Repo, hier und im Template. Das ist
   * gewollt: Google verlangt in `description` die volle Stellenbeschreibung
   * als HTML, das Template braucht Angular-Bindings und Links. Wird oben im
   * Template ein deutscher Absatz geändert, gehört er hier mitgeändert.
   * Links bleiben hier absichtlich weg, Google entfernt sie ohnehin.
   */
  private get jobDescriptionDe(): string {
    const p = (text: string) => `<p>${esc(text)}</p>`;
    const h = (text: string) => `<p><strong>${esc(text)}</strong></p>`;

    return [
      p(
        'Unsere allgemeine Stellenseite für Masseur:innen steht allen offen, auch dir. Diese Seite gibt es zusätzlich: Wenn du blind oder sehbehindert bist, sind die praktischen Fragen andere, und wir beantworten sie lieber direkt, statt dich alles einzeln erfragen zu lassen.'
      ),
      p(
        'Wir stellen die Person ein, die fachlich am besten qualifiziert ist, und wir haben einen Salon gebaut, in dem eine blinde Therapeutin oder ein blinder Therapeut vollständig eigenständig arbeiten kann. Eine Anstellung wie jede andere, Barrierefreiheit als Kompetenz.'
      ),
      h('Der Beruf ist längst offen'),
      p(
        'Masseur:in und medizinische:r Bademeister:in ist in Deutschland seit Jahrzehnten ein Beruf, in dem blinde und sehbehinderte Menschen ausgebildet werden und arbeiten. Die Ausbildung gibt es unter anderem am bbs nürnberg (Bildungszentrum für Blinde und Sehbehinderte), wenige Kilometer von unserem Salon, und am BFW Mainz (Berufsförderungswerk). Die Vermittlungsquoten der Absolvent:innen liegen nahe 100 Prozent.'
      ),
      p(
        'Der Engpass war nie das Können. Der Engpass sind Arbeitgeber, die bereit sind, einen Arbeitsplatz anzupassen. Wir haben unseren angepasst.'
      ),
      h('Der Weg zu uns'),
      p(
        'Der Salon liegt am Frauentorgraben 5, direkt zwischen dem U-Bahnhof Opernhaus (U2, U3) und dem Hauptbahnhof. Der Eingang ist stufenfrei, es gibt einen Aufzug, und auf dem gesamten Weg von der Straße bis in den Behandlungsraum liegt keine einzige Treppe.'
      ),
      p(
        'Eine ausführliche Wegbeschreibung, Schritt für Schritt von der U-Bahn bis zur Liege, gehen wir am liebsten gemeinsam ab und schreiben sie danach auf. Melde dich, dann machen wir einen Termin.'
      ),
      h('Was schon da ist'),
      p(
        'Du fängst nicht bei null an. Der Massagebereich läuft, und das Haus ist klein genug, um es schnell zu kennen.'
      ),
      list(this.inPlaceDe),
      h('Massage, keine Bäder'),
      p(
        'Ehrlich gesagt: Bäder, Fango und Hydrotherapie gibt es bei uns nicht. Wir machen Massage. Der Bademeisterteil deiner Ausbildung kommt hier also nicht zum Einsatz. Wir nennen die vollständige Berufsbezeichnung trotzdem, weil sie deine ist, und sagen dir lieber vorher, was dich erwartet.'
      ),
      h('Zwei Wege, beide offen'),
      p(
        'Es gibt zwei Möglichkeiten, bei uns zu arbeiten, und wir sind ehrlich offen für beide. Welche besser passt, hängt von deinem Leben ab, nicht von unserem Plan.'
      ),
      p(
        '1. Festanstellung in Voll- oder Teilzeit, mit allem, was dazugehört: geregelte Vergütung, Urlaub, Sozialversicherung. Den Stundenumfang legen wir gemeinsam fest.'
      ),
      p(
        '2. Selbständige Tätigkeit im Salon zu denselben Konditionen wie bei unseren anderen freiberuflichen Therapeut:innen: Du behältst 70 Prozent deiner Nettoeinnahmen, 30 Prozent gehen an uns für Raum, Buchung und Sichtbarkeit. Keine feste Miete, kein Fixum.'
      ),
      h('Was wir stellen'),
      list(this.weProvideDe),
      h('Die Rahmendaten'),
      p('Stundenumfang: Voll- oder Teilzeit, den Umfang legen wir gemeinsam fest.'),
      p('Vergütung: Nach Vereinbarung. Wir sprechen im ersten Gespräch offen über Zahlen.'),
      p('Startdatum: Ab sofort, sobald es für dich passt.'),
      h('So bewirbst du dich'),
      p(
        'Schreib uns eine E-Mail oder ruf an, beides ist uns gleich lieb. Es gibt kein Formular und keine Vorlage: Ein paar Sätze zu dir und deiner Ausbildung reichen. Ein Lebenslauf ist in jedem Format willkommen, ein Foto brauchst du nicht. Deine Ansprechperson ist Joé Chatelain.'
      ),
      p(
        'Ruf gerne einfach an, ohne Termin und ohne Anmeldung. Mo bis Fr 10 bis 20 Uhr, Sa 8 bis 17 Uhr.'
      ),
    ].join('');
  }

  get applySubject(): string {
    return this.t(
      'Bewerbung als Masseur:in und medizinische:r Bademeister:in bei FareWell',
      'Application as a massage therapist and medical bath attendant at FareWell'
    );
  }

  get mailHref(): string {
    return `mailto:${this.email}?subject=${encodeURIComponent(this.applySubject)}`;
  }

  /** Sagt vorab, dass sich ein Mailprogramm öffnet (vgl. app-karriere-apply). */
  get mailAria(): string {
    return this.t(
      `E-Mail schreiben: E-Mail an ${this.email} mit dem Betreff „${this.applySubject}“`,
      `Write an email: an email to ${this.email} with the subject “${this.applySubject}”`
    );
  }

  /** tel:-Ziel ohne Leerzeichen — mit Leerzeichen wählt kein Telefon. */
  get phoneHref(): string {
    return `tel:${this.phone.replace(/\s/g, '')}`;
  }

  /** Ziffer für Ziffer, damit die Nummer mitschreibbar bleibt. */
  get phoneAria(): string {
    const digits = this.phone.replace(/\s/g, '').split('').join(' ');
    return this.t(`Telefon ${digits}`, `Phone ${digits}`);
  }

  ngOnInit(): void {
    const t = (de: string, en: string) => this.t(de, en);
    const isEn = this.language.lang() === 'en';
    const pageUrl = `${ORIGIN}${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? `${ORIGIN}/en` : ORIGIN;
    const inLanguage = isEn ? 'en' : 'de';

    const title = t(
      'Masseur:in und medizinische:r Bademeister:in (m/w/d) in Nürnberg: für blinde und sehbehinderte Bewerber:innen | FareWell',
      'Massage Therapist (m/f/d) in Nuremberg: a Role for Blind and Visually Impaired Applicants | FareWell'
    );
    const description = t(
      'FareWell Nürnberg sucht eine:n Masseur:in und medizinische:n Bademeister:in, blind oder sehbehindert: Festanstellung oder selbständige Tätigkeit, eingerichteter Arbeitsplatz, stufenfreier Weg von der U-Bahn, Blindenführhund willkommen.',
      'FareWell Nuremberg is hiring a blind or visually impaired massage therapist (Masseur und medizinischer Bademeister): permanent employment or freelance work, an adapted workplace, a step-free route from the U-Bahn and a welcome for guide dogs.'
    );

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      // encodeURI wegen des Leerzeichens im Assetnamen (vgl. KarriereDetailPage).
      image: encodeURI(`${ORIGIN}/assets/images/massages/tm massaging.jpg`),
      // Ohne eigenes Alt fiele og:image:alt auf den Empfangs-Text des
      // SeoService zurück; das Bild zeigt aber eine Massagebehandlung.
      imageAlt: t(
        'Massagebehandlung bei FareWell in Nürnberg',
        'A massage treatment at FareWell in Nuremberg'
      ),
      largeImage: true,
    });

    this.seo.setJsonLd(this.jobPostingLdId, {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title: 'Masseur:in und medizinische:r Bademeister:in (m/w/d)',
      identifier: {
        '@type': 'PropertyValue',
        name: 'FareWell',
        value: 'FW-MASSAGE-INKLUSIV-2026',
      },
      description: this.jobDescriptionDe,
      inLanguage: 'de',
      datePosted: DATE_POSTED,
      validThrough: VALID_THROUGH,
      // Bewusst ohne CONTRACTOR, obwohl die Seite die selbständige Tätigkeit
      // gleichberechtigt anbietet: so vorgegeben. Wenn die freiberufliche
      // Variante über die Jobsuche gefunden werden soll, muss CONTRACTOR
      // zurück in diese Liste.
      employmentType: ['FULL_TIME', 'PART_TIME'],
      hiringOrganization: {
        '@type': 'Organization',
        name: 'FareWell',
        sameAs: ORIGIN,
        logo: LOGO_URL,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Frauentorgraben 5',
          addressLocality: 'Nürnberg',
          postalCode: '90443',
          addressRegion: 'BY',
          addressCountry: 'DE',
        },
      },
      directApply: true,
      qualifications:
        'Abgeschlossene Ausbildung als Masseur:in und medizinische:r Bademeister:in oder eine vergleichbare Qualifikation.',
      responsibilities:
        'Durchführung von Wellness- und therapeutischen Massagen sowie eigenständige Betreuung der Kund:innen. Bäder, Fango und Hydrotherapie gehören nicht zum Angebot.',
      occupationalCategory: '32552 Masseur/in und medizinische/r Bademeister/in',
    });

    this.seo.setJsonLd(this.pageLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage,
          isPartOf: { '@id': `${ORIGIN}/#website` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: t('Karriere', 'Careers'),
              item: `${ORIGIN}${isEn ? '/en' : ''}/karriere`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: t(
                'Karriere: Masseur:in, blind oder sehbehindert',
                'Careers: massage therapist, blind or visually impaired'
              ),
              item: pageUrl,
            },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jobPostingLdId);
    this.seo.clearJsonLd(this.pageLdId);
  }
}
