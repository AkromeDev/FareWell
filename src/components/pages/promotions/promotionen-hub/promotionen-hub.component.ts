import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from 'src/services/analytics.service';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { PROMO_VARIANT_PATHS, PromoExperimentService, PromoVariant } from '../promo-experiment.service';
import { PROMO_OFFERS } from '../promotion-offers';
import { Bi, ORIGIN } from '../promotion-page.model';
import { PromoBuehneComponent } from './promo-buehne/promo-buehne.component';
import { PromoFeldComponent } from './promo-feld/promo-feld.component';

const PAGE_PATH = '/promotionen';

/**
 * Der Reiter „Promotionen" im Kopf der Seite: eine Adresse für alle Aktionen,
 * damit Suchmaschinen und KI-Dienste sie gesammelt finden.
 *
 * A/B-Test seit 09.11.2026 (promo-experiment.service.ts): im Browser zeigt
 * /promotionen abwechselnd Variante A „Das Feld" und Variante B „Die
 * Drehbühne", bei gleicher Adresse. Vorgerendert zeigt sie die schlichte
 * Kartenübersicht, so lesen Suchmaschinen und KI-Dienste ohne JavaScript
 * alle Aktionen.
 *
 * Die Anzeigenseite /promotionen/aesthetische-medizin-nuernberg steht bewusst
 * nicht hier: sie ist nur das Ziel der Google Anzeigen.
 */
@Component({
  selector: 'app-promotionen-hub',
  standalone: true,
  imports: [RouterLink, PromoFeldComponent, PromoBuehneComponent],
  templateUrl: './promotionen-hub.component.html',
  styleUrls: ['../promotion-page.scss'],
})
export class PromotionenHubComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly experiment = inject(PromoExperimentService);
  private readonly analytics = inject(AnalyticsService);
  private readonly jsonLdId = 'promotionen-schema';

  readonly cards = PROMO_OFFERS;
  /** Im Browser abwechselnd 'a' oder 'b', im Prerender null (Übersicht). */
  readonly variant: PromoVariant | null = this.experiment.next();

  constructor() {
    // Vor NavigationEnd, damit schon der Seitenaufruf unter dem Pfad der Variante zählt.
    if (this.variant) {
      this.analytics.setVirtualPath(this.language.prefix() + PROMO_VARIANT_PATHS[this.variant]);
    }
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  bi(text: Bi): string {
    return this.t(text.de, text.en);
  }

  link(path: string): string {
    return this.language.localizePath(path);
  }

  ngOnInit(): void {
    const prefix = this.language.prefix();
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const title = this.t(
      'Promotionen und Aktionen in Nürnberg | FareWell',
      'Promotions and offers in Nuremberg | FareWell',
    );
    const description = this.t(
      'Alle aktuellen Promotionen von FareWell in Nürnberg: Botox bei Dr. med. Andrea Leo, 50 % auf die erste Laser, Elektrolyse oder Microneedling Behandlung.',
      'All current FareWell promotions in Nuremberg: Botox with Dr. med. Andrea Leo, 50% off your first laser, electrolysis or microneedling treatment.',
    );
    this.seo.setPageSeo({ title, description, path: PAGE_PATH });
    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: this.language.lang(),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: PROMO_OFFERS.length,
        itemListElement: PROMO_OFFERS.map((card, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: this.bi(card.title),
          description: `${this.bi(card.tag)}: ${this.bi(card.text)}`,
          url: `${ORIGIN}${this.link(card.path)}`,
        })),
      },
    });
    if (this.variant) this.experiment.track('promo_view');
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
    if (this.variant) {
      this.experiment.leave();
      this.analytics.setVirtualPath(null);
    }
  }
}
