import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { GUIDE_COMPONENTS, type GuideStat, type GuideTocItem } from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS } from 'src/components/molecules/karriere';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';

const PAGE_PATH = '/karriere';
const ORIGIN = 'https://farewell.salon';

/** Eine offene Position auf der Übersicht. */
interface KarrierePosition {
  icon: string;
  title: string;
  text: string;
  /** Deutscher Pfad der Detailseite; wird per p() lokalisiert. */
  path: string;
  linkLabel: string;
}

/**
 * Karriere-Übersicht: Philosophie, der geteilte Deal, der Ablauf vom
 * Erstgespräch bis zum Launch und alle offenen Positionen als Karten.
 *
 * Die Detailseiten hängen an den hier gelisteten Pfaden — dieselbe Liste
 * speist das ItemList-Schema, damit Google die Sammlung als Ganzes versteht.
 */
@Component({
  standalone: true,
  selector: 'app-karriere-hub',
  imports: [
    ...GUIDE_COMPONENTS,
    ...KARRIERE_COMPONENTS,
    RevealOnScrollDirective,
    ScrollToDirective,
    RouterLink,
  ],
  templateUrl: './karriere-hub.component.html',
})
export class KarriereHubComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly jsonLdId = 'karriere-hub-schema';

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  /**
   * Voller Pfad für Anker-Links: Wegen <base href="/"> würde ein nacktes
   * "#bewerben" zur Startseite auflösen (vgl. app-guide-toc).
   */
  get pagePath(): string {
    return this.router.url.split('#')[0].split('?')[0];
  }

  get stats(): GuideStat[] {
    return [
      { value: '5', label: this.t('offene Bereiche', 'open areas') },
      { value: '0 €', label: this.t('feste Raummiete', 'fixed room rent'), animate: false },
      { value: '100%', label: this.t('deine Kund:innen', 'your own clients') },
      { value: this.t('selbständig', 'freelance'), label: this.t('dein Status', 'your status') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'philosophie', label: this.t('Unsere Philosophie', 'Our philosophy') },
      { id: 'deal', label: this.t('Dein Deal bei FareWell', 'Your deal at FareWell') },
      { id: 'zeiten', label: this.t('Zeiten und Raumbelegung', 'Hours and room use') },
      { id: 'start', label: this.t('So läuft der Start', 'How the start works') },
      { id: 'stellen', label: this.t('Offene Positionen', 'Open positions') },
      { id: 'bewerben', label: this.t('Bewerben', 'Apply') },
    ];
  }

  get positions(): KarrierePosition[] {
    const t = (de: string, en: string) => this.t(de, en);
    const more = t('Zur Stelle', 'View the role');

    return [
      {
        icon: '✨',
        title: t('Kosmetiker:in', 'Beautician'),
        text: t(
          'Dein eigener Schwerpunkt in einem eingerichteten Studio: Gesichtsbehandlungen, Pflege, deine Spezialitäten. Immer nur eine Kosmetikerin gleichzeitig, dein Konzept ergänzt statt doppelt.',
          'Your own focus inside a fully set-up studio: facials, skincare, your specialities. Only ever one beautician at a time, so your concept complements rather than duplicates.'
        ),
        path: '/karriere/kosmetik-nuernberg',
        linkLabel: more,
      },
      {
        icon: '🤲',
        title: t('Masseur:in', 'Massage therapist'),
        text: t(
          'Deine eigene kleine Massagepraxis mitten im Studio, mit einem öffentlichen Onboarding-Leitfaden, in dem alle Zahlen offen stehen.',
          'Your own little massage practice inside the studio, with a public onboarding guide in which all the numbers are laid out openly.'
        ),
        path: '/karriere/masseur-nuernberg',
        linkLabel: more,
      },
      {
        icon: '🧘',
        title: t('Yoga-Lehrer:in', 'Yoga teacher'),
        text: t(
          'Yoga gibt es bei uns noch nicht. Ein ruhiger Raum für kleine Gruppen und Einzelstunden wartet auf jemanden, der es aufbaut. Stunden abends und am Wochenende.',
          'Yoga does not exist here yet. A quiet room for small groups and one-to-one sessions is waiting for someone to build it. Classes in the evening and at the weekend.'
        ),
        path: '/karriere/yoga-nuernberg',
        linkLabel: more,
      },
      {
        icon: '💃',
        title: t('Tanzlehrer:in', 'Dance teacher'),
        text: t(
          'Ein flexibler Raum für Einzelunterricht, Paare und kleine Gruppen. Kein Tanzsaal, dafür ein Standort mitten in der Innenstadt. Unterricht abends und am Wochenende.',
          'A flexible room for one-to-one lessons, couples and small groups. Not a dance hall, but a location right in the city centre. Lessons in the evening and at the weekend.'
        ),
        path: '/karriere/tanzlehrer-nuernberg',
        linkLabel: more,
      },
      {
        icon: '💉',
        title: t('Botox & ästhetische Medizin', 'Botox & aesthetic medicine'),
        text: t(
          'Für approbierte Ärzt:innen mit Injektionserfahrung: ein eigenes ästhetisches Angebot, eingebettet in unser bestehendes Modell mit ärztlicher Verantwortung.',
          'For licensed physicians with injection experience: your own aesthetic offering, embedded in our existing model with medical responsibility.'
        ),
        path: '/karriere/botox-nuernberg',
        linkLabel: more,
      },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const title = this.t(
      'Karriere bei FareWell Nürnberg: freiberuflich arbeiten im Studio',
      'Careers at FareWell Nuremberg: Work Freelance in Our Studio'
    );
    const description = this.t(
      'Offene Positionen bei FareWell Nürnberg für Selbständige: Kosmetik, Massage, Yoga, Tanz und ästhetische Medizin. Voll ausgestatteter Raum im Zentrum, keine feste Miete, flexible Zeiten und Hilfe beim eigenen Google-Business-Profil.',
      'Open positions at FareWell Nuremberg for freelancers: cosmetics, massage, yoga, dance and aesthetic medicine. A fully equipped room in the city centre, no fixed rent, flexible hours and help setting up your own Google Business profile.'
    );
    const pageUrl = `${ORIGIN}${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? `${ORIGIN}/en` : ORIGIN;

    this.seo.setPageSeo({ title, description, path: PAGE_PATH });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: { '@id': `${ORIGIN}/#website` },
        },
        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#positions`,
          name: this.t('Offene Positionen bei FareWell', 'Open positions at FareWell'),
          itemListElement: this.positions.map((position, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: position.title,
            url: `${ORIGIN}${isEn ? '/en' : ''}${position.path}`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Karriere', 'Careers'),
              item: pageUrl,
            },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
