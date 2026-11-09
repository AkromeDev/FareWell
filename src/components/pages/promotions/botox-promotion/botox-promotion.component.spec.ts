import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BotoxPromotionComponent } from './botox-promotion.component';

describe('BotoxPromotionComponent', () => {
  let fixture: ComponentFixture<BotoxPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotoxPromotionComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BotoxPromotionComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ist indexierbar und nennt Botox', () => {
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '').not.toContain('noindex');
    expect(fixture.nativeElement.textContent).toContain('Botox');
  });

  it('behauptet nicht, der günstigste zu sein', () => {
    expect(fixture.nativeElement.textContent).not.toMatch(/günstigste|cheapest/i);
  });
});
