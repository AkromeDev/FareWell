import { FRANZISKA_PREUSCHE_ID, LEVEL44_BRAND_ID, LEVEL44_PAGE, ORG_ID, ORIGIN } from './entities';
import {
  LEVEL44,
  euroDe,
  euroEn,
  level44BookingUrl,
  level44EventId,
  level44Offer,
  level44Price,
  level44SalonUrl,
  level44SiteUrl,
  sessionWhen,
  upcomingSessions,
} from './level44';
import { DR_LEO_SITE, LEVEL44_SITE } from './partner-sites';

/**
 * level44.json is read by two websites. These checks keep it sound, so a
 * typing mistake fails here and not on a page.
 */
describe('level44.json, the shared facts', () => {
  it('names FareWell, Franziska and the brand by the ids the pages use', () => {
    expect(LEVEL44.ids.organization).toBe(ORG_ID);
    expect(LEVEL44.place.site).toBe(ORIGIN);
    expect(LEVEL44_PAGE).toBe(`${ORIGIN}/behandlungen/level-44`);
    expect(FRANZISKA_PREUSCHE_ID).toBe(`${LEVEL44_PAGE}#franziska-preusche`);
    expect(LEVEL44_BRAND_ID).toBe(`${LEVEL44_PAGE}#brand`);
    expect(LEVEL44.ids.eventPrefix).toBe(`${LEVEL44_PAGE}#event-`);
  });

  it('gives every offer one id and a price that is a whole number of euros, or none', () => {
    const ids = LEVEL44.offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const offer of LEVEL44.offers) {
      if (offer.price !== null) {
        expect(Number.isInteger(offer.price) && offer.price > 0).withContext(offer.id).toBeTrue();
      }
      // What Salonkee cannot open by its own link is booked from the salon page.
      if (offer.directLink) expect(offer.salonkeeServiceId).withContext(offer.id).not.toBeNull();
      // Nothing without a price is offered for booking.
      if (offer.bookable) expect(offer.price).withContext(offer.id).not.toBeNull();
    }
    expect(LEVEL44.currency).toBe('EUR');
  });

  it('keeps the first visit price below the price of the offers it applies to', () => {
    expect(LEVEL44.firstVisit.code).toMatch(/^[A-Z0-9]+$/);
    for (const id of LEVEL44.firstVisit.offers) {
      expect(level44Price(id)).toBeGreaterThan(LEVEL44.firstVisit.price);
    }
  });

  it('holds the durations the page words rely on', () => {
    // The page says "ca. 2,5–3 Stunden" for the group and "ca. 3 Stunden" for the evening.
    expect(level44Offer('group').minutes).toBe(180);
    expect(level44Offer('evening').minutes! % 60).toBe(0);
    expect(LEVEL44.groupMaxPlaces).toBeGreaterThan(0);
  });

  it('dates every session soundly', () => {
    for (const session of LEVEL44.sessions) {
      expect(session.start.slice(0, 10)).toBe(session.id);
      expect(session.start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+0[12]:00$/);
      expect(Date.parse(session.end)).toBeGreaterThan(Date.parse(session.start));
      expect(level44Offer(session.offer).bookable).withContext(session.id).toBeTrue();
      expect(session.journeySlug).toMatch(/^[a-z0-9-]+$/);
      expect(level44EventId(session)).toBe(`${LEVEL44_PAGE}#event-${session.id}`);
    }
  });

  it('lists only sessions that have not ended, in date order', () => {
    const sample = [...LEVEL44.sessions].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    expect(upcomingSessions(0).map((s) => s.id)).toEqual(sample.map((s) => s.id));
    const last = sample[sample.length - 1];
    expect(upcomingSessions(Date.parse(last.end) + 1)).toEqual([]);
    expect(upcomingSessions(Date.parse(last.start)).map((s) => s.id)).toContain(last.id);
  });

  it('prints date and time from the text of the date, whatever the time zone of the machine', () => {
    const when = sessionWhen({
      id: '2026-11-15',
      offer: 'group',
      journey: 'THE AWAKENING',
      journeySlug: 'awakening',
      start: '2026-11-15T11:00:00+01:00',
      end: '2026-11-15T14:00:00+01:00',
    });
    expect(when).toEqual({ dateDe: 'So 15.11.2026', dateEn: 'Sun 15 Nov 2026', time: '11:00', endTime: '14:00' });
  });

  it('writes prices the way the two languages do', () => {
    expect(euroDe(99)).toBe('99 €');
    expect(euroEn(99)).toBe('€99');
  });

  it('sends every booking to Salonkee and says where it came from', () => {
    for (const offer of LEVEL44.offers.filter((item) => item.bookable)) {
      const url = new URL(level44BookingUrl(offer.id, 'de'));
      expect(url.host).withContext(offer.id).toBe('salonkee.de');
      expect(url.searchParams.get('utm_source')).toBe('farewell.salon');
      expect(url.searchParams.get('utm_campaign')).toBe('level-44');
      if (offer.directLink) {
        expect(url.pathname).toBe('/checkout/farewell');
        expect(url.searchParams.get('serviceID')).toBe(String(offer.salonkeeServiceId));
      } else {
        expect(url.pathname).toBe('/salon/farewell');
      }
    }
    expect(level44SalonUrl('en', false)).toBe('https://salonkee.de/salon/farewell?lang=en');
  });

  it('knows her own site by one address and one switch', () => {
    expect(LEVEL44.brandSite.origin).toMatch(/^https:\/\/[a-z0-9.-]+$/);
    for (const path of Object.values(LEVEL44.brandSite.paths)) expect(path.startsWith('/')).toBeTrue();
    expect(level44SiteUrl('journey', 'awakening')).toBe(`${LEVEL44.brandSite.origin}/journeys/awakening`);
    expect(LEVEL44_SITE.origin).toBe(LEVEL44.brandSite.origin);
    expect(LEVEL44_SITE.public).toBe(LEVEL44.brandSite.public);
    expect(DR_LEO_SITE.origin).toBe('https://drleoaesthetic.de');
  });

  it('never names breathwork or bodywork as therapy or medicine', () => {
    const names = LEVEL44.offers.map((offer) => offer.name).join(' ');
    expect(names).not.toMatch(/therap|medizin|medical|heil/i);
  });
});
