import { LEVEL44 } from './level44';

/**
 * Shared ids for structured data (AI-SEO-STRATEGY.md, "Shared ids").
 *
 * Every real thing has one id. FareWell is described in full once per page,
 * by the static JSON-LD block in src/index.html; every other node only points
 * to it with { '@id': ORG_ID }. Dr. med. Andrea Leo and his practice keep the
 * ids of his own site, so search engines read the doctor on this site and on
 * his as the same person. An id is a name, not a link that has to open.
 */

export const ORIGIN = 'https://farewell.salon';

/** FareWell, the studio and the place (BeautySalon). */
export const ORG_ID = `${ORIGIN}/#organization`;
export const WEBSITE_ID = `${ORIGIN}/#website`;
export const ORG_REF = { '@id': ORG_ID } as const;

/** Dr. med. Andrea Leo, the person, and his practice (Physician). */
export const DR_LEO_PERSON_ID = 'https://drleoaesthetic.de/#dr-andrea-leo';
export const DR_LEO_PRACTICE_ID = 'https://drleoaesthetic.de/#practice';

/**
 * Franziska Preusche and her brand LEVEL 44, described on this site until she
 * has a domain. The ids are written once, in level44.json, which the LEVEL 44
 * site reads too: both sites name the person, the brand, the sessions and
 * FareWell by the same ids. entities.spec.ts checks that ORG_ID matches it.
 */
export const LEVEL44_PAGE = LEVEL44.place.page;
export const FRANZISKA_PREUSCHE_ID = LEVEL44.ids.person;
export const LEVEL44_BRAND_ID = LEVEL44.ids.brand;

const SALON_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Frauentorgraben 5',
  postalCode: '90443',
  addressLocality: 'Nürnberg',
  addressCountry: 'DE',
};

const DR_LEO_INSTAGRAM = 'https://www.instagram.com/dr.leoaesthet1c/';

/**
 * Dr. Leo as a person. He is an independent cooperation doctor, not an
 * employee of FareWell: the link to the studio runs only through his
 * practice (containedInPlace), never through worksFor or employee. No phone
 * and no mail here; his own contact data belong on his own site.
 */
export function drLeoPersonNode(
  t: (de: string, en: string) => string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': DR_LEO_PERSON_ID,
    name: 'Dr. med. Andrea Leo',
    honorificPrefix: 'Dr. med.',
    givenName: 'Andrea',
    familyName: 'Leo',
    jobTitle: t('Arzt', 'Physician'),
    sameAs: [DR_LEO_INSTAGRAM],
    ...extra,
  };
}

/** His practice at FareWell's address; it sits inside the studio. */
export function drLeoPracticeNode(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    '@type': 'Physician',
    '@id': DR_LEO_PRACTICE_ID,
    name: 'Dr. med. Andrea Leo',
    address: SALON_ADDRESS,
    founder: { '@id': DR_LEO_PERSON_ID },
    containedInPlace: ORG_REF,
    ...extra,
  };
}
