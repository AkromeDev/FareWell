import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROMO_OFFERS } from '../../promotion-offers';
import { PromoFeldComponent } from './promo-feld.component';

describe('PromoFeldComponent', () => {
  let fixture: ComponentFixture<PromoFeldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoFeldComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(PromoFeldComponent);
    fixture.detectChanges();
  });

  it('lists every offer as a row', () => {
    const rows = fixture.nativeElement.querySelectorAll('.row');
    expect(rows.length).toBe(PROMO_OFFERS.length);
  });

  it('opens one row at a time', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.row-btn'));
    buttons[2].click();
    fixture.detectChanges();
    const open = fixture.nativeElement.querySelectorAll('.row.is-open');
    expect(open.length).toBe(1);
    expect(buttons[2].getAttribute('aria-expanded')).toBe('true');
  });
});
