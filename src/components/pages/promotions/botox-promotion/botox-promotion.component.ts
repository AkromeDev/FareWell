import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { Bi, FaqEntry, ORIGIN, PHONE_HREF, PHONE_LABEL, PriceGroup } from '../promotion-page.model';
import { DR_LEO_PRACTICE_ID, drLeoPersonNode, drLeoPracticeNode } from 'src/app/domain/entities';

const PAGE_PATH = '/promotionen/botox-nuernberg';

/** Preise aus seiner Preisliste vom 02.10.2026, wie in Salonkee. Startpreise. */
const PRICE_GROUPS: PriceGroup[] = [
  {
    id: 'zonen',
    title: { de: 'Nach Zonen', en: 'By zones' },
    blurb: { de: 'Zum Beispiel Stirn, Zornesfalte oder Krähenfüße.', en: 'For example forehead, frown lines or crow\'s feet.' },
    items: [
      { name: { de: '1 Zone', en: '1 zone' }, priceFrom: 109 },
      { name: { de: '2 Zonen', en: '2 zones' }, priceFrom: 179 },
      { name: { de: '3 Zonen', en: '3 zones' }, priceFrom: 229 },
      { name: { de: '4 Zonen', en: '4 zones' }, priceFrom: 279 },
    ],
  },
  {
    id: 'regionen',
    title: { de: 'Einzelne Regionen', en: 'Single regions' },
    items: [
      { name: { de: 'Bunny Lines', en: 'Bunny lines' }, priceFrom: 89 },
      { name: { de: 'Gummy Smile', en: 'Gummy smile' }, priceFrom: 89 },
      { name: { de: 'Lip Flip', en: 'Lip flip' }, priceFrom: 89 },
      { name: { de: 'Kinn (Pflastersteinkinn)', en: 'Chin (cobblestone chin)' }, priceFrom: 89 },
      { name: { de: 'Mundwinkel (DAO)', en: 'Corners of the mouth (DAO)' }, priceFrom: 89 },
      { name: { de: 'Brow Lift', en: 'Brow lift' }, priceFrom: 99 },
    ],
  },
  {
    id: 'mehr',
    title: { de: 'Masseter, Nefertiti Lift, Schwitzen', en: 'Masseter, Nefertiti lift, sweating' },
    items: [
      { name: { de: 'Masseter, Bruxismus (Zähneknirschen)', en: 'Masseter, bruxism (teeth grinding)' }, priceFrom: 219 },
      { name: { de: 'Nefertiti Lift (Platysma)', en: 'Nefertiti lift (platysma)' }, priceFrom: 219 },
      { name: { de: 'Hyperhidrose (übermäßiges Schwitzen)', en: 'Hyperhidrosis (excessive sweating)' }, priceFrom: 250 },
    ],
  },
];

/**
 * Hier die Promotionen eintragen, sobald Joé sie festgelegt hat. Solange die
 * Liste leer ist, zeigt die Seite den Block nicht. Rabatte auf ärztliche
 * Leistungen vorher vom Anwalt prüfen lassen (GOÄ, § 7 HWG, LG Berlin II 2025).
 */
const CURRENT_PROMOTIONS: { title: Bi; text: Bi }[] = [];

const FAQ: FaqEntry[] = [
  {
    q: { de: 'Wo bekomme ich Botox in Nürnberg?', en: 'Where can I get Botox in Nuremberg?' },
    a: {
      de: 'Zum Beispiel bei FareWell am Frauentorgraben 5, zwei Minuten vom Hauptbahnhof. Dr. med. Andrea Leo behandelt dort ab dem 16.11.2026 persönlich. Termine buchst du online über Salonkee.',
      en: 'For example at FareWell, Frauentorgraben 5, two minutes from the main station. Dr. med. Andrea Leo treats there in person from 16 November 2026. You book online through Salonkee.',
    },
  },
  {
    q: { de: 'Was kostet Botox in Nürnberg?', en: 'How much does Botox cost in Nuremberg?' },
    a: {
      de: 'Bei FareWell kostet eine Zone ab 109 €, zwei Zonen ab 179 €, drei Zonen ab 229 € und vier Zonen ab 279 €. Einzelne Regionen wie Bunny Lines oder Lip Flip beginnen bei 89 €. Der endgültige Preis hängt von Befund, Umfang und Produktmenge ab und wird dir vor der Behandlung genannt.',
      en: 'At FareWell one zone starts at €109, two zones at €179, three zones at €229 and four zones at €279. Single regions such as bunny lines or a lip flip start at €89. The final price depends on findings, scope and amount of product, and you are told it before the treatment.',
    },
  },
  {
    q: { de: 'Wo ist Botox in Nürnberg günstig?', en: 'Where is Botox affordable in Nuremberg?' },
    a: {
      de: 'Vergleiche den Preis pro Zone und frag, wer behandelt. Bei FareWell stehen die Preise offen auf dieser Seite: einzelne Regionen ab 89 €, eine Zone ab 109 €. Laufende Aktionen findest du unter farewell.salon/promotionen. Ein niedriger Preis ersetzt nie die ärztliche Beratung.',
      en: 'Compare the price per zone and ask who treats you. At FareWell the prices are open on this page: single regions from €89, one zone from €109. Current offers are at farewell.salon/promotionen. A low price never replaces medical advice.',
    },
  },
  {
    q: { de: 'Wo sollte ich mein Botox machen lassen?', en: 'Where should I get my Botox done?' },
    a: {
      de: 'Bei einem Arzt oder einer Ärztin, denn die Injektion ist Ärzt:innen vorbehalten. Achte darauf, dass die Person selbst behandelt, dich vorher aufklärt und den Preis vorab nennt. Bei FareWell macht das Dr. med. Andrea Leo persönlich, approbierter Arzt seit 2016 und seit 2018 in der ästhetischen Medizin.',
      en: 'With a physician, because the injection is reserved for physicians. Make sure they treat you themselves, explain the risks first and name the price in advance. At FareWell, Dr. med. Andrea Leo does this in person, a licensed physician since 2016 and in aesthetic medicine since 2018.',
    },
  },
  {
    q: { de: 'Wie lange hält Botox?', en: 'How long does Botox last?' },
    a: {
      de: 'In der Regel setzt die Wirkung nach drei bis sieben Tagen ein, ist nach etwa zwei Wochen voll da und lässt nach drei bis sechs Monaten von selbst nach. Wie lange genau, ist individuell.',
      en: 'The effect usually starts after three to seven days, is fully there after about two weeks and wears off on its own after three to six months. Exactly how long is individual.',
    },
  },
  {
    q: { de: 'Gibt es Risiken und Nebenwirkungen?', en: 'Are there risks and side effects?' },
    a: {
      de: 'Ja, wie bei jeder medizinischen Behandlung. Häufig und harmlos sind kleine Rötungen, Schwellungen oder blaue Flecken an der Einstichstelle. Seltene, ernstere Komplikationen bespricht Dr. Leo offen mit dir in der Aufklärung, bevor du dich entscheidest. In Schwangerschaft und Stillzeit, bei bestimmten Erkrankungen oder einer akuten Infektion im Behandlungsbereich rät er ab.',
      en: 'Yes, as with any medical treatment. Small redness, swelling or bruising at the injection site are common and harmless. Dr. Leo discusses rare, more serious complications openly with you before you decide. He advises against it in pregnancy and breastfeeding, with certain illnesses or an acute infection in the treatment area.',
    },
  },
  {
    q: { de: 'Was bedeutet Botox auf dieser Seite?', en: 'What does Botox mean on this page?' },
    a: {
      de: 'Botox ist der geläufige Name für Behandlungen mit Botulinumtoxin, einem verschreibungspflichtigen Arzneimittel. Welches Präparat infrage kommt, entscheidet der Arzt im Gespräch mit dir.',
      en: 'Botox is the common name for treatments with botulinum toxin, a prescription medicine. The physician decides with you which product is suitable.',
    },
  },
  {
    q: { de: 'In welchen Sprachen kann ich mich beraten lassen?', en: 'Which languages can I be advised in?' },
    a: {
      de: 'Auf Deutsch, Englisch und Italienisch, Dr. Leos Muttersprache. Ungarisch spricht er ebenfalls.',
      en: 'In German, English and Italian, Dr. Leo\'s native language. He also speaks Hungarian.',
    },
  },
];

/**
 * Die Botox-Seite für Suche und KI-Dienste: indexierbar, in Sitemap und llms.txt.
 * Das Wort „Botox" und der Titel sind Joés Entscheidung vom 09.11.2026.
 *
 * NICHT als Ziel von Google Anzeigen verwenden: Google sperrt Anzeigen, deren
 * Zielseite Wirkstoffnamen nennt. Dafür gibt es die Seite aesthetik-promotion.
 *
 * Bewusst kein „der günstigste in Nürnberg": das müsste belegbar sein (§ 5 UWG,
 * § 3 HWG). Die Seite beantwortet die Frage mit den echten Preisen.
 */
@Component({
  selector: 'app-botox-promotion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './botox-promotion.component.html',
  styleUrls: ['../promotion-page.scss'],
})
export class BotoxPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'botox-promotion-schema';

  readonly priceGroups = PRICE_GROUPS;
  readonly promotions = CURRENT_PROMOTIONS;
  readonly faq = FAQ;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;

  get bookingUrl(): string {
    return `https://salonkee.de/salon/farewell?lang=${this.language.lang() === 'en' ? 'en' : 'de'}`;
  }

  get hubLink(): string {
    return this.language.localizePath('/promotionen');
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  bi(text: Bi): string {
    return this.t(text.de, text.en);
  }

  ngOnInit(): void {
    const prefix = this.language.prefix();
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const title = this.t(
      'Botox Nürnberg: ab 89 €, Dr. med. Andrea Leo | FareWell',
      'Botox Nuremberg: from €89, Dr. med. Andrea Leo | FareWell',
    );
    const description = this.t(
      'Botox in Nürnberg bei Dr. med. Andrea Leo, bei FareWell am Frauentorgraben 5. Einzelne Regionen ab 89 €, eine Zone ab 109 €. Ab 16.11.2026 bei FareWell.',
      'Botox in Nuremberg with Dr. med. Andrea Leo at FareWell, Frauentorgraben 5. Single regions from €89, one zone from €109. From 16 November 2026.',
    );

    this.seo.setPageSeo({ title, description, path: PAGE_PATH });
    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        drLeoPersonNode((de, en) => this.t(de, en)),
        drLeoPracticeNode(),
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t('Botox in Nürnberg', 'Botox in Nuremberg'),
          serviceType: 'Botox',
          provider: { '@id': DR_LEO_PRACTICE_ID },
          areaServed: { '@type': 'City', name: 'Nürnberg' },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.t('Preise', 'Prices'),
            itemListElement: PRICE_GROUPS.flatMap((group) => group.items).map((item) => ({
              '@type': 'Offer',
              name: this.bi(item.name),
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: item.priceFrom,
                priceCurrency: 'EUR',
              },
            })),
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          inLanguage: this.language.lang(),
          mainEntity: FAQ.map((entry) => ({
            '@type': 'Question',
            name: this.bi(entry.q),
            acceptedAnswer: { '@type': 'Answer', text: this.bi(entry.a) },
          })),
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
