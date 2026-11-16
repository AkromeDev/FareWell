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

export const ORIGIN = 'https://farewell.salon';
export const SALON_MAIL = 'info@farewell.salon';
export const PHONE_HREF = 'tel:+4915757995694';
export const PHONE_LABEL = '+49 157 5799 5694';

