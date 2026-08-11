import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GUIDE_COMPONENTS, type GuideStat } from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS, type KarriereRole } from 'src/components/molecules/karriere';
import { KarriereDetailPage } from '../shared/karriere-detail-page';
import { KarriereJobConfig } from '../shared/karriere-seo';
import { karriereFaqEntries, zeitStat } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/masseur-nuernberg';

/**
 * Stellenseite für selbständige Masseur:innen — die älteste der
 * Karriere-Seiten. Slug, JSON-LD-id und die bereits indexierten
 * Titel/Descriptions bleiben unverändert; Aufbau und Deal kommen inzwischen
 * aus dem geteilten Karriere-Baukasten. Die konkreten Zahlen zur Abrechnung
 * stehen weiterhin im Onboarding-Leitfaden, auf den die FAQ verweist.
 */
@Component({
  standalone: true,
  selector: 'app-masseur-karriere',
  imports: [...GUIDE_COMPONENTS, ...KARRIERE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './masseur-karriere.component.html',
})
export class MasseurKarriereComponent extends KarriereDetailPage {
  protected readonly jsonLdId = 'masseur-jobposting-schema';
  override readonly role: KarriereRole = 'massage';
  protected override readonly ogImage = 'assets/images/massages/tm massaging.jpg';

  /** Das längste Fenster im Haus: der Massageraum hängt nicht an der Kosmetik. */
  protected override get hoursStat(): GuideStat {
    return zeitStat((de, en) => this.t(de, en), '08–22', 'Mo–Sa', 'Mon–Sat');
  }

  protected buildConfig(): KarriereJobConfig {
    const t = (de: string, en: string) => this.t(de, en);

    return {
      path: PAGE_PATH,
      title: t(
        'Masseur:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
        'Massage Therapist (m/f/d) in Nuremberg: Freelance | Careers at FareWell'
      ),
      description: t(
        'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.',
        'FareWell Nuremberg is looking for a freelance massage therapist: modern central salon, flexible hours, an online booking system and your own client base.'
      ),
      jobTitle: t(
        'Masseur / Masseurin (m/w/d): freiberufliche Zusammenarbeit',
        'Massage therapist (m/f/d): freelance collaboration'
      ),
      datePosted: '2026-07-07',
      occupationalCategory: t('Massage und Wellness', 'Massage and wellness'),
      industry: t('Beauty und Wellness', 'Beauty and wellness'),
      breadcrumbName: t('Karriere: Masseur:in', 'Careers: massage therapist'),
      qualifications: t(
        'Abgeschlossene Ausbildung als Masseur:in oder eine vergleichbare Qualifikation, gültige Zertifizierungen und fachliche Nachweise, eine eigene Berufshaftpflicht und ein angemeldetes Gewerbe.',
        'Completed training as a massage therapist or a comparable qualification, valid certifications and professional credentials, your own professional liability insurance and a registered trade.'
      ),
      intro: t(
        'Für unseren modernen Salon FareWell im Zentrum von Nürnberg suchen wir eine Masseurin oder einen Masseur zur freiberuflichen Zusammenarbeit.',
        'For our modern salon FareWell in the centre of Nuremberg we are looking for a massage therapist for a freelance collaboration.'
      ),
      applySubject: t(
        'Bewerbung als Masseur:in bei FareWell',
        'Application as a massage therapist at FareWell'
      ),
      // Der Massageraum ist nicht an die Kosmetik-Öffnungszeiten gebunden.
      workHours: t(
        'Massagen Mo–Sa 08:00–22:00 Uhr, unabhängig von den Öffnungszeiten der Kosmetik. Deine festen wöchentlichen Zeitfenster legen wir gemeinsam fest; keine Anwesenheitspflicht ohne gebuchte Termine.',
        'Massages Mon–Sat 08:00–22:00, independent of the cosmetics opening hours. We agree your fixed weekly slots together; no obligation to be present without booked appointments.'
      ),
      responsibilities: [
        t(
          'Durchführung von Massagen und körperbezogenen Wellness-Behandlungen',
          'Performing massages and body-focused wellness treatments'
        ),
        t('Eigenständige Betreuung deiner Kund:innen', 'Independent care of your clients'),
        t(
          'Aufbau und Pflege eines eigenen Kundenstamms mit Unterstützung des Salons',
          'Building and nurturing your own client base with the support of the salon'
        ),
        t(
          'Freie Wahl deiner Behandlungen, auch solche, die wir bislang nicht anbieten',
          'Free choice of your treatments, including ones we do not yet offer'
        ),
        t(
          'Einhaltung von Hygiene- und Qualitätsstandards',
          'Adherence to hygiene and quality standards'
        ),
      ],
      profile: [
        t(
          'Abgeschlossene Ausbildung als Masseur:in oder eine vergleichbare Qualifikation',
          'Completed training as a massage therapist or a comparable qualification'
        ),
        t(
          'Gültige Zertifizierungen und fachliche Nachweise',
          'Valid certifications and professional credentials'
        ),
        t(
          'Selbständige und strukturierte Arbeitsweise',
          'An independent and structured way of working'
        ),
        t(
          'Verantwortungsbewusstsein und Zuverlässigkeit',
          'A strong sense of responsibility and reliability'
        ),
        t(
          'Eigene Berufshaftpflicht und ein angemeldetes Gewerbe',
          'Your own professional liability insurance and a registered trade'
        ),
        t('Professioneller Umgang mit Kund:innen', 'A professional approach with clients'),
      ],
      faq: karriereFaqEntries(t, {
        extra: [
          {
            question: t(
              'Wo finde ich die konkreten Zahlen zur Abrechnung?',
              'Where do I find the concrete numbers on settlement?'
            ),
            answer: t(
              'In unserem Onboarding-Leitfaden für Masseur:innen. Dort stehen die Aufteilung mit Rechenbeispiel, die drei Wege zu neuen Kund:innen und alles rund um den geteilten Raum ausführlich beschrieben, auf Deutsch und auf Englisch.',
              'In our onboarding guide for massage therapists. It describes the split with a worked example, the three ways to win new clients and everything about the shared room in detail, in German and in English.'
            ),
            linkPath: '/karriere/masseur-nuernberg/onboarding',
            linkLabel: t(
              'Zum Onboarding-Leitfaden für Masseur:innen',
              'To the onboarding guide for massage therapists'
            ),
          },
          {
            question: t(
              'Muss ich Massageöl und Material selbst mitbringen?',
              'Do I have to bring my own massage oil and supplies?'
            ),
            answer: t(
              'Aromaöle stellen wir. Deine Verbrauchsmaterialien und dein Massageöl bringst du mit; weil sich mehrere den Raum teilen, klärt ihr untereinander, ob ihr eine Flasche teilt oder jede und jeder die eigene mitbringt. Die Wäsche ist geregelt, du stellst am Ende deiner Schicht nur die Maschine an.',
              'We provide the aroma oils. You bring your own consumables and your massage oil; since several of you share the room, you sort out among yourselves whether to share a bottle or each bring your own. Laundry is taken care of, you just start the machine at the end of your shift.'
            ),
          },
          {
            question: t(
              'Wie viele arbeiten im Massageraum?',
              'How many people work in the massage room?'
            ),
            answer: t(
              'Mehrere Selbständige teilen sich den Massageraum. Deine festen wöchentlichen Zeitfenster legen wir deshalb gemeinsam fest, damit Raum und Buchungskalender für alle sauber bleiben.',
              'Several freelancers share the massage room. That is why we agree your fixed weekly time slots together, so the room and the booking calendar stay clean for everyone.'
            ),
          },
        ],
      }),
    };
  }
}
