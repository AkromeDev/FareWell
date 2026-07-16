import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';

const PAGE_PATH = '/karriere/masseur-nuernberg';

@Component({
  standalone: true,
  selector: 'app-masseur-karriere',
  imports: [RouterLink],
  templateUrl: './masseur-karriere.component.html',
  styleUrl: './masseur-karriere.component.scss'
})
export class MasseurKarriereComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly lang = inject(LanguageService);

  private readonly jsonLdId = 'masseur-jobposting-schema';
  private readonly imageUrl =
    'https://farewell.salon/assets/images/logo/android-chrome-512x512.png';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(
        'Masseur:in (m/w/d) in Nürnberg – freiberuflich | Karriere bei FareWell',
        'Massage Therapist (m/f/d) in Nuremberg – Freelance | Careers at FareWell'
      ),
      description: this.t(
        'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.',
        'FareWell Nuremberg is looking for a freelance massage therapist: modern central salon, flexible hours, an online booking system and your own client base.'
      ),
      path: PAGE_PATH,
      image: this.imageUrl,
      imageAlt: 'FareWell Logo',
    });

    this.setStructuredData();
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }

  private setStructuredData(): void {
    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    const jobDescriptionHtmlDe =
      '<p>Für unseren modernen Salon FareWell im Zentrum von Nürnberg suchen wir eine Masseurin oder einen Masseur zur freiberuflichen Zusammenarbeit.</p>' +
      '<p>FareWell ist ein hochwertiger Beauty- und Ästhetik-Salon mit Fokus auf moderne Behandlungen. Unser Ziel ist es, qualifizierten Dienstleisterinnen und Dienstleistern eine professionelle Umgebung zu bieten, in der sie sich vollständig auf ihre Kundinnen und Kunden konzentrieren können.</p>' +
      '<p><strong>Ihre Aufgaben</strong></p>' +
      '<ul><li>Durchführung von Massagen und körperbezogenen Wellness-Behandlungen</li><li>Eigenständige Betreuung der Kundinnen und Kunden</li><li>Professionelles und serviceorientiertes Auftreten</li><li>Einhaltung von Hygiene- und Qualitätsstandards</li><li>Aufbau und Pflege eines eigenen Kundenstamms mit Unterstützung des Salons</li></ul>' +
      '<p><strong>Ihr Profil</strong></p>' +
      '<ul><li>Abgeschlossene Ausbildung als Masseur/in oder eine vergleichbare Qualifikation</li><li>Gültige Zertifizierungen und fachliche Nachweise</li><li>Selbständige und strukturierte Arbeitsweise</li><li>Verantwortungsbewusstsein und Zuverlässigkeit</li><li>Freundliches und gepflegtes Erscheinungsbild</li><li>Professioneller Umgang mit Kundinnen und Kunden</li></ul>' +
      '<p><strong>Wir bieten</strong></p>' +
      '<ul><li>Modernen, voll ausgestatteten Salon in zentraler Lage in Nürnberg</li><li>Nutzung aller vorhandenen Räumlichkeiten und der gesamten Ausstattung</li><li>Transparentes Online-Buchungssystem mit mobiler Termineinsicht</li><li>Vollständig flexible Arbeitszeiten</li><li>Keine Anwesenheitspflicht ohne gebuchte Termine</li><li>Freie Wahl der Behandlungen, auch solche, die bei uns noch nicht im Angebot sind</li><li>Persönliche Vorstellung auf unserer Webseite farewell.salon</li><li>Möglichkeit zur Teilnahme an Online-Marketing-Kampagnen</li><li>Reposts und Sichtbarkeit über unsere Instagram-Kanäle</li><li>Professionelles Umfeld ohne organisatorischen Aufwand</li></ul>';

    const jobDescriptionHtmlEn =
      '<p>For our modern salon FareWell in the centre of Nuremberg we are looking for a massage therapist (m/f/d) for a freelance collaboration.</p>' +
      '<p>FareWell is a high-quality beauty and aesthetics salon with a focus on modern treatments. Our goal is to offer qualified service providers a professional environment in which they can focus fully on their clients.</p>' +
      '<p><strong>Your responsibilities</strong></p>' +
      '<ul><li>Performing massages and body-focused wellness treatments</li><li>Independent care of your clients</li><li>A professional and service-oriented manner</li><li>Adherence to hygiene and quality standards</li><li>Building and nurturing your own client base with the support of the salon</li></ul>' +
      '<p><strong>Your profile</strong></p>' +
      '<ul><li>Completed training as a massage therapist (m/f/d) or a comparable qualification</li><li>Valid certifications and professional credentials</li><li>An independent and structured way of working</li><li>A strong sense of responsibility and reliability</li><li>A friendly and well-groomed appearance</li><li>A professional approach with clients</li></ul>' +
      '<p><strong>What we offer</strong></p>' +
      '<ul><li>A modern, fully equipped salon in a central location in Nuremberg</li><li>Use of all available rooms and the entire equipment</li><li>A transparent online booking system with mobile appointment access</li><li>Fully flexible working hours</li><li>No obligation to be present without booked appointments</li><li>Free choice of treatments, including ones we do not yet offer</li><li>A personal profile on our website farewell.salon</li><li>The option to take part in online marketing campaigns</li><li>Reposts and visibility through our Instagram channels</li><li>A professional environment without any organizational effort</li></ul>';

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'JobPosting',
          '@id': `${pageUrl}#jobposting`,
          title: this.t(
            'Masseur / Masseurin (m/w/d): freiberufliche Zusammenarbeit',
            'Massage therapist (m/f/d): freelance collaboration'
          ),
          description: this.t(jobDescriptionHtmlDe, jobDescriptionHtmlEn),
          inLanguage: isEn ? 'en' : 'de',
          datePosted: '2026-07-07',
          employmentType: 'CONTRACTOR',
          directApply: true,
          industry: this.t('Beauty und Wellness', 'Beauty and wellness'),
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
            email: 'info@farewell.salon',
            contactType: this.t('Bewerbung', 'Application')
          },
          qualifications: this.t(
            'Abgeschlossene Ausbildung als Masseur/in oder eine vergleichbare Qualifikation, gültige Zertifizierungen und fachliche Nachweise',
            'Completed training as a massage therapist (m/f/d) or a comparable qualification, valid certifications and professional credentials'
          ),
          workHours: this.t('Vollständig flexible Arbeitszeiten', 'Fully flexible working hours')
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: this.t(
            'Masseur:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
            'Massage Therapist (m/f/d) in Nuremberg: Freelance | Careers at FareWell'
          ),
          description: this.t(
            'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.',
            'FareWell Nuremberg is looking for a freelance massage therapist: modern central salon, flexible hours, an online booking system and your own client base.'
          ),
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': `${pageUrl}#jobposting`
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: isEn ? 'https://farewell.salon/en' : 'https://farewell.salon'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Karriere: Masseur:in', 'Careers: massage therapist'),
              item: pageUrl
            }
          ]
        }
      ]
    });
  }
}
