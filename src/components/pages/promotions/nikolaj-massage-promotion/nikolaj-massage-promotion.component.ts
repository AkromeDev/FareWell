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
 * 23.11.2026), je Name aus PRICE_TABLES.massageNikolaj. Die 5er- und 10er-Karte
 * sind in Salonkee ein Abonnement ohne eigenen Buchungslink, deshalb fehlen sie hier.
 */
const SERVICE_IDS: Record<string, number> = {
  'Ganzkörpermassage bei Nikolaj (kräftig, sportlich)': 238612,
  'Sportmassage Rücken, Nacken & Beine': 238613,
  'Schwedische Massage (sanft, Ganzkörper)': 238614,
  'Kräuterstempelmassage': 238615,
  'Ayurveda Ölmassage (Abhyanga)': 238616,
  'Hot Stone Massage': 238618,
  'Breuss Massage (Rücken)': 238619,
  'Fußmassage': 238620,
  'Fußmassage als Zusatz zu einer Massage': 238620,
};

interface Highlight {
  id: string;
  title: Bi;
  text: Bi;
  /** Zeilen aus PRICE_TABLES.massageNikolaj, deren Preis die Karte zeigt. */
  rows: PriceRow[];
  serviceId: number;
}

const ROWS: PriceRow[] = PRICE_TABLES.massageNikolaj.rows;
const rowsNamed = (de: string) => ROWS.filter((r) => r.de === de && !r.sessions);

const HIGHLIGHTS: Highlight[] = [
  {
    id: 'ganzkoerper',
    title: { de: 'Ganzkörpermassage', en: 'Full-body massage' },
    text: {
      de: 'Kräftig, sportlich und tiefgehend: Rücken, Nacken, Schultern, Arme und Beine. Seine Massage, so wie er am liebsten arbeitet.',
      en: 'Firm, sporty and deep: back, neck, shoulders, arms and legs. His massage, the way he likes to work best.',
    },
    rows: rowsNamed('Ganzkörpermassage bei Nikolaj (kräftig, sportlich)'),
    serviceId: 238612,
  },
  {
    id: 'sport',
    title: { de: 'Sportmassage', en: 'Sports massage' },
    text: {
      de: 'Rücken, Nacken und Beine, zur Regeneration nach dem Training oder in der Mittagspause.',
      en: 'Back, neck and legs, for recovery after training or in your lunch break.',
    },
    rows: rowsNamed('Sportmassage Rücken, Nacken & Beine'),
    serviceId: 238613,
  },
  {
    id: 'schwedisch',
    title: { de: 'Schwedische Massage', en: 'Swedish massage' },
    text: {
      de: 'Lieber sanft? Die klassische Ganzkörpermassage zum Entspannen, mit ruhigen, fließenden Griffen.',
      en: 'Prefer it gentle? The classic full-body massage to relax, with calm, flowing strokes.',
    },
    rows: rowsNamed('Schwedische Massage (sanft, Ganzkörper)'),
    serviceId: 238614,
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

  /** Hauptlink der Anzeige: seine Ganzkörpermassage bei Salonkee. */
  readonly bookingUrl = SALONKEE + 238612;

  /** Preis der 60-Minuten-Ganzkörpermassage, für die erste Zeile der Seite. */
  readonly mainPrice = rowsNamed('Ganzkörpermassage bei Nikolaj (kräftig, sportlich)').find((r) => r.minutes === 60)?.price;

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
      title: this.t('Ganzkörpermassage bei Nikolaj in Nürnberg, 60 Min. 95 € | FareWell', 'Full-body massage with Nikolaj in Nuremberg, 60 min €95 | FareWell'),
      description: this.t(
        'Kräftige Ganzkörpermassage, Sportmassage oder sanfte Schwedische Massage bei Nikolaj, Massagepraktiker mit über 13 Jahren Erfahrung. FareWell, Nürnberg.',
        'Firm full-body massage, sports massage or gentle Swedish massage with Nikolaj, massage practitioner with over 13 years of experience. FareWell, Nuremberg.',
      ),
      path: PAGE_PATH,
      noindex: true,
      nofollow: true,
    });
  }
}
