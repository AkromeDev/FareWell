import data from './level44.json';

/**
 * LEVEL 44 at FareWell: the one source for prices, durations, dates, the
 * first visit code, the booking links and the shared ids.
 *
 * The facts are in level44.json, next to this file. The build also publishes
 * that same file at https://farewell.salon/data/level44.json (angular.json,
 * assets), where the LEVEL 44 site reads it when it is built. So both sites
 * print the same numbers. Salonkee is the truth for prices: change a price
 * there first, then in the JSON file, never in a component.
 */

export type Level44OfferId =
  | 'group'
  | 'group-integration'
  | 'evening'
  | 'private'
  | 'premium'
  | 'soul-touch-60'
  | 'soul-touch-90'
  | 'soul-touch-120'
  | 'online';

export interface Level44Offer {
  id: Level44OfferId;
  name: string;
  format: 'group' | 'private' | 'soul-touch' | 'online';
  /** Euros. null = no price is confirmed, the page prints none. */
  price: number | null;
  minutes: number | null;
  salonkeeServiceId: number | null;
  /** true = Salonkee opens this service by its own link. Courses have none. */
  directLink: boolean;
  /** true = can be booked in Salonkee today. */
  bookable: boolean;
}

export interface Level44Session {
  /** The date, YYYY-MM-DD. Also the end of the Event id. */
  id: string;
  offer: Level44OfferId;
  journey: string;
  /** The journey's page on the LEVEL 44 site: brandSite.paths.journey + this. */
  journeySlug: string;
  /** ISO 8601 with the offset of Europe/Berlin. */
  start: string;
  end: string;
}

export interface Level44Facts {
  schema: number;
  updated: string;
  currency: string;
  ids: { organization: string; person: string; brand: string; eventPrefix: string };
  place: {
    name: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    site: string;
    page: string;
    anchors: { dates: string; prices: string; safety: string; visit: string };
  };
  brandSite: {
    origin: string;
    /** false until Franziska's own site is public. Switches the division of roles. */
    public: boolean;
    instagram: string;
    paths: { method: string; journeys: string; journey: string; online: string; about: string; safety: string };
  };
  booking: { provider: string; salon: string; service: string };
  firstVisit: { code: string; price: number; offers: Level44OfferId[]; oncePerPerson: boolean; newClientsOnly: boolean };
  groupMaxPlaces: number;
  offers: Level44Offer[];
  sessions: Level44Session[];
}

export const LEVEL44 = data as Level44Facts;

export function level44Offer(id: Level44OfferId): Level44Offer {
  const found = LEVEL44.offers.find((item) => item.id === id);
  if (!found) throw new Error(`level44.json has no offer "${id}"`);
  return found;
}

/** The price of an offer that has one. Throws for an offer whose price is null. */
export function level44Price(id: Level44OfferId): number {
  const price = level44Offer(id).price;
  if (price === null) throw new Error(`level44.json has no price for "${id}"`);
  return price;
}

export function level44Minutes(id: Level44OfferId): number {
  const minutes = level44Offer(id).minutes;
  if (minutes === null) throw new Error(`level44.json has no duration for "${id}"`);
  return minutes;
}

/** "99 €" on German pages (with a no-break space, so the sign never wraps alone), "€99" on English ones. */
export const euroDe = (amount: number): string => `${amount}\u00a0€`;
export const euroEn = (amount: number): string => `€${amount}`;

/** Sessions that have not ended yet, in date order. `now` in milliseconds. */
export function upcomingSessions(now: number): Level44Session[] {
  return LEVEL44.sessions
    .filter((session) => Date.parse(session.end) > now)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

const WEEKDAY_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Date and time of a session as the page prints them. Read from the text of
 * `start` itself, which already is local time in Nürnberg, so the result does
 * not depend on the time zone of the machine that builds the page.
 */
export function sessionWhen(session: Level44Session): {
  dateDe: string;
  dateEn: string;
  time: string;
  endTime: string;
} {
  const [year, month, day] = session.start.slice(0, 10).split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const two = (n: number) => String(n).padStart(2, '0');
  return {
    dateDe: `${WEEKDAY_DE[weekday]} ${two(day)}.${two(month)}.${year}`,
    dateEn: `${WEEKDAY_EN[weekday]} ${day} ${MONTH_EN[month - 1]} ${year}`,
    time: session.start.slice(11, 16),
    endTime: session.end.slice(11, 16),
  };
}

/** The id of a session's Event in the structured data, the same on both sites. */
export const level44EventId = (session: Level44Session): string =>
  `${LEVEL44.ids.eventPrefix}${session.id}`;

/**
 * Where a booking link was followed from, in the words Salonkee and analytics
 * keep: the site and the page (AI-SEO-STRATEGY.md, Cross-links).
 */
const SOURCE = 'utm_source=farewell.salon&utm_medium=website&utm_campaign=level-44';

/** The salon's page in Salonkee. Courses (the group journeys) are booked from here. */
export function level44SalonUrl(lang: 'de' | 'en', tagged = true): string {
  return `${LEVEL44.booking.salon}?lang=${lang}${tagged ? `&${SOURCE}` : ''}`;
}

/** The direct booking link of one offer, or the salon's page when Salonkee has none. */
export function level44BookingUrl(id: Level44OfferId, lang: 'de' | 'en'): string {
  const item = level44Offer(id);
  return item.directLink && item.salonkeeServiceId !== null
    ? `${LEVEL44.booking.service}${item.salonkeeServiceId}&${SOURCE}`
    : level44SalonUrl(lang);
}

/** An address on Franziska's own site. Use it only while brandSite.public is true. */
export function level44SiteUrl(path: keyof Level44Facts['brandSite']['paths'], slug = ''): string {
  return `${LEVEL44.brandSite.origin}${LEVEL44.brandSite.paths[path]}${slug}`;
}

/** "level44.live": how a link to her site is written. */
export const LEVEL44_SITE_LABEL = new URL(LEVEL44.brandSite.origin).host;
