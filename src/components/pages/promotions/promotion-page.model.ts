/** Zweisprachiger Text und gemeinsame Daten der Promotionsseiten. */
export interface Bi {
  de: string;
  en: string;
}

export interface PriceLine {
  name: Bi;
  detail?: Bi;
  /** Preis in Euro: ein Startpreis („ab“), außer `fixed` ist gesetzt. */
  priceFrom: number;
  /** Festpreis, ohne „ab“ gezeigt (Dr. Leo, 15.11.2026). */
  fixed?: boolean;
  /** Früherer Preis, durchgestrichen neben dem Preis, solange ein Angebot läuft. */
  was?: number;
}

export interface PriceGroup {
  id: string;
  title: Bi;
  blurb?: Bi;
  items: PriceLine[];
}

export interface FaqEntry {
  q: Bi;
  a: Bi;
}

/**
 * Das Lips Special von Dr. Leo: Lippen 1 ml zum Festpreis von 180 € statt 249 €.
 * Ohne Enddatum (JC, 18.11.2026). Die eine Quelle für die Seite Ästhetische Medizin,
 * die Google-Anzeigenseite und die Instagram-Anzeigenseite /promotionen/lippen-nuernberg.
 */
export const LIPS_SPECIAL = {
  label: { de: 'Lips Special', en: 'Lips Special' } as Bi,
  price: 180,
  was: 249,
} as const;

export const ORIGIN = 'https://farewell.salon';
export const SALON_MAIL = 'info@farewell.salon';
export const PHONE_HREF = 'tel:+4915757995694';
export const PHONE_LABEL = '+49 157 5799 5694';

