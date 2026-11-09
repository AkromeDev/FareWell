import { Component, OnInit, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { Bi, FaqEntry, PHONE_HREF, PHONE_LABEL, PriceGroup, SALON_MAIL } from '../promotion-page.model';

const PAGE_PATH = '/promotionen/aesthetische-medizin-nuernberg';

/** Preise aus seiner Preisliste vom 02.10.2026. Startpreise, keine Präparatenamen. */
const PRICE_GROUPS: PriceGroup[] = [
  {
    id: 'falten',
    title: { de: 'Faltenbehandlung', en: 'Wrinkle treatment' },
    blurb: { de: 'Mimische Falten, zum Beispiel Stirn, Zornesfalte oder Krähenfüße.', en: 'Expression lines, for example forehead, frown lines or crow\'s feet.' },
    items: [
      { name: { de: '1 Zone', en: '1 zone' }, priceFrom: 109 },
      { name: { de: '2 Zonen', en: '2 zones' }, priceFrom: 179 },
      { name: { de: '3 Zonen', en: '3 zones' }, priceFrom: 229 },
      { name: { de: '4 Zonen', en: '4 zones' }, priceFrom: 279 },
    ],
  },
  {
    id: 'lippen',
    title: { de: 'Lippen', en: 'Lips' },
    items: [
      { name: { de: 'Lippen 0,5 ml', en: 'Lips 0.5 ml' }, priceFrom: 159 },
      { name: { de: 'Lippen 1 ml', en: 'Lips 1 ml' }, priceFrom: 249 },
    ],
  },
  {
    id: 'hyaluron',
    title: { de: 'Hyaluron und Filler', en: 'Hyaluronic acid and fillers' },
    items: [
      { name: { de: 'Nasolabialfalten', en: 'Nasolabial folds' }, priceFrom: 259 },
      { name: { de: 'Marionettenfalten', en: 'Marionette lines' }, priceFrom: 259 },
      { name: { de: 'Kinn, Jawline oder Wangen', en: 'Chin, jawline or cheeks' }, priceFrom: 259 },
    ],
  },
  {
    id: 'haut',
    title: { de: 'Mesotherapie, Skinbooster, Biostimulatoren', en: 'Mesotherapy, skin boosters, biostimulators' },
    items: [
      { name: { de: 'Mesotherapie', en: 'Mesotherapy' }, priceFrom: 149 },
      { name: { de: 'Skinbooster', en: 'Skin booster' }, priceFrom: 229 },
      { name: { de: 'Biostimulatoren', en: 'Biostimulators' }, priceFrom: 429 },
    ],
  },
  {
    id: 'faeden',
    title: { de: 'Fadenlifting', en: 'Thread lift' },
    items: [
      { name: { de: 'PDO Faden', en: 'PDO thread' }, detail: { de: 'pro Faden', en: 'per thread' }, priceFrom: 79 },
      { name: { de: 'Fadenlifting', en: 'Thread lift' }, priceFrom: 449 },
    ],
  },
];

const STEPS: { title: Bi; text: Bi }[] = [
  {
    title: { de: 'Termin anfragen', en: 'Request an appointment' },
    text: { de: 'Ruf an, schreib uns oder buche online.', en: 'Call, write to us or book online.' },
  },
  {
    title: { de: 'Ärztliches Gespräch', en: 'Medical consultation' },
    text: { de: 'Dr. Leo schaut sich Anatomie, Hautzustand und deine Vorgeschichte an, klärt dich auf und nennt dir den Preis.', en: 'Dr. Leo looks at your anatomy, skin and history, explains the risks and tells you the price.' },
  },
  {
    title: { de: 'Du entscheidest in Ruhe', en: 'You decide in your own time' },
    text: { de: 'Behandelt wird nur, wenn es für dich sinnvoll ist und du es möchtest.', en: 'You are only treated if it makes sense for you and you want it.' },
  },
];

const FAQ: FaqEntry[] = [
  {
    q: { de: 'Wer führt die Behandlungen durch?', en: 'Who performs the treatments?' },
    a: { de: 'Dr. med. Andrea Leo persönlich, approbierter Arzt seit 2016, seit 2018 in der ästhetischen Medizin.', en: 'Dr. med. Andrea Leo in person, a licensed physician since 2016, in aesthetic medicine since 2018.' },
  },
  {
    q: { de: 'Was kostet eine Behandlung?', en: 'What does a treatment cost?' },
    a: { de: 'Die Preise auf dieser Seite sind Startpreise. Der endgültige Preis hängt von Befund, Umfang und Produktmenge ab und wird dir im Gespräch vor der Behandlung genannt. Ästhetische Behandlungen sind in der Regel Privatleistungen.', en: 'The prices on this page are starting prices. The final price depends on findings, scope and amount of product, and you are told it in the consultation before the treatment. Aesthetic treatments are usually private services.' },
  },
  {
    q: { de: 'Gibt es Risiken und Nebenwirkungen?', en: 'Are there risks and side effects?' },
    a: { de: 'Ja, wie bei jeder medizinischen Behandlung. Häufig und harmlos sind kleine Rötungen, Schwellungen oder blaue Flecken an der Einstichstelle. Seltene, ernstere Komplikationen bespricht Dr. Leo offen mit dir, bevor du dich entscheidest.', en: 'Yes, as with any medical treatment. Small redness, swelling or bruising at the injection site are common and harmless. Dr. Leo discusses rare, more serious complications openly with you before you decide.' },
  },
  {
    q: { de: 'In welchen Sprachen kann ich mich beraten lassen?', en: 'Which languages can I be advised in?' },
    a: { de: 'Auf Deutsch, Englisch und Italienisch. Ungarisch spricht Dr. Leo ebenfalls.', en: 'In German, English and Italian. Dr. Leo also speaks Hungarian.' },
  },
];

/**
 * Die Zielseite der Google Anzeigen (Kampagne DE - Ästhetische Medizin). Ihr
 * einziger Zweck: Google sperrt Anzeigen, deren Zielseite Wirkstoffnamen nennt
 * („Restricted drug terms", Meldung vom 09.11.2026). Deshalb stehen hier und in
 * den Ankern keine Wirkstoff- oder Markennamen und kein Link zur Botox-Seite.
 * Der Test in der spec.ts prüft das.
 *
 * noindex und nicht in der Sitemap: In der Suche soll die Botox-Seite stehen.
 */
@Component({
  selector: 'app-aesthetik-promotion',
  standalone: true,
  templateUrl: './aesthetik-promotion.component.html',
  styleUrls: ['../promotion-page.scss'],
})
export class AesthetikPromotionComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);

  readonly priceGroups = PRICE_GROUPS;
  readonly steps = STEPS;
  readonly faq = FAQ;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly mailHref = `mailto:${SALON_MAIL}`;
  readonly mailLabel = SALON_MAIL;

  get bookingUrl(): string {
    return `https://salonkee.de/salon/farewell?lang=${this.language.lang() === 'en' ? 'en' : 'de'}`;
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  bi(text: Bi): string {
    return this.t(text.de, text.en);
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t('Ästhetische Medizin in Nürnberg: Dr. med. Andrea Leo | FareWell', 'Aesthetic medicine in Nuremberg: Dr. med. Andrea Leo | FareWell'),
      description: this.t(
        'Faltenbehandlung, Lippen, Hyaluron, Mesotherapie und Fadenlifting beim Arzt in Nürnberg. Dr. med. Andrea Leo bei FareWell, Frauentorgraben 5. Beratung und Aufklärung vor jeder Behandlung.',
        'Wrinkle treatment, lips, hyaluronic acid, mesotherapy and thread lifts with a physician in Nuremberg. Dr. med. Andrea Leo at FareWell, Frauentorgraben 5. Consultation and information before every treatment.',
      ),
      path: PAGE_PATH,
      noindex: true,
    });
  }
}
