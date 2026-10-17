import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MassageRuslanaIvanovaComponent } from './massage-ruslana-ivanova.component';

describe('MassageRuslanaIvanovaComponent', () => {
  let component: MassageRuslanaIvanovaComponent;
  let fixture: ComponentFixture<MassageRuslanaIvanovaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MassageRuslanaIvanovaComponent],
      // LanguageService (über den SeoService) braucht einen Router.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MassageRuslanaIvanovaComponent);
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

  it('zeigt zu jeder Massage einen Preis oder „Preis folgt“ und die Dauer, in beiden Sprachen', () => {
    const items = component.groups.flatMap((group) => group.items);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.price.de).toMatch(/^(ab \d+ €|Preis folgt)/);
      expect(item.price.en).toMatch(/^(from €\d+|price to follow)/);      expect(item.minutes).toBeDefined();
      expect(item.price.de).toMatch(/ · \d+(–\d+)?\u00a0Min\.$/);
    }
    const rows = fixture.nativeElement.querySelectorAll('.menu-row .menu-price .lang.de');
    expect(rows.length).toBe(items.length);
  });

  it('zeigt die Initialen, solange kein Porträt vorliegt', () => {
    const initials = fixture.nativeElement.querySelector('.portrait-initials');
    expect(!!initials).toBe(component.portrait === null);
  });

  it('nennt die Art jeder Station als Text, nicht nur als Farbe', () => {
    const kinds = fixture.nativeElement.querySelectorAll('.tl-kind .lang.de');
    expect(kinds.length).toBe(component.timeline.length);
  });
});
