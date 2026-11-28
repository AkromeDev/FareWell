import { Component, OnInit, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { PRICE_TABLES, PriceRow } from '../../price/price-data';
import { AdClick, trackAdClick } from '../ad-tracking';
import { Bi, PHONE_HREF, PHONE_LABEL } from '../promotion-page.model';

const PAGE_PATH = '/promotionen/massage-nikolaj-nuernberg';

/** WhatsApp an dieselbe Nummer wie PHONE_HREF. */
const WHATSAPP_HREF = 'https://wa.me/4915757995694';

const SALONKEE = 'https://salonkee.de/checkout/farewell?serviceID=';

/**
 * Salonkee-Leistungen von Nikolaj (Gruppe „Massage - Nikolaj“, angelegt am
 * 23.11.2026). Seit 28.11.2026 (JC) nur noch zwei Massagen, beide 60 Min.: die
 * Sportmassage unter der serviceID der früheren kräftigen Ganzkörpermassage (238612),
 * die Wellnessmassage unter der der früheren Schwedischen Massage (238614). Je Name aus
 * PRICE_TABLES.massageNikolaj. Die 5er- und 10er-Karte sind in Salonkee ein Abonnement
 * ohne eigenen Buchungslink, deshalb fehlen sie hier.
 */
const SERVICE_IDS: Record<string, number> = {
  'Sportmassage (kräftig)': 238612,
  'Wellnessmassage (sanft)': 238614,
};

interface Highlight {
  id: string;
  title: Bi;
  text: Bi;
  /** Zeilen aus PRICE_TABLES.massageNikolaj, deren Preis die Karte zeigt. */
  rows: PriceRow[];
  serviceId: number;
  /**
   * Alte Sprungziele der Sitelinks in den Google-Anzeigen (#ganzkoerper, #schwedisch),
   * bis die Anzeigen auf die zwei Massagen umgestellt sind.
   */
  legacyAnchor: string;
}

const ROWS: PriceRow[] = PRICE_TABLES.massageNikolaj.rows;
const rowsNamed = (de: string) => ROWS.filter((r) => r.de === de && !r.sessions);

const HIGHLIGHTS: Highlight[] = [
  {
    id: 'sport',
    title: { de: 'Sportmassage: Nikolajs Empfehlung', en: 'Sports massage: Nikolaj’s recommendation' },
    text: {
      de: 'Fester, kräftiger Druck mit langen, tiefen Griffen, ähnlich der klassischen schwedischen Massage, nur mit deutlich mehr Kraft. Seine liebste Massage: Für ihn ist sie die wirkungsvollste, deshalb empfiehlt er sie.',
      en: 'Firm, strong pressure with long, deep strokes, similar to a classic Swedish massage, only with clearly more strength. His favourite massage: to him it is the most effective one, which is why he recommends it.',
    },
    rows: rowsNamed('Sportmassage (kräftig)'),
    serviceId: 238612,
    legacyAnchor: 'ganzkoerper',
  },
  {
    id: 'wellness',
    title: { de: 'Wellnessmassage: die sanfte Wahl', en: 'Wellness massage: the gentle choice' },
    text: {
      de: 'Ruhige, fließende Griffe mit sanftem Druck. Eine Stunde, in der du einfach abschalten und loslassen kannst.',
      en: 'Calm, flowing strokes with gentle pressure. An hour in which you can simply switch off and let go.',
    },
    rows: rowsNamed('Wellnessmassage (sanft)'),
    serviceId: 238614,
    legacyAnchor: 'schwedisch',
  },
];

/**
 * Die Zielseite der Google-Anzeigen „DE - Massage Nikolaj“ (Plan:
 * FareWell/domains/marketing/google-ads/2026-11-23_Massage-Nikolaj.md). Nur für
 * die Anzeige: noindex,nofollow, nicht in der Sitemap, in keinem Menü.
 *
 * Preise aus PRICE_TABLES.massageNikolaj, wie auf der Preisseite (#massage-nikolaj).
 * Wortwahl wie dort: Nikolaj ist Massagepraktiker (PRIMA Akademie Nürnberg), nie
 * „Masseur“, „Therapeut“ oder „med.“; Wellness- und Sportmassage ohne
 * Heilversprechen, mit dem Hinweis „keine Heilbehandlung“. Kein Wort zu seiner
 * Blindheit und kein Foto von ihm, solange seine schriftliche Einwilligung fehlt
 * (Art. 9 DSGVO); die spec.ts prüft das.
 */
@Component({
  selector: 'app-nikolaj-massage-promotion',
  standalone: true,
  templateUrl: './nikolaj-massage-promotion.component.html',
  styleUrls: ['../promotion-page.scss', './nikolaj-massage-promotion.component.scss'],
})
export class NikolajMassagePromotionComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);

  readonly highlights = HIGHLIGHTS;
  readonly rows = ROWS;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly whatsappHref = WHATSAPP_HREF;

  /** Hauptlink der Anzeige: seine Sportmassage bei Salonkee. */
  readonly bookingUrl = SALONKEE + 238612;

  /** Preis der Sportmassage (60 Min.), für die erste Zeile der Seite. */
  readonly mainPrice = rowsNamed('Sportmassage (kräftig)').find((r) => r.minutes === 60)?.price;

  bookingFor(id: number): string {
    return SALONKEE + id;
  }

  /** Buchungslink einer Zeile der Preisliste, oder null (Karten). */
  rowBooking(row: PriceRow): string | null {
    const id = row.sessions ? undefined : SERVICE_IDS[row.de];
    return id ? SALONKEE + id : null;
  }

  rowLabel(row: PriceRow): string {
    const minutes = row.sessions ? `${row.sessions} × ${row.minutes} Min.` : `${row.minutes} Min.`;
    return `${this.t(row.de, row.en)} (${this.t(minutes, minutes.replace('Min.', 'min'))})`;
  }

  euro(price: number | null): string {
    return price === null ? '' : `${price} €`;
  }

  track(kind: AdClick, location: string): void {
    trackAdClick(kind, PAGE_PATH, location);
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  bi(text: Bi): string {
    return this.t(text.de, text.en);
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t('Sportmassage bei Nikolaj in Nürnberg, 60 Min. 95 € | FareWell', 'Sports massage with Nikolaj in Nuremberg, 60 min €95 | FareWell'),
      description: this.t(
        'Kräftige Sportmassage oder sanfte Wellnessmassage, je 60 Minuten, bei Nikolaj, Massagepraktiker mit über 13 Jahren Erfahrung. FareWell, Nürnberg.',
        'Firm sports massage or gentle wellness massage, 60 minutes each, with Nikolaj, massage practitioner with over 13 years of experience. FareWell, Nuremberg.',
      ),
      path: PAGE_PATH,
      noindex: true,
      nofollow: true,
    });
  }
}
