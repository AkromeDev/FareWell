import { Component, OnInit, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { Bi, LIPS_SPECIAL, PHONE_HREF, PHONE_LABEL } from '../promotion-page.model';

const PAGE_PATH = '/promotionen/lippen-nuernberg';

/** WhatsApp an dieselbe Nummer wie PHONE_HREF. */
const WHATSAPP_HREF = 'https://wa.me/4915757995694';

const STEPS: { title: Bi; text: Bi }[] = [
  {
    title: { de: 'Beratung', en: 'Consultation' },
    text: { de: 'Du sagst, was du dir wünschst. Dr. Leo schaut sich deine Lippen an und sagt dir ehrlich, was zu dir passt und was nicht.', en: 'You say what you would like. Dr. Leo looks at your lips and tells you honestly what suits you and what does not.' },
  },
  {
    title: { de: 'Aufklärung', en: 'Information' },
    text: { de: 'Ablauf, Risiken und Nachsorge, bevor irgendetwas passiert. Du entscheidest in Ruhe.', en: 'Procedure, risks and aftercare, before anything happens. You decide in your own time.' },
  },
  {
    title: { de: 'Behandlung', en: 'Treatment' },
    text: { de: 'Mit Hyaluronsäure, 1 ml. Insgesamt etwa 30 bis 45 Minuten.', en: 'With hyaluronic acid, 1 ml. About 30 to 45 minutes in all.' },
  },
];

const FOR_WHOM: Bi[] = [
  { de: 'Du möchtest mehr Volumen oder eine klarere Kontur, natürlich und zu dir passend.', en: 'You would like more volume or a clearer outline, natural and suited to you.' },
  { de: 'Du möchtest beim Arzt behandelt werden, nicht im Studio nebenan.', en: 'You want to be treated by a physician, not by the studio next door.' },
  { de: 'Du bist volljährig, nicht schwanger und stillst nicht. Alles Weitere klärt das Gespräch.', en: 'You are of age, not pregnant and not breastfeeding. Everything else is settled in the consultation.' },
];

/**
 * Die Zielseite der Facebook- und Instagram-Anzeige „Lips Special“. Nur für die
 * Anzeige: noindex,nofollow, nicht in der Sitemap, in keinem Menü. Wie die
 * Google-Anzeigenseite ohne Wirkstoff- und Markennamen und ohne Vorher-Nachher-
 * Bilder (HWG); die spec.ts prüft das. Preis aus LIPS_SPECIAL, wie auf den
 * anderen Leo-Seiten.
 *
 * Salonkee hat keine eigene Leistung „Lippen 1 ml“ und keine Links auf einzelne
 * Leistungen (geprüft 18.11.2026), deshalb führt Buchen auf die Salonseite.
 */
@Component({
  selector: 'app-lippen-promotion',
  standalone: true,
  templateUrl: './lippen-promotion.component.html',
  styleUrls: ['../promotion-page.scss', './lippen-promotion.component.scss'],
})
export class LippenPromotionComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);

  readonly offer = LIPS_SPECIAL;
  readonly steps = STEPS;
  readonly forWhom = FOR_WHOM;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly whatsappHref = WHATSAPP_HREF;

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
      title: this.t('Lips Special: Lippen 1 ml für 180 € beim Arzt in Nürnberg | FareWell', 'Lips Special: lips 1 ml for €180 with a physician in Nuremberg | FareWell'),
      description: this.t(
        'Hyaluron Lippen 1 ml für 180 € statt 249 €, ärztlich durch Dr. med. Andrea Leo. FareWell, Frauentorgraben 5, Nürnberg, 2 Minuten vom Hauptbahnhof.',
        'Hyaluronic acid lips 1 ml for €180 instead of €249, by Dr. med. Andrea Leo. FareWell, Frauentorgraben 5, Nuremberg, 2 minutes from the main station.',
      ),
      path: PAGE_PATH,
      noindex: true,
      nofollow: true,
    });
  }
}
