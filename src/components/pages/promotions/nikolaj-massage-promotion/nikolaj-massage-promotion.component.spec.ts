import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NikolajMassagePromotionComponent } from './nikolaj-massage-promotion.component';

describe('NikolajMassagePromotionComponent', () => {
  let fixture: ComponentFixture<NikolajMassagePromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NikolajMassagePromotionComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NikolajMassagePromotionComponent);
    fixture.detectChanges();
  });

  const text = (): string => fixture.nativeElement.textContent.replace(/\s+/g, ' ');

  it('zeigt die Sportmassage für 95 € und den Titel Massagepraktiker', () => {
    expect(text()).toContain('95 €');
    expect(text()).toContain('Massagepraktiker (PRIMA Akademie Nürnberg)');
  });

  it('trägt den Pflichtsatz „keine Heilbehandlung“', () => {
    expect(text()).toContain('Keine Heilbehandlung, ersetzt keine ärztliche oder physiotherapeutische Behandlung.');
  });

  it('nennt weder einen geschützten Titel noch ein Heilversprechen noch seine Blindheit, und zeigt kein Foto', () => {
    const el: HTMLElement = fixture.nativeElement;
    const all = el.textContent + ' ' + el.innerHTML;
    expect(all).not.toMatch(/Masseur|\bTherapeut|Therapeutische|\bmed\.|heilt|lindert|Schmerz|Lymphdrainage/);
    expect(all).not.toMatch(/blind|Blind|sehbehindert|Tastsinn/);
    expect(el.querySelectorAll('img, picture, video').length).toBe(0);
  });

  it('ist nicht indexierbar und folgt keinen Links', () => {
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
  });

  it('bucht direkt seine Sportmassage bei Salonkee', () => {
    const book: HTMLAnchorElement = fixture.nativeElement.querySelector('.hero a.btn-gold');
    expect(book.href).toBe('https://salonkee.de/checkout/farewell?serviceID=238612');
  });

  it('hat die Sprungziele der Sitelinks', () => {
    for (const id of ['sport', 'wellness', 'ganzkoerper', 'schwedisch', 'preise', 'anfahrt']) {
      expect(fixture.nativeElement.querySelector(`#${id}`)).withContext(id).not.toBeNull();
    }
  });

  it('verlinkt jede Leistung außer den Karten auf Salonkee', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('#preise a'));
    const items = fixture.nativeElement.querySelectorAll('#preise li').length;
    expect(links.length).toBe(items - 2);
    links.forEach((a) => expect(a.href).toMatch(/^https:\/\/salonkee\.de\/checkout\/farewell\?serviceID=\d+$/));
  });

  it('zeigt genau zwei Massagen von 60 Minuten und keinen Platzhalter', () => {
    expect(fixture.nativeElement.querySelectorAll('#massagen .card').length).toBe(2);
    expect(text()).toContain('Wellnessmassage');
    expect(text()).not.toMatch(/Schröpf|Fußmassage|Schwedische Massage|90 Min/);
    expect(text()).not.toMatch(/PLATZHALTER|PLACEHOLDER/);
  });

  it('meldet Buchen, Telefon und WhatsApp an Analytics', () => {
    const calls: unknown[][] = [];
    const before = window.gtag;
    window.gtag = (...args: unknown[]) => { calls.push(args); };
    try {
      const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('.hero .ctas a'));
      links.forEach((a) => {
        a.addEventListener('click', (e) => e.preventDefault());
        a.dispatchEvent(new MouseEvent('click', { cancelable: true }));
      });
    } finally {
      window.gtag = before;
    }
    expect(calls.map((c) => c[1])).toEqual(['generate_lead', 'phone_click', 'whatsapp_click']);
    expect((calls[0][2] as { page: string }).page).toBe('/promotionen/massage-nikolaj-nuernberg');
  });
});
