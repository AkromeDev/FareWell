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

  get stats(): GuideStat[] {
    return [
      {
        value: this.t('beides', 'both'),
        label: this.t('Festanstellung oder selbständig', 'employed or freelance'),
        animate: false,
      },
      {
        value: '0',
        label: this.t('Stufen bis in den Behandlungsraum', 'steps to the treatment room'),
        animate: false,
      },
      { value: '3', label: this.t('Behandlungsräume', 'treatment rooms') },
      {
        value: this.t('willkommen', 'welcome'),
        label: this.t('Blindenführhund', 'guide dog'),
        animate: false,
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'beruf', label: this.t('Der Beruf ist längst offen', 'A profession long open') },
      { id: 'weg', label: this.t('Der Weg zu uns', 'Getting here') },
      { id: 'salon', label: this.t('Was schon da ist', 'What is already in place') },
      { id: 'modelle', label: this.t('Zwei Wege, beide offen', 'Two arrangements, both open') },
      { id: 'unterstuetzung', label: this.t('Was wir stellen', 'What we provide') },
      { id: 'rahmen', label: this.t('Die Rahmendaten', 'The practical details') },
      { id: 'bewerben', label: this.t('Bewerben', 'Apply') },
    ];
  }

  /** Sichtbare Checkliste „Was schon da ist“; speist auch das JSON-LD. */
  get inPlace(): string[] {
    return [
      this.t(
        'Ein eingerichteter Massage-Arbeitsplatz, an dem bereits behandelt wird: Liege, Wäsche, Öle, alles vorhanden.',
        'A working massage setup where treatments already take place: couch, linen, oils, everything in place.'
      ),
      this.t(
        'Feste, dauerhafte Plätze für alle Produkte und Materialien. Nichts wandert, nichts wird umgeräumt, ohne dass wir es absprechen.',
        'Fixed permanent positions for all products and materials. Nothing wanders, and nothing gets moved without agreeing it first.'
      ),
      this.t(
        'Ein kleines Team mit kurzen Wegen und direkter Absprache.',
        'A small team with short paths and direct communication.'
      ),
      this.t(
        'Drei Behandlungsräume in einem überschaubaren Grundriss.',
        'Three treatment rooms on a compact floor plan.'
      ),
    ];
  }

  /** Sichtbare Checkliste „Was wir stellen“; speist auch das JSON-LD. */
  get weProvide(): string[] {
    return [
      this.t(
        'Eine Einarbeitung in deinem Tempo: Räume, Abläufe, Team.',
        'An induction at your pace: rooms, routines, team.'
      ),
      this.t(
        'Die Anpassung des Arbeitsplatzes, geplant mit dir statt für dich.',
        'Adapting the workplace, planned with you rather than for you.'
      ),
      this.t(
        'Unterstützung bei den Anträgen auf Arbeitsassistenz und technische Hilfsmittel, etwa beim Inklusionsamt.',
        'Support with applying for work assistance (Arbeitsassistenz) and technical aids, for example at the Inklusionsamt, the inclusion office.'
      ),
      this.t(
        'Dein Blindenführhund ist bei uns willkommen.',
        'Your guide dog is welcome here.'
      ),
    ];
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

  get emailAria(): string {
    return this.t(`E-Mail an ${this.email} schreiben`, `Write an email to ${this.email}`);
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
            list(this.weProvide) +
            `<p><strong>${esc(t('Was schon da ist', 'What is already in place'))}</strong></p>` +
            list(this.inPlace),
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
