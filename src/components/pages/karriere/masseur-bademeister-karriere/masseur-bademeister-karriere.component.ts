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
  private readonly jsonLdId = 'masseur-bademeister-jobposting-schema';

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
    const inPlace = isEn ? this.inPlaceEn : this.inPlaceDe;
    const weProvide = isEn ? this.weProvideEn : this.weProvideDe;

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

    const intro = t(
      'FareWell in Nürnberg sucht eine:n Masseur:in und medizinische:n Bademeister:in. Die Stelle richtet sich an blinde und sehbehinderte Bewerber:innen; der Salon ist so eingerichtet, dass du vollständig eigenständig arbeiten kannst. Der Eingang ist stufenfrei, es gibt einen Aufzug, dein Blindenführhund ist willkommen.',
      'FareWell in Nuremberg is hiring a massage therapist and medical bath attendant (Masseur und medizinischer Bademeister). The role is addressed to blind and visually impaired applicants; the salon is set up so that you can work fully independently. The entrance is step free, there is a lift, and your guide dog is welcome.'
    );
    const arrangements = [
      t(
        'Festanstellung in Voll- oder Teilzeit, mit geregelter Vergütung, Urlaub und Sozialversicherung.',
        'Permanent employment, full or part time, with regular pay, holidays and social insurance.'
      ),
      t(
        'Selbständige Tätigkeit im Salon zu denselben Konditionen wie bei unseren anderen freiberuflichen Therapeut:innen: 70 Prozent der Nettoeinnahmen bleiben bei dir, 30 Prozent gehen an FareWell. Keine feste Miete, kein Fixum.',
        'Freelance work inside the salon on the same terms as our other freelance therapists: 70 percent of the net takings stay with you, 30 percent goes to FareWell. No fixed rent, no flat fee.'
      ),
    ];

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'JobPosting',
          '@id': `${pageUrl}#jobposting`,
          title: t(
            'Masseur:in und medizinische:r Bademeister:in (m/w/d): Stelle für blinde und sehbehinderte Bewerber:innen',
            'Massage therapist and medical bath attendant (m/f/d): a role for blind and visually impaired applicants'
          ),
          description:
            `<p>${esc(intro)}</p>` +
            `<p><strong>${esc(t('Zwei Wege, beide offen', 'Two arrangements, both open'))}</strong></p>` +
            list(arrangements) +
            `<p><strong>${esc(t('Was wir stellen', 'What we provide'))}</strong></p>` +
            list(weProvide) +
            `<p><strong>${esc(t('Was schon da ist', 'What is already in place'))}</strong></p>` +
            list(inPlace),
          inLanguage,
          datePosted: '2026-08-16',
          employmentType: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'],
          directApply: true,
          industry: t('Beauty und Wellness', 'Beauty and wellness'),
          occupationalCategory: t('Massage und Wellness', 'Massage and wellness'),
          qualifications: t(
            'Abgeschlossene Ausbildung als Masseur:in und medizinische:r Bademeister:in, zum Beispiel am bbs nürnberg oder am BFW Mainz, oder eine vergleichbare Qualifikation.',
            'Completed training as a massage therapist and medical bath attendant (Masseur und medizinischer Bademeister), for example at bbs nürnberg or BFW Mainz, or a comparable qualification.'
          ),
          workHours: t(
            'Voll- oder Teilzeit nach Vereinbarung; bei selbständiger Tätigkeit vollständig flexible Zeiten.',
            'Full or part time by agreement; fully flexible hours when working freelance.'
          ),
          hiringOrganization: {
            '@type': 'BeautySalon',
            '@id': `${ORIGIN}/#organization`,
            name: 'FareWell – Kosmetikstudio & dauerhafte Haarentfernung',
            alternateName: 'FareWell',
            url: ORIGIN,
            logo: LOGO_URL,
            sameAs: ['https://www.instagram.com/farewell.salon/'],
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Frauentorgraben 5',
              postalCode: '90443',
              addressLocality: 'Nürnberg',
              addressRegion: 'Bayern',
              addressCountry: 'DE',
            },
          },
          applicationContact: {
            '@type': 'ContactPoint',
            name: 'Joé Chatelain',
            email: KARRIERE_EMAIL,
            telephone: KARRIERE_PHONE,
            contactType: t('Bewerbung', 'Application'),
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage,
          isPartOf: { '@id': `${ORIGIN}/#website` },
          about: { '@id': `${pageUrl}#jobposting` },
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
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
