import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ORG_ID } from 'src/app/domain/entities';
import { LEVEL44, euroDe, level44EventId } from 'src/app/domain/level44';
import { Level44Component, level44Description } from './level-44.component';

/** Die Sprachfassungen stehen als <span class="lang de|en"> nebeneinander; hier nur die deutsche. */
function germanText(root: HTMLElement): string {
  const copy = root.cloneNode(true) as HTMLElement;
  copy.querySelectorAll('.lang.en').forEach((node) => node.remove());
  return (copy.textContent ?? '').replace(/\s+/g, ' ');
}

describe('Level44Component', () => {
  let component: Level44Component;
  let fixture: ComponentFixture<Level44Component>;
  let el: HTMLElement;

  /** Ein Tag vor dem ersten Termin der Datei, damit die Prüfungen nicht vom Kalender abhängen. */
  const firstStart = Math.min(...LEVEL44.sessions.map((session) => Date.parse(session.start)));

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(firstStart - 24 * 3600 * 1000));

    await TestBed.configureTestingModule({
      imports: [Level44Component],
      // LanguageService (über den SeoService) braucht einen Router.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Level44Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    // ngOnDestroy nimmt das JSON-LD wieder aus dem <head>.
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lädt Wistia erst nach dem Klick', () => {
    expect(el.querySelector('iframe')).toBeNull();
    el.querySelector<HTMLButtonElement>('.audio-gate button')!.click();
    fixture.detectChanges();
    expect(el.querySelector('iframe')?.getAttribute('src')).toContain('fast.wistia.net/embed/iframe/nx15jjlaj3');
  });

  it('nennt nirgends Therapie als Angebot und nicht Hypnosetherapie', () => {
    const text: string = el.textContent ?? '';
    expect(text).not.toMatch(/Hypnosetherapie|Hypnotherapy|Soul Touch Therapy/i);
  });

  it('ist indexierbar', () => {
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content') ?? '').not.toContain('noindex');
  });

  describe('eine Quelle: level44.json', () => {
    it('druckt jeden Preis der Datei und keinen anderen Gruppenpreis', () => {
      // germanText macht aus dem geschützten Leerzeichen vor dem Eurozeichen ein gewöhnliches.
      const euro = (amount: number) => euroDe(amount).replace(/\s/g, ' ');
      const text = germanText(el);
      for (const offer of LEVEL44.offers) {
        if (offer.price !== null) expect(text).withContext(offer.id).toContain(euro(offer.price));
      }
      expect(text).toContain(`${euro(LEVEL44.firstVisit.price)} mit dem Code ${LEVEL44.firstVisit.code}`);
      // Die alten Angaben vom 03.11.2026.
      expect(text).not.toMatch(/77\s€|176\s€|Einführungspreis/);
    });

    it('listet die Termine der Datei unter #termine, jeden mit Buchungslink', () => {
      const rows = el.querySelectorAll('#termine li.card');
      expect(rows.length).toBe(LEVEL44.sessions.length);
      LEVEL44.sessions.forEach((session, index) => {
        expect(rows[index].id).toBe(`termin-${session.id}`);
        expect(rows[index].textContent).toContain(session.journey);
        expect(rows[index].querySelector('a.btn-gold')?.getAttribute('href')).toContain('salonkee.de/salon/farewell');
      });
      expect(germanText(el.querySelector('#termine')!)).toContain(`Höchstens ${LEVEL44.groupMaxPlaces} Plätze`);
    });

    it('behält die Anker, auf die die LEVEL 44 Website verlinkt', () => {
      for (const id of Object.values(LEVEL44.place.anchors)) {
        expect(el.querySelector(`#${id}`)).withContext(id).not.toBeNull();
      }
    });

    it('führt jede Buchung zu Salonkee und sagt, woher sie kommt', () => {
      const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href*="salonkee.de"]'));
      expect(links.length).toBeGreaterThan(5);
      for (const link of links) {
        const url = new URL(link.href);
        expect(url.searchParams.get('utm_source')).toBe('farewell.salon');
        expect(url.searchParams.get('utm_campaign')).toBe('level-44');
      }
      const privateLink = el.querySelector<HTMLAnchorElement>('#offer-private a.btn-gold')!;
      expect(new URL(privateLink.href).searchParams.get('serviceID')).toBe('234765');
    });

    it('zeigt einen Buchungsbutton nur für das, was Salonkee heute buchen kann', () => {
      for (const offer of LEVEL44.offers.filter((item) => item.format !== 'soul-touch' && item.format !== 'online')) {
        const button = el.querySelector(`#offer-${offer.id} a.btn-gold`);
        if (offer.bookable) expect(button).withContext(offer.id).not.toBeNull();
        else expect(button).withContext(offer.id).toBeNull();
      }
    });

    it('beschreibt jeden Termin als Event mit den gemeinsamen ids, ohne medizinischen Typ', () => {
      const raw = document.getElementById('level-44-schema')!.textContent!;
      const graph: Record<string, any>[] = JSON.parse(raw)['@graph'];
      const events = graph.filter((node) => node['@type'] === 'Event');
      expect(events.map((event) => event['@id'])).toEqual(LEVEL44.sessions.map((session) => level44EventId(session)));
      for (const event of events) {
        const session = LEVEL44.sessions.find((item) => level44EventId(item) === event['@id'])!;
        expect(event['startDate']).toBe(session.start);
        expect(event['endDate']).toBe(session.end);
        expect(event['location']).toEqual({ '@id': ORG_ID });
        expect(event['organizer']).toEqual({ '@id': LEVEL44.ids.person });
        expect(event['maximumAttendeeCapacity']).toBe(LEVEL44.groupMaxPlaces);
        expect(event['offers'].price).toBe(LEVEL44.offers.find((offer) => offer.id === 'group')!.price);
        expect(event['offers'].priceCurrency).toBe('EUR');
        expect(event['offers'].url).toContain('salonkee.de/salon/farewell');
      }
      expect(graph.find((node) => node['@id'] === LEVEL44.ids.person)?.['@type']).toBe('Person');
      expect(graph.find((node) => node['@id'] === LEVEL44.ids.brand)?.['@type']).toBe('Brand');
      expect(raw).not.toMatch(/Medical|Therapy|Physician/);
    });

    it('lässt vergangene Termine weg und sagt es, wenn keiner mehr ansteht', () => {
      const last = Math.max(...LEVEL44.sessions.map((session) => Date.parse(session.end)));
      jasmine.clock().mockDate(new Date(last + 1000));
      const later = TestBed.createComponent(Level44Component);
      later.detectChanges();
      const node: HTMLElement = later.nativeElement;
      expect(node.querySelectorAll('#termine li.card').length).toBe(0);
      expect(germanText(node.querySelector('#termine')!)).toContain('Der nächste Termin steht noch nicht im Kalender');
      later.destroy();
    });

    it('hält die Beschreibung mit null, einem und zwei Terminen zwischen 120 und 155 Zeichen', () => {
      const sorted = [...LEVEL44.sessions].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
      for (const sessions of [[], sorted.slice(0, 1), sorted.slice(0, 2)]) {
        const text = level44Description(sessions);
        for (const value of [text.de, text.en]) {
          expect([...value].length).withContext(value).toBeGreaterThanOrEqual(120);
          expect([...value].length).withContext(value).toBeLessThanOrEqual(155);
        }
      }
    });
  });

  describe('Arbeitsteilung mit ihrer eigenen Website (brandSite.public)', () => {
    const deepLinks = (root: HTMLElement) =>
      Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))
        .map((link) => link.getAttribute('href') ?? '')
        .filter((href) => href.startsWith(`${LEVEL44.brandSite.origin}/`));

    it('ist heute aus: die Seite bleibt das Zuhause der Marke, ohne Links in ihre Website hinein', () => {
      expect(LEVEL44.brandSite.public).toBeFalse();
      expect(el.querySelectorAll('.nine .nine-item').length).toBe(9);
      expect(germanText(el.querySelector('#franziska')!)).toContain('Ich glaube, dass persönliche Veränderung');
      expect(el.querySelector('#offer-online')).toBeNull();
      expect(deepLinks(el)).toEqual([]);
    });

    it('verweist, sobald sie öffentlich ist, für Methode, Journeys, Online und Franziska auf ihre Website', () => {
      const open = TestBed.createComponent(Level44Component);
      Object.assign(open.componentInstance, { brandPublic: true });
      open.detectChanges();
      const node: HTMLElement = open.nativeElement;
      const origin = LEVEL44.brandSite.origin;
      const paths = LEVEL44.brandSite.paths;

      expect(node.querySelector('.nine')).toBeNull();
      expect(germanText(node.querySelector('#franziska')!)).not.toContain('Ich glaube, dass persönliche Veränderung');
      const links = deepLinks(node);
      for (const path of [paths.method, paths.journeys, paths.online, paths.about]) {
        expect(links).toContain(`${origin}${path}`);
      }
      for (const session of LEVEL44.sessions) {
        expect(links).toContain(`${origin}${paths.journey}${session.journeySlug}`);
      }
      // Der Ort bleibt hier: Termine, Preise, Kontraindikationen, FAQ.
      expect(node.querySelectorAll('#termine li.card').length).toBe(LEVEL44.sessions.length);
      expect(node.querySelector('#preise table')).not.toBeNull();
      expect(node.querySelectorAll('#sicherheit .check-list--inset li').length).toBeGreaterThan(5);
      expect(node.querySelectorAll('#fragen details').length).toBeGreaterThan(5);
      open.destroy();
    });
  });
});
