import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PromoExperimentService } from './promo-experiment.service';

describe('PromoExperimentService', () => {
  it('gives a visit one variant and keeps it', () => {
    const service = TestBed.inject(PromoExperimentService);
    const v = service.assign();
    expect(v === 'a' || v === 'b').toBeTrue();
    for (let i = 0; i < 5; i++) expect(service.assign()).toBe(v);
  });

  it('has no variant while prerendering', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    expect(TestBed.inject(PromoExperimentService).assign()).toBeNull();
  });

  it('keeps a visitor who lands on a variant page on that variant', () => {
    const service = TestBed.inject(PromoExperimentService);
    service.enter('a');
    expect(service.assign()).toBe('a');
  });

  it('tags every event with the test and the variant', () => {
    const calls: unknown[][] = [];
    const saved = window.gtag;
    window.gtag = (...args: unknown[]) => calls.push(args);
    try {
      const service = TestBed.inject(PromoExperimentService);
      service.enter('b');
      service.track('promo_view');
      expect(calls.length).toBe(1);
      expect(calls[0][1]).toBe('promo_view');
      expect(calls[0][2]).toEqual(jasmine.objectContaining({ promo_test: 'promotionen_2026_11', promo_variant: 'b' }));
    } finally {
      window.gtag = saved;
    }
  });
});
