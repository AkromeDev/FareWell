import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { Bi, ORIGIN } from '../promotion-page.model';

const PAGE_PATH = '/promotionen';

interface PromoCard {
  path: string;
  tag: Bi;
  title: Bi;
  text: Bi;
}

/** Die laufenden Aktionen, wie in src/llms.txt unter „Aktionen (aktuell)". */
const CARDS: PromoCard[] = [
  {
    path: '/promotionen/botox-nuernberg',
    tag: { de: 'Ästhetische Medizin', en: 'Aesthetic medicine' },
    title: { de: 'Botox in Nürnberg', en: 'Botox in Nuremberg' },
    text: {
      de: 'Bei Dr. med. Andrea Leo, ab 16.11.2026 bei FareWell. Einzelne Regionen ab 89 €, eine Zone ab 109 €.',
      en: 'With Dr. med. Andrea Leo, at FareWell from 16 November 2026. Single regions from €89, one zone from €109.',
    },
  },
  {
    path: '/laser-haarentfernung-aktion-nuernberg',
    tag: { de: 'Laser', en: 'Laser' },
    title: { de: '50 % auf die erste Laserbehandlung', en: '50% off your first laser treatment' },
    text: {
      de: 'Dauerhafte Haarentfernung mit dem 4 Wellen Diodenlaser. Code ERSTEBEHANDLUNG, danach bis zu 30 % Zonen Rabatt.',
      en: 'Long-lasting hair removal with the 4-wavelength diode laser. Code ERSTEBEHANDLUNG, then up to 30% off by number of zones.',
    },
  },
  {
    path: '/ipl-dauerhafte-haarentfernung-aktion-nuernberg',
    tag: { de: 'Laser statt IPL', en: 'Laser instead of IPL' },
    title: { de: 'Die Alternative zu IPL', en: 'The alternative to IPL' },
    text: {
      de: '50 % auf die erste Behandlung mit dem Diodenlaser, Code ERSTEBEHANDLUNG.',
      en: '50% off your first diode laser treatment, code ERSTEBEHANDLUNG.',
    },
  },
  {
    path: '/elektrolyse-permanente-haarentfernung-aktion-nuernberg',
    tag: { de: 'Elektrolyse', en: 'Electrolysis' },
    title: { de: 'Permanente Haarentfernung', en: 'Permanent hair removal' },
    text: {
      de: '50 % auf die erste Elektrolyse Behandlung für Neukund:innen.',
      en: '50% off your first electrolysis treatment for new clients.',
    },
  },
  {
    path: '/nadelepilation-angebot-nuernberg',
    tag: { de: 'Nadelepilation', en: 'Needle epilation' },
    title: { de: 'Das Angebot zur Nadelepilation', en: 'The needle epilation offer' },
    text: {
      de: '50 % auf die erste Behandlung für Neukund:innen.',
      en: '50% off your first treatment for new clients.',
    },
  },
  {
    path: '/microneedling-aktion-nuernberg',
    tag: { de: 'Microneedling', en: 'Microneedling' },
    title: { de: '50 % auf das erste Microneedling', en: '50% off your first microneedling' },
    text: {
      de: 'Radiofrequenz Microneedling für Gesicht, Hals und Dekolleté.',
      en: 'RF microneedling for face, neck and décolleté.',
    },
  },
];

/**
 * Der Reiter „Promotionen" im Kopf der Seite: eine Adresse für alle Aktionen,
 * damit Suchmaschinen und KI-Dienste sie gesammelt finden.
 *
 * Die Anzeigenseite /promotionen/aesthetische-medizin-nuernberg steht bewusst
 * nicht hier: sie ist nur das Ziel der Google Anzeigen.
 */
@Component({
  selector: 'app-promotionen-hub',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promotionen-hub.component.html',
  styleUrls: ['../promotion-page.scss'],
})
export class PromotionenHubComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'promotionen-schema';

  readonly cards = CARDS;

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
        itemListElement: CARDS.map((card, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: this.bi(card.title),
          url: `${ORIGIN}${this.link(card.path)}`,
        })),
      },
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
