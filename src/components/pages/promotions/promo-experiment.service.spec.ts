import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from 'src/services/analytics.service';
import { PromoExperimentService } from './promo-experiment.service';

const KEY = 'fw_promo_ab';

function withConsent(analytics: boolean | null): () => void {
  const saved = window.fwConsent;
  window.fwConsent = {
    state: () => (analytics === null ? null : { v: 1, an: analytics, ad: false, t: '' }),
    needsBanner: () => analytics === null,
    set: () => ({ v: 1, an: !!analytics, ad: false, t: '' }),
    clear: () => undefined,
  };
  return () => {
    window.fwConsent = saved;
  };
}

describe('PromoExperimentService', () => {
  let restore: () => void = () => undefined;

  beforeEach(() => localStorage.removeItem(KEY));
  afterEach(() => {
    restore();
    localStorage.removeItem(KEY);
  });

  it('alternates between the two pages on every opening', () => {
    restore = withConsent(null);
    const service = TestBed.inject(PromoExperimentService);
    const first = service.next();
    expect(first === 'a' || first === 'b').toBeTrue();
    const seen = [first, service.next(), service.next(), service.next()];
    expect(seen).toEqual(first === 'a' ? ['a', 'b', 'a', 'b'] : ['b', 'a', 'b', 'a']);
  });

  it('has no variant while prerendering', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    expect(TestBed.inject(PromoExperimentService).next()).toBeNull();
  });

  it('with statistics consent, continues the alternation after a reload', () => {
    restore = withConsent(true);
    localStorage.setItem(KEY, 'a');
    expect(TestBed.inject(PromoExperimentService).next()).toBe('b');
    expect(localStorage.getItem(KEY)).toBe('b');
  });

  it('without consent, neither reads nor writes the device', () => {
    restore = withConsent(false);
    localStorage.setItem(KEY, 'a');
    const spy = spyOn(Storage.prototype, 'getItem').and.callThrough();
    const set = spyOn(Storage.prototype, 'setItem').and.callThrough();
    TestBed.inject(PromoExperimentService).next();
    expect(spy).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it('tags every event with the test, the variant and its GA address', () => {
    restore = withConsent(null);
    const calls: unknown[][] = [];
    const saved = window.gtag;
    window.gtag = (...args: unknown[]) => calls.push(args);
    try {
      TestBed.inject(AnalyticsService).setVirtualPath('/promotionen/drehbuehne');
      const service = TestBed.inject(PromoExperimentService);
      const variant = service.next();
      service.track('promo_view');
      expect(calls.length).toBe(1);
      expect(calls[0][1]).toBe('promo_view');
      expect(calls[0][2]).toEqual(
        jasmine.objectContaining({
          promo_test: 'promotionen_2026_11',
          promo_variant: variant,
          page_location: jasmine.stringMatching(/\/promotionen\/drehbuehne/),
        }),
      );
      service.leave();
      service.track('promo_view');
      expect(calls.length).toBe(1);
    } finally {
      window.gtag = saved;
    }
  });
});
