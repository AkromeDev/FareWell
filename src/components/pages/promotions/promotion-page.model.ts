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

/**
 * Der Arzt als schema.org-Knoten. Titel „Dr. med." ist Joés Entscheidung vom
 * 09.11.2026 (domains/hr/5 - Leo/Leo Andrea.md, Punkt 11).
 */
export function physicianNode(id: string): Record<string, unknown> {
  return {
    '@type': 'Physician',
    '@id': id,
    name: 'Dr. med. Andrea Leo',
    telephone: '+4915757995694',
    email: SALON_MAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Frauentorgraben 5',
      postalCode: '90443',
      addressLocality: 'Nürnberg',
      addressCountry: 'DE',
    },
  };
}
