import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROMO_OFFERS } from '../../promotion-offers';
import { PromoBuehneComponent } from './promo-buehne.component';

describe('PromoBuehneComponent', () => {
  let fixture: ComponentFixture<PromoBuehneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoBuehneComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(PromoBuehneComponent);
    fixture.detectChanges();
  });

  it('puts every offer on the ring, each with a back side', () => {
    expect(fixture.nativeElement.querySelectorAll('.slot').length).toBe(PROMO_OFFERS.length);
    expect(fixture.nativeElement.querySelectorAll('.back').length).toBe(PROMO_OFFERS.length);
  });

  it('turns the front card over and back', () => {
    const turn: HTMLButtonElement = fixture.nativeElement.querySelector('.turn');
    turn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.flip.is-flipped').length).toBe(1);
    turn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.flip.is-flipped').length).toBe(0);
  });
});
