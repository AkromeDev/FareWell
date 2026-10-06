import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AesthetischeMedizinComponent } from './aesthetische-medizin.component';

describe('AesthetischeMedizinComponent', () => {
  let component: AesthetischeMedizinComponent;
  let fixture: ComponentFixture<AesthetischeMedizinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AesthetischeMedizinComponent],
      // LanguageService (über den SeoService) braucht einen Router.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AesthetischeMedizinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('legt jede Station innerhalb der Zeitachse ab', () => {
    expect(component.timeline.length).toBeGreaterThan(0);
    for (const row of component.timeline) {
      expect(row.left).toBeGreaterThanOrEqual(0);
      expect(row.width).toBeGreaterThan(0);
      expect(row.left + row.width).toBeLessThanOrEqual(100.001);
    }
  });

  it('bleibt eine Vorschau: noindex, solange Vertrag und Preisliste fehlen', () => {
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('noindex');
  });

  it('nennt die Art jeder Station als Text, nicht nur als Farbe', () => {
    const kinds = fixture.nativeElement.querySelectorAll('.tl-kind .lang.de');
    expect(kinds.length).toBe(component.timeline.length);
  });
});
