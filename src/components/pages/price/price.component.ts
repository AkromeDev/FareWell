import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';
import {
  PRICE_SERVICES,
  PRICE_TABLES,
  PriceRow,
  PriceTable,
} from './price-data';

const PAGE_PATH = '/price';
const ORIGIN = 'https://farewell.salon';
const PAGE_TITLE_DE =
  'Preise Nürnberg: Laser-Haarentfernung, Nadelepilation & mehr | FareWell';
const PAGE_TITLE_EN =
  'Prices Nuremberg: Laser Hair Removal, Electrolysis & More | FareWell';
const PAGE_DESCRIPTION_DE =
  'Alle Preise bei FareWell Nürnberg: Laser-Haarentfernung ab 30 €, Nadelepilation ab 40 €, Microneedling ab 180 €, Massage ab 45 €. Erstberatung kostenlos.';
const PAGE_DESCRIPTION_EN =
  'All prices at FareWell Nuremberg: laser hair removal from €30, electrolysis from €40, RF microneedling from €180, massage from €45. Free initial consultation.';

const ORGANIZATION_ID = 'https://farewell.salon/#organization';

interface PriceFaqEntry {
  qDe: string;
  qEn: string;
  aDe: string;
  aEn: string;
}

/**
 * Zweisprachige Preisseite im Guide-Look (siehe FAQ/Onboarding): Preise kommen
 * ausschließlich aus price-data.ts und speisen Tabellen und JSON-LD
 * (Service/AggregateOffer/Offer + FAQPage) aus derselben Quelle.
 */
@Component({
  standalone: true,
  selector: 'app-price',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './price.component.html',
})
export class PriceComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'price-schema';

  get lang(): GuideLang {
    return this.language.lang();
  }

  readonly tables = PRICE_TABLES;

  readonly laserTables: PriceTable[] = [
    PRICE_TABLES.laserDamenGesicht,
    PRICE_TABLES.laserDamenKoerper,
    PRICE_TABLES.laserDamenIntim,
    PRICE_TABLES.laserHerrenGesicht,
    PRICE_TABLES.laserHerrenKoerper,
    PRICE_TABLES.laserHerrenIntim,
  ];

  /**
   * „Was kostet …?"-Fragen je Kategorie: sichtbar als Akkordeon in der
   * jeweiligen Sektion und deckungsgleich im FAQPage-Schema (in der Sprache
   * der aktiven Route).
   */
  readonly faqs: Record<string, PriceFaqEntry> = {
    nadelepilation: {
      qDe: 'Was kostet Nadelepilation (Elektrolyse) in Nürnberg?',
      qEn: 'How much does electrolysis (needle epilation) cost in Nuremberg?',
      aDe: 'Bei FareWell in Nürnberg kostet die Nadelepilation 40 € für 30 Minuten, 60 € für 45 Minuten, 80 € für 60 Minuten und 160 € für 120 Minuten, für Damen und Herren gleich. Die Behandlungsvorbereitung mit Betäubungscreme kostet 20 €, die Erstberatung ist kostenlos.',
      aEn: 'At FareWell in Nuremberg, electrolysis costs €40 for 30 minutes, €60 for 45 minutes, €80 for 60 minutes and €160 for 120 minutes, the same for women and men. Preparation with numbing cream costs €20, and the initial consultation is free.',
    },
    laser: {
      qDe: 'Was kostet Laser-Haarentfernung in Nürnberg?',
      qEn: 'How much does laser hair removal cost in Nuremberg?',
      aDe: 'Laser-Haarentfernung kostet bei FareWell in Nürnberg ab 30 € pro Zone. Beispiele: Achseln 60 €, Beine komplett 180 € (Damen) bzw. 200 € (Herren), Intimbereich komplett 200 € (Damen) bzw. 220 € (Herren), Ganzkörper 650 € (Damen) bzw. 750 € (Herren). Alle Preise gelten pro Sitzung und inklusive 19% MwSt.',
      aEn: 'Laser hair removal at FareWell in Nuremberg starts at €30 per area. Examples: underarms €60, complete legs €180 (women) or €200 (men), complete intimate area €200 (women) or €220 (men), full body €650 (women) or €750 (men). All prices are per session and include 19% VAT.',
    },
    microneedling: {
      qDe: 'Was kostet Radiofrequenz-Microneedling in Nürnberg?',
      qEn: 'How much does radio-frequency microneedling cost in Nuremberg?',
      aDe: 'Radiofrequenz-Microneedling kostet bei FareWell in Nürnberg 200 € für das Gesicht (45 Min.), 180 € für Hals, Dekolleté oder Brust, 450 € für die Komplettbehandlung (90 Min.) und 250 € für die Narbenbehandlung. Die Behandlungsvorbereitung mit Betäubungscreme kostet 20 €.',
      aEn: 'Radio-frequency microneedling at FareWell in Nuremberg costs €200 for the face (45 min), €180 for the neck, décolleté or chest, €450 for the complete treatment (90 min) and €250 for the scar treatment. Preparation with numbing cream costs €20.',
    },
    cellulite: {
      qDe: 'Was kostet eine Cellulite-Behandlung in Nürnberg?',
      qEn: 'How much does a cellulite treatment cost in Nuremberg?',
      aDe: 'Die Cellulite-Behandlung mit Ultraschall und Vakuumtechnik kostet bei FareWell in Nürnberg 80 € für 30 Minuten, 140 € für 60 Minuten und 200 € für 90 Minuten. Empfohlen ist eine Kur von 6 bis 10 Sitzungen im Abstand von etwa einer Woche.',
      aEn: 'The cellulite treatment with ultrasound and vacuum technology at FareWell in Nuremberg costs €80 for 30 minutes, €140 for 60 minutes and €200 for 90 minutes. A course of 6 to 10 sessions about one week apart is recommended.',
    },
    fettreduktion: {
      qDe: 'Was kostet Ultraschall-Fettreduktion (Kavitation) in Nürnberg?',
      qEn: 'How much does ultrasonic fat reduction (cavitation) cost in Nuremberg?',
      aDe: 'Die Ultraschall-Fettreduktion kostet bei FareWell in Nürnberg 80 € für 30 Minuten, 140 € für 60 Minuten und 200 € für 90 Minuten, pro Sitzung und inklusive 19% MwSt.',
      aEn: 'Ultrasonic fat reduction at FareWell in Nuremberg costs €80 for 30 minutes, €140 for 60 minutes and €200 for 90 minutes, per session and including 19% VAT.',
    },
    wellnessMassage: {
      qDe: 'Was kostet eine Wellness-Massage in Nürnberg?',
      qEn: 'How much does a wellness massage cost in Nuremberg?',
      aDe: 'Wellness-Massagen kosten bei FareWell in Nürnberg ab 45 €: Teilkörpermassage 45 € (30 Min.), Rücken-Schulter-Nacken-Massage 58 € (45 Min.) oder 78 € (60 Min.), Aromaöl-Massage für Rücken, Schulter & Nacken 78 € (45 Min.) oder 90 € (60 Min.), Ganzkörpermassage mit Aromaölen 78 € (60 Min.) oder 120 € (90 Min.).',
      aEn: 'Wellness massages at FareWell in Nuremberg start at €45: partial-body massage €45 (30 min), back, shoulder & neck massage €58 (45 min) or €78 (60 min), aroma-oil back, shoulder & neck massage €78 (45 min) or €90 (60 min), full-body massage with aroma oils €78 (60 min) or €120 (90 min).',
    },
    therapeutischeMassage: {
      qDe: 'Was kostet eine therapeutische Massage in Nürnberg?',
      qEn: 'How much does a therapeutic massage cost in Nuremberg?',
      aDe: 'Therapeutische Massagen kosten bei FareWell in Nürnberg ab 50 €: Sport- & Regenerationsmassage 50 € bis 120 €, medizinisch-funktionelle Massage 60 € bis 135 €, Ersttermin mit Anamnese & Befundaufnahme 99 € (90 Min.). Das Beratungsgespräch ist kostenlos.',
      aEn: 'Therapeutic massages at FareWell in Nuremberg start at €50: sports & recovery massage €50 to €120, medical-functional massage €60 to €135, first appointment with intake & assessment €99 (90 min). The consultation is free.',
    },
  };

  /** Reihenfolge der FAQ-Einträge im FAQPage-Schema. */
  private readonly faqOrder: (keyof PriceComponent['faqs'])[] = [
    'nadelepilation',
    'laser',
    'microneedling',
    'cellulite',
    'fettreduktion',
    'wellnessMassage',
    'therapeutischeMassage',
  ];

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(PAGE_TITLE_DE, PAGE_TITLE_EN),
      description: this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN),
      path: PAGE_PATH,
    });

    this.seo.setJsonLd(this.jsonLdId, this.buildJsonLd());

    if (this.isBrowser) {
      const fromQuery = this.route.snapshot.queryParamMap.get('lang');
      if (fromQuery === 'de' || fromQuery === 'en') {
        this.language.setLang(fromQuery);
      }
    }
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  /** Interner Link in der aktiven Sprache (auf /en/-Seiten das /en/-Gegenstück). */
  p(path: string): string {
    return this.language.localizePath(path);
  }

  price(row: PriceRow): string {
    if (row.price === null) {
      return this.t('Kostenlos', 'Free');
    }
    return this.lang === 'de' ? `${row.price} €` : `€${row.price}`;
  }

  duration(row: PriceRow): string {
    return `${row.minutes} ${this.t('Min.', 'min')}`;
  }

  get stats(): GuideStat[] {
    return [
      { value: '0 €', label: this.t('Erstberatung', 'Initial consultation') },
      { value: '90+', label: this.t('Preise, 0 Zusatzkosten', 'Prices, 0 added costs') },
      {
        value: this.t('ab 30 €', 'from €30'),
        label: this.t('Laser pro Zone', 'Laser per area'),
      },
      { value: '100%', label: this.t('Transparenz', 'Transparency') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'beratung', label: this.t('Kostenlose Erstberatung', 'Free initial consultation') },
      { id: 'nadelepilation', label: this.t('Nadelepilation (Elektrolyse)', 'Electrolysis') },
      { id: 'laser', label: this.t('Laser-Haarentfernung', 'Laser hair removal') },
      { id: 'microneedling', label: this.t('Radiofrequenz-Microneedling', 'RF microneedling') },
      { id: 'cellulite', label: this.t('Cellulite-Behandlung', 'Cellulite treatment') },
      { id: 'fettreduktion', label: this.t('Ultraschall-Fettreduktion', 'Ultrasonic fat reduction') },
      { id: 'wellness-massage', label: this.t('Wellness-Massage', 'Wellness massage') },
      { id: 'therapeutische-massage', label: this.t('Therapeutische Massage', 'Therapeutic massage') },
      { id: 'gut-zu-wissen', label: this.t('Gut zu wissen', 'Good to know') },
    ];
  }

  /**
   * JSON-LD-Graph der Preisseite: je Kategorie ein Service mit AggregateOffer
   * (alle Einzelpreise als Offer + UnitPriceSpecification), dazu FAQPage mit
   * den „Was kostet …?"-Fragen und BreadcrumbList. Alles aus price-data.ts,
   * in der Sprache der aktiven Route (DE unter /price, EN unter /en/price).
   */
  private buildJsonLd(): object {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `${ORIGIN}${isEn ? '/en' : ''}${PAGE_PATH}`;

    const services = PRICE_SERVICES.map((svc) => {
      const tables: PriceTable[] = svc.tables.map((key) => PRICE_TABLES[key]);
      const offers = tables.flatMap((table) =>
        table.rows.map((row) => this.buildOffer(pageUrl, svc.anchor, table, row))
      );
      // lowPrice = günstigste buchbare Behandlung; Zusatzleistungen wie die
      // Betäubungscreme (addon) bleiben als Offer erhalten, drücken aber
      // nicht den Einstiegspreis.
      const allRows = tables.flatMap((table) => table.rows);
      const baseRows = allRows.filter((row) => !row.addon);
      const prices = (baseRows.length ? baseRows : allRows).map((row) => row.price ?? 0);

      return {
        '@type': 'Service',
        '@id': `${pageUrl}#${svc.anchor}`,
        name: this.t(svc.nameDe, svc.nameEn),
        serviceType: this.t(svc.serviceTypeDe, svc.serviceTypeEn),
        description: this.t(svc.descriptionDe, svc.descriptionEn),
        url: `${pageUrl}#${svc.anchor}`,
        provider: { '@id': ORGANIZATION_ID },
        areaServed: { '@type': 'City', name: this.t('Nürnberg', 'Nuremberg') },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: offers.length,
          offers,
        },
      };
    });

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          url: pageUrl,
          name: this.t(PAGE_TITLE_DE, PAGE_TITLE_EN),
          description: this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN),
          inLanguage: isEn ? 'en' : 'de',
          mainEntity: this.faqOrder.map((key) => ({
            '@type': 'Question',
            name: this.t(this.faqs[key].qDe, this.faqs[key].qEn),
            acceptedAnswer: {
              '@type': 'Answer',
              text: this.t(this.faqs[key].aDe, this.faqs[key].aEn),
            },
          })),
        },
        ...services,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: isEn ? `${ORIGIN}/en` : ORIGIN,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Preise', 'Prices'),
              item: pageUrl,
            },
          ],
        },
      ],
    };
  }

  private buildOffer(pageUrl: string, anchor: string, table: PriceTable, row: PriceRow): object {
    const label = this.t(table.de, table.en);
    const scope = label ? `${label}, ` : '';
    const price = row.price ?? 0;
    return {
      '@type': 'Offer',
      name: `${scope}${this.t(row.de, row.en)} (${row.minutes} ${this.t('Min.', 'min')})`,
      url: `${pageUrl}#${anchor}`,
      price,
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price,
        priceCurrency: 'EUR',
        valueAddedTaxIncluded: true,
      },
    };
  }
}
