import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/elektrolyse-permanente-haarentfernung-aktion-nuernberg';
const HERO_IMAGE_URL = 'https://farewell.salon/assets/images/treatment/nadel.jpg';

@Component({
  standalone: true,
  selector: 'app-electrolysis-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './electrolysis-promotion.component.html',
  styleUrl: './electrolysis-promotion.component.scss'
})
export class ElectrolysisPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'electrolysis-promo-schema';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Permanente Haarentfernung mit Elektrolyse in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Perfekt, um den Start in eine glattere und pflegeleichtere Zukunft zu setzen.
  `,
      `
    Permanent hair removal with electrolysis (Nadelepilation) in Nuremberg at FareWell.

    This offer is exclusively for new clients and only for a short time.
    Perfect for starting your journey into a smoother, lower-maintenance future.
  `
    );
  }

  get buttonList(): ButtonItem[] {
    return [
      { label: this.t('Unsere Preise', 'Our prices'), link: this.p('/price'), theme: 'dark' },
      {
        label: this.t('Termin buchen', 'Book now'),
        link: 'https://salonkee.de/salon/farewell?lang=de',
        theme: 'dark',
        external: true,
        analyticsEvent: 'generate_lead',
        analyticsLocation: 'electrolysis-page',
        analyticsLabel: 'Termin Buchen Electrolysis Page'
      }
    ];
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(
        'Elektrolyse Aktion Nürnberg | Permanente Haarentfernung',
        'Electrolysis Offer Nuremberg | Permanent Hair Removal | FareWell'
      ),
      description: this.t(
        'Sonderangebot für Elektrolyse (permanente Haarentfernung) in Nürnberg bei FareWell.',
        'Special offer for electrolysis (permanent hair removal) in Nuremberg at FareWell: 50% off your first treatment.'
      ),
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: this.t(
        'Elektrolyse Behandlung bei FareWell in Nürnberg zur permanenten Haarentfernung',
        'Electrolysis treatment at FareWell in Nuremberg for permanent hair removal'
      ),
      largeImage: true
    });

    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: this.t(
        'Elektrolyse: permanente Haarentfernung',
        'Electrolysis: permanent hair removal'
      ),
      description: this.t(
        'Permanente Haarentfernung mit Elektrolyse bei FareWell in Nürnberg. ' +
          'Die einzige wirklich permanente Methode zur Haarentfernung.',
        'Permanent hair removal with electrolysis at FareWell in Nuremberg. ' +
          'The only truly permanent hair removal method.'
      ),
      serviceType: this.t('Elektrolyse Haarentfernung', 'Electrolysis hair removal'),
      url: pageUrl,
      image: HERO_IMAGE_URL,
      inLanguage: isEn ? 'en' : 'de',
      areaServed: {
        '@type': 'City',
        name: this.t('Nürnberg', 'Nuremberg')
      },
      provider: {
        '@type': 'BeautySalon',
        '@id': 'https://farewell.salon/#organization',
        name: 'FareWell',
        url: 'https://farewell.salon',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Frauentorgraben 5',
          addressLocality: 'Nürnberg',
          postalCode: '90443',
          addressCountry: 'DE'
        }
      },
      offers: {
        '@type': 'Offer',
        description: this.t(
          '50 % Rabatt auf die erste Elektrolyse Behandlung für Neukundinnen und Neukunden',
          '50% discount on the first electrolysis treatment for new clients'
        ),
        priceCurrency: 'EUR',
        url: pageUrl
      }
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
