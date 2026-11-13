import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Unter einem Dach', () => {
    const items = () => Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.roof-list li'));

    it('nennt die drei mit je einer Zeile, der Name ist der Link', () => {
      expect(items().map((item) => item.querySelector('a')?.textContent?.trim())).toEqual([
        'FareWell',
        'Dr. med. Andrea Leo',
        'LEVEL 44',
      ]);
      const german = items().map((item) => {
        const copy = item.cloneNode(true) as HTMLElement;
        copy.querySelectorAll('.lang.en').forEach((node) => node.remove());
        return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
      });
      expect(german).toEqual([
        'FareWell · Kosmetikstudio und Haarentfernung, Frauentorgraben 5, Nürnberg',
        'Dr. med. Andrea Leo · Ästhetische Medizin',
        'LEVEL 44 · 9D Breathwork und Soul Touch mit Franziska Preusche',
      ]);
    });

    it('bleibt auf dieser Website, solange die Website eines Partners nicht öffentlich ist', () => {
      expect(component.drLeoSite.public).toBeFalse();
      expect(component.level44Site.public).toBeFalse();
      expect(items().map((item) => item.querySelector('a')?.getAttribute('href'))).toEqual([
        '/',
        '/behandlungen/aesthetische-medizin',
        '/behandlungen/level-44',
      ]);
    });

    it('führt zu den eigenen Websites, sobald sie öffentlich sind', () => {
      Object.assign(component, {
        drLeoSite: { ...component.drLeoSite, public: true },
        level44Site: { ...component.level44Site, public: true },
      });
      fixture.detectChanges();
      expect(items().map((item) => item.querySelector('a')?.getAttribute('href'))).toEqual([
        '/',
        'https://drleoaesthetic.de',
        component.level44Site.origin,
      ]);
    });

    it('nennt keinen Wirkstoff (die Zielseite der Google Anzeigen zeigt den Block auch)', () => {
      const text = (fixture.nativeElement as HTMLElement).querySelector('.roof')?.textContent ?? '';
      expect(text).not.toMatch(/botox|botulinum|hyaluron/i);
    });
  });
});
