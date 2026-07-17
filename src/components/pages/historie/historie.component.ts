import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTimelineEvent,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/historie';
const HERO_IMAGE = 'assets/images/farewell/Historie-Washington-DC-Electrolysis.jpg';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const PAGE_TITLE_DE = 'Die Geschichte der Elektrolyse | FareWell Nürnberg';
const PAGE_TITLE_EN = 'The History of Electrolysis | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Die Elektrolyse entfernt Haare seit über einem Jahrhundert permanent. Entdecke die Geschichte der einzigen wirklich permanenten Haarentfernungsmethode.';
const PAGE_DESCRIPTION_EN =
  'Electrolysis has been removing hair permanently for over a century. Discover the history of the only truly permanent hair removal method.';
const HERO_ALT_DE =
  'Historisches Schaufenster eines Kosmetiksalons in Washington, D.C. mit der Aufschrift ELECTROLYSIS';
const HERO_ALT_EN =
  'Historic beauty salon shop window in Washington, D.C. with the sign ELECTROLYSIS';

@Component({
  selector: 'app-historie',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './historie.component.html',
})
export class HistorieComponent implements OnInit, OnDestroy {
  private readonly language = inject(LanguageService);
  private readonly seo = inject(SeoService);
  private readonly jsonLdId = 'historie-schema';

  readonly heroImage = HERO_IMAGE;

  get lang(): GuideLang {
    return this.language.lang();
  }

  get heroImageAlt(): string {
    return this.t(HERO_ALT_DE, HERO_ALT_EN);
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      { value: '1875', label: this.t('erste Elektrolyse-Behandlung', 'first electrolysis treatment') },
      {
        value: this.t('150+ Jahre', '150+ years'),
        label: this.t('erprobt und permanent', 'proven and permanent'),
      },
      { value: '10', label: this.t('Meilensteine in dieser Geschichte', 'milestones in this history') },
      {
        value: this.t('die einzige', 'the only'),
        label: this.t('rechtlich permanente Methode', 'legally permanent method'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'bewaehrt', label: this.t('Über 150 Jahre bewährt', 'Proven for 150+ years') },
      { id: 'zeitstrahl', label: this.t('Der Zeitstrahl', 'The timeline') },
      { id: 'heute', label: this.t('Von 1875 zu heute', 'From 1875 to today') },
    ];
  }

  /** Meilensteine der Elektrolyse-Geschichte für den Zeitstrahl. */
  get timeline(): GuideTimelineEvent[] {
    const t = (de: string, en: string) => this.t(de, en);
    return [
      {
        year: '1875',
        text: t(
          'Charles Michel M.D. entfernt erstmals mit galvanischem Strom (Elektrolyse) eingewachsene Wimpern.',
          'Charles Michel M.D. first removes ingrown eyelashes using galvanic current (electrolysis).',
        ),
      },
      {
        year: '1887',
        text: t(
          'Heinrich Hertz stellt mittels Oszillator hochfrequenten Strom (Thermolyse) her.',
          'Heinrich Hertz generates high-frequency current (thermolysis) with an oscillator.',
        ),
      },
      {
        year: '1916',
        text: t(
          'Prof. Paul Klee entwickelt das „multiple needle Verfahren“ (4 bis 6 Sonden gleichzeitig).',
          'Prof. Paul Klee develops the "multiple needle method" (4 to 6 probes at once).',
        ),
      },
      {
        year: '1920',
        text: t(
          'Photoepilation mit weichen Röntgenstrahlen, später wegen Hautkrebsgefahr abgelehnt.',
          'Photoepilation with soft X-rays, later rejected because of the risk of skin cancer.',
        ),
      },
      {
        year: '1923',
        text: t(
          'Dr. Jules Bordier nutzt Thermolyse zur Epilation.',
          'Dr. Jules Bordier uses thermolysis for hair removal.',
        ),
      },
      {
        year: '1938',
        text: t(
          'Die Blendmethode wird durch Henri St. Pierre & Arthur Hinkel entwickelt.',
          'The blend method is developed by Henri St. Pierre and Arthur Hinkel.',
        ),
      },
      {
        year: '1948',
        text: t('Die Blendmethode wird patentiert.', 'The blend method is patented.'),
      },
      {
        year: '1968',
        text: t(
          'Arthur Hinkel verfasst das erste maßgebliche Lehrbuch zur Epilation.',
          'Arthur Hinkel writes the first authoritative textbook on electrolysis.',
        ),
      },
      {
        year: '1970',
        text: t(
          'Die Hochfrequenzpinzette wird für die Epilation verwendet.',
          'High-frequency tweezers are used for hair removal.',
        ),
      },
      {
        year: '1989',
        text: t(
          '„Pinzettengeräte“ tauchen auf, ohne permanente oder dauerhafte Haarentfernung.',
          '"Tweezer devices" appear, offering no permanent or lasting hair removal.',
        ),
      },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon';
    const title = this.t(PAGE_TITLE_DE, PAGE_TITLE_EN);
    const description = this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN);

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: this.heroImageAlt,
      largeImage: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          headline: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          image: HERO_IMAGE_URL,
          about: this.t('Geschichte der Elektrolyse', 'History of electrolysis'),
          author: { '@id': 'https://farewell.salon/#organization' },
          publisher: { '@id': 'https://farewell.salon/#organization' },
          mainEntityOfPage: pageUrl,
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: { '@id': 'https://farewell.salon/#website' },
          primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE_URL },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Historie', 'History'),
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
