/** Zweisprachiger Text und gemeinsame Daten der Promotionsseiten. */
export interface Bi {
  de: string;
  en: string;
}

export interface PriceLine {
  name: Bi;
  detail?: Bi;
  priceFrom: number;
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

