import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-masseur-karriere',
  imports: [],
  templateUrl: './masseur-karriere.component.html',
  styleUrl: './masseur-karriere.component.scss'
})
export class MasseurKarriereComponent implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  private readonly jsonLdScriptId = 'masseur-jobposting-schema';
  private readonly pageUrl = 'https://farewell.salon/karriere/masseur-nuernberg';
  private readonly imageUrl =
    'https://farewell.salon/assets/images/logo/android-chrome-512x512.png';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  ngOnDestroy(): void {
    this.document.getElementById(this.jsonLdScriptId)?.remove();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Masseur:in (m/w/d) in Nürnberg – freiberuflich | Karriere bei FareWell';

    const description =
      'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.';

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.pageUrl });
    this.meta.updateTag({ property: 'og:image', content: this.imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: 'FareWell Logo' });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.imageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'FareWell Logo' });
  }

  // Anders als auf den übrigen Seiten wird das JSON-LD hier direkt in den <head>
  // injiziert: <script>-Tags in Angular-Templates werden vom Compiler entfernt
  // und landen daher nie im gerenderten HTML.
  private setStructuredData(): void {
    const jobDescriptionHtml =
      '<p>Für unseren modernen Salon FareWell im Zentrum von Nürnberg suchen wir eine Masseurin oder einen Masseur zur freiberuflichen Zusammenarbeit.</p>' +
      '<p>FareWell ist ein hochwertiger Beauty- und Ästhetik-Salon mit Fokus auf moderne Behandlungen. Unser Ziel ist es, qualifizierten Dienstleisterinnen und Dienstleistern eine professionelle Umgebung zu bieten, in der sie sich vollständig auf ihre Kundinnen und Kunden konzentrieren können.</p>' +
      '<p><strong>Ihre Aufgaben</strong></p>' +
      '<ul><li>Durchführung von Massagen und körperbezogenen Wellness-Behandlungen</li><li>Eigenständige Betreuung der Kundinnen und Kunden</li><li>Professionelles und serviceorientiertes Auftreten</li><li>Einhaltung von Hygiene- und Qualitätsstandards</li><li>Aufbau und Pflege eines eigenen Kundenstamms mit Unterstützung des Salons</li></ul>' +
      '<p><strong>Ihr Profil</strong></p>' +
      '<ul><li>Abgeschlossene Ausbildung als Masseur/in oder eine vergleichbare Qualifikation</li><li>Gültige Zertifizierungen und fachliche Nachweise</li><li>Selbständige und strukturierte Arbeitsweise</li><li>Verantwortungsbewusstsein und Zuverlässigkeit</li><li>Freundliches und gepflegtes Erscheinungsbild</li><li>Professioneller Umgang mit Kundinnen und Kunden</li></ul>' +
      '<p><strong>Wir bieten</strong></p>' +
      '<ul><li>Modernen, voll ausgestatteten Salon in zentraler Lage in Nürnberg</li><li>Nutzung aller vorhandenen Räumlichkeiten und der gesamten Ausstattung</li><li>Transparentes Online-Buchungssystem mit mobiler Termineinsicht</li><li>Vollständig flexible Arbeitszeiten</li><li>Keine Anwesenheitspflicht ohne gebuchte Termine</li><li>Freie Wahl der Behandlungen</li><li>Persönliche Vorstellung auf unserer Webseite farewell.salon</li><li>Möglichkeit zur Teilnahme an Online-Marketing-Kampagnen</li><li>Reposts und Sichtbarkeit über unsere Instagram-Kanäle</li><li>Professionelles Umfeld ohne organisatorischen Aufwand</li></ul>';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'JobPosting',
          '@id': `${this.pageUrl}#jobposting`,
          title: 'Masseur / Masseurin (m/w/d) – freiberufliche Zusammenarbeit',
          description: jobDescriptionHtml,
          datePosted: '2026-07-07',
          employmentType: 'CONTRACTOR',
          directApply: true,
          industry: 'Beauty und Wellness',
          hiringOrganization: {
            '@type': 'BeautySalon',
            '@id': 'https://farewell.salon/#organization',
            name: 'FareWell',
            url: 'https://farewell.salon',
            logo: this.imageUrl,
            sameAs: [
              'https://www.instagram.com/farewell.salon/'
            ]
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Frauentorgraben 5',
              postalCode: '90443',
              addressLocality: 'Nürnberg',
              addressRegion: 'Bayern',
              addressCountry: 'DE'
            }
          },
          applicationContact: {
            '@type': 'ContactPoint',
            email: 'farewellgmbh@gmail.com',
            contactType: 'Bewerbung'
          },
          qualifications:
            'Abgeschlossene Ausbildung als Masseur/in oder eine vergleichbare Qualifikation, gültige Zertifizierungen und fachliche Nachweise',
          workHours: 'Vollständig flexible Arbeitszeiten'
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Masseur:in (m/w/d) in Nürnberg – freiberuflich | Karriere bei FareWell',
          description:
            'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': `${this.pageUrl}#jobposting`
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon' },
            { '@type': 'ListItem', position: 2, name: 'Karriere: Masseur:in', item: this.pageUrl }
          ]
        }
      ]
    };

    if (this.document.getElementById(this.jsonLdScriptId)) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = this.jsonLdScriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    this.document.head.appendChild(script);
  }
}
