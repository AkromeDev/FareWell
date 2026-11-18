import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('zeigt auf gewöhnlichen Seiten Menü und Footer der Website', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-header')).not.toBeNull();
    expect(el.querySelector('app-footer')).not.toBeNull();
    expect(el.querySelector('app-ad-header')).toBeNull();
  });

  it('zeigt auf einer eigenständigen Anzeigenseite nur Schriftzug, Kontakt und rechtliche Links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.adPage = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-header')).toBeNull();
    expect(el.querySelector('app-footer')).toBeNull();
    expect(el.querySelector('app-ad-header .ad-logo')?.textContent).toContain('FareWell');
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('app-ad-header a, app-ad-footer a')).map((a) =>
      a.getAttribute('href'),
    );
    expect(links.filter((href) => href?.startsWith('/'))).toEqual(['/en/', '/impressum', '/datenschutz']);
    expect(el.querySelector('app-ad-footer [data-consent="open"]')).not.toBeNull();
    expect(el.textContent).not.toMatch(/botox|botulinum/i);
  });
});
