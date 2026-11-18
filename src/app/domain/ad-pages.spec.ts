import { hidesDrugTermLinks, isStandaloneAdPage, pagePath } from './ad-pages';

describe('ad-pages', () => {
  it('liest den Pfad ohne Sprachpräfix, Query und Fragment', () => {
    expect(pagePath('/en/promotionen/lippen-nuernberg?gclid=abc#ablauf')).toBe('/promotionen/lippen-nuernberg');
    expect(pagePath('/tr/impressum/')).toBe('/impressum');
    expect(pagePath('/en')).toBe('/');
    expect(pagePath('')).toBe('/');
  });

  it('kennt die eigenständige Anzeigenseite in beiden Sprachen', () => {
    expect(isStandaloneAdPage('/promotionen/aesthetische-medizin-nuernberg?gclid=abc')).toBeTrue();
    expect(isStandaloneAdPage('/en/promotionen/aesthetische-medizin-nuernberg')).toBeTrue();
    expect(isStandaloneAdPage('/promotionen/lippen-nuernberg')).toBeFalse();
    expect(isStandaloneAdPage('/promotionen')).toBeFalse();
    expect(isStandaloneAdPage('/')).toBeFalse();
  });

  it('nimmt den Link mit Wirkstoffnamen von den Anzeigenseiten und ihren Zielen', () => {
    expect(hidesDrugTermLinks('/promotionen/aesthetische-medizin-nuernberg')).toBeTrue();
    expect(hidesDrugTermLinks('/promotionen/lippen-nuernberg')).toBeTrue();
    expect(hidesDrugTermLinks('/impressum')).toBeTrue();
    expect(hidesDrugTermLinks('/datenschutz')).toBeTrue();
    expect(hidesDrugTermLinks('/faq')).toBeFalse();
    expect(hidesDrugTermLinks('/')).toBeFalse();
  });
});
