import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CookieBannerComponent } from './cookie-banner.component';

describe('CookieBannerComponent', () => {
  function create(platform: 'browser' | 'server', staticPage: boolean): ComponentFixture<CookieBannerComponent> {
    TestBed.configureTestingModule({
      imports: [CookieBannerComponent],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const fixture = TestBed.createComponent(CookieBannerComponent);
    fixture.componentRef.setInput('staticPage', staticPage);
    fixture.detectChanges();
    return fixture;
  }

  const sheet = (fixture: ComponentFixture<CookieBannerComponent>) =>
    (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('[data-ad-consent]');

  it('schreibt beim Prerendering einer gewöhnlichen Seite nichts', () => {
    expect(sheet(create('server', false))).toBeNull();
  });

  describe('beim Prerendering einer eigenständigen Anzeigenseite', () => {
    let el: HTMLElement;

    beforeEach(() => {
      el = sheet(create('server', true))!;
    });

    it('steht der Banner versteckt in der Datei, mit beiden Ebenen', () => {
      expect(el.hasAttribute('hidden')).toBeTrue();
      const details = el.querySelector<HTMLElement>('[data-consent-details]');
      expect(details?.hasAttribute('hidden')).toBeTrue();
      expect(details?.querySelectorAll('input[data-consent-box]').length).toBe(2);
    });

    it('sind beide Schalter aus (keine Vorbelegung)', () => {
      const boxes = Array.from(el.querySelectorAll<HTMLInputElement>('input[data-consent-box]'));
      expect(boxes.map((box) => box.getAttribute('data-consent-box'))).toEqual(['an', 'ad']);
      expect(boxes.some((box) => box.checked)).toBeFalse();
    });

    it('trägt jeder Knopf das Attribut, das ad-page.js liest', () => {
      const actions = Array.from(el.querySelectorAll('[data-consent]')).map((button) => button.getAttribute('data-consent'));
      expect(actions).toEqual(['reject', 'accept', 'save', 'toggle']);
      const toggle = el.querySelector('[data-consent="toggle"]');
      expect(toggle?.getAttribute('data-label-open')).toBe('Einstellungen');
      expect(toggle?.getAttribute('data-label-close')).toBe('Einstellungen schließen');
    });
  });

  it('arbeitet im Browser auf einer Anzeigenseite wie überall, ohne hidden', () => {
    const fixture = create('browser', true);
    const el = sheet(fixture);
    // Ohne gespeicherte Wahl und ohne window.fwConsent bleibt der Banner zu.
    if (el) {
      expect(el.hasAttribute('hidden')).toBeFalse();
    } else {
      expect(fixture.componentInstance.staticMarkup()).toBeFalse();
    }
  });
});
