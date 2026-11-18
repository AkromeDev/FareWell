import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LippenPromotionComponent } from './lippen-promotion.component';

describe('LippenPromotionComponent', () => {
  let fixture: ComponentFixture<LippenPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LippenPromotionComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LippenPromotionComponent);
    fixture.detectChanges();
  });

  it('zeigt 180 € statt 249 € und kein Enddatum', () => {
    const text: string = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('180 € statt 249 €');
    expect(text).not.toMatch(/Herbst|bis \d{1,2}\.\d/);
  });

  it('nennt keine Wirkstoff- oder Markennamen und zeigt keine Bilder', () => {
    const el: HTMLElement = fixture.nativeElement;
    const text = el.textContent + ' ' + el.innerHTML;
    expect(text).not.toMatch(/botox|botulinum|juvederm|juvéderm|restylane|teosyal|belotero|stylage|saypha|sculptra|radiesse|profhilo/i);
    expect(el.querySelectorAll('img, picture, video').length).toBe(0);
  });

  it('trägt den Pflichthinweis', () => {
    expect(fixture.nativeElement.textContent).toContain('Nicht mit anderen Aktionen kombinierbar.');
  });

  it('ist nicht indexierbar und folgt keinen Links', () => {
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
  });

  it('bucht direkt seine Hyaluron-Leistung bei Salonkee', () => {
    const book: HTMLAnchorElement = fixture.nativeElement.querySelector('a.btn-gold');
    expect(book.href).toBe('https://salonkee.de/checkout/farewell?serviceID=235681');
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
    expect((calls[0][2] as { page: string }).page).toBe('/promotionen/lippen-nuernberg');
  });
});
