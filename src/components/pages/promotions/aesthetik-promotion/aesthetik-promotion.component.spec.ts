import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AesthetikPromotionComponent } from './aesthetik-promotion.component';

describe('AesthetikPromotionComponent', () => {
  let fixture: ComponentFixture<AesthetikPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AesthetikPromotionComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AesthetikPromotionComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('nennt keine Wirkstoff- oder Markennamen', () => {
    const el: HTMLElement = fixture.nativeElement;
    const text = el.textContent + ' ' + el.innerHTML;
    expect(text).not.toMatch(/botox|botulinum|prp\\b|sculptra|radiesse|profhilo|azzalure|vistabel|bocouture|dysport/i);
  });

  it('ist nicht indexierbar', () => {
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
  });
});
