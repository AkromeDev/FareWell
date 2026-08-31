import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
} from 'src/components/molecules/guide';
import {
  KARRIERE_COMPONENTS,
  type KarriereRole,
} from 'src/components/molecules/karriere';
import { KarriereDetailPage } from '../shared/karriere-detail-page';
import { KarriereJobConfig } from '../shared/karriere-seo';
import { karriereFaqEntries, zeitStat } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/physiotherapeut-nuernberg';

/**
 * Stellenseite für selbständige Physiotherapeut:innen.
 *
 * Aufbau und Deal sind identisch mit der Masseur:innen-Seite — derselbe Raum,
 * dasselbe Zeitfenster, dieselbe Aufteilung; nur die Ausbildung ist eine
 * andere. Sie ist deshalb `role: 'massage'`.
 *
 * Der Kern dieser Seite ist eine Abgrenzung: FareWell ist ein Kosmetikstudio
 * ohne Kassenzulassung. Heilmittel wie Krankengymnastik oder Manuelle
 * Therapie lassen sich hier nicht auf Rezept abrechnen; was läuft, ist
 * Massage und Körperarbeit auf Privat- und Selbstzahlerbasis. Das steht
 * bewusst mehrfach da, statt es dem Erstgespräch zu überlassen: Wer eine
 * Praxis mit Rezeptbetrieb sucht, soll das vor der Bewerbung wissen.
 *
 * Sollte FareWell je eine Zulassung bekommen, hängt die Aussage an SECHS
 * Stellen und alle gehören zusammen geändert — die letzten drei gehen an
 * Google for Jobs und fallen sonst niemandem auf:
 *   1. Hero-Lead und 2. Hinweiskasten „Privat, nicht auf Rezept" unter
 *      „Deine Aufgaben" (physio-karriere.component.html)
 *   3. die ersten beiden FAQ-Einträge (unten in buildConfig)
 *   4. `intro` und 5. `qualifications` (JobPosting)
 *   6. description in dieser Datei UND die Kopie in app-routing.module.ts
 * Dieselbe Aussage steht in kürzerer Form auf der Seite für blinde
 * Bewerber:innen („Krankengymnastik und Behandlungen auf Verordnung gehören
 * nicht dazu"); sie gehört dann ebenfalls angefasst.
 */
@Component({
  standalone: true,
  selector: 'app-physio-karriere',
  imports: [
    ...GUIDE_COMPONENTS,
    ...KARRIERE_COMPONENTS,
    RevealOnScrollDirective,
    RouterLink,
  ],
  templateUrl: './physio-karriere.component.html',
})
export class PhysioKarriereComponent extends KarriereDetailPage {
  protected readonly jsonLdId = 'physio-jobposting-schema';
  override readonly role: KarriereRole = 'massage';
  protected override readonly ogImage =
    'assets/images/massages/tm massaging.jpg';

  /** Wie bei den Masseur:innen: der Massageraum hängt nicht an der Kosmetik. */
  protected override get hoursStat(): GuideStat {
    return zeitStat((de, en) => this.t(de, en), '08–22', 'Mo–Sa', 'Mon–Sat');
  }

  protected buildConfig(): KarriereJobConfig {
    const t = (de: string, en: string) => this.t(de, en);

    return {
      path: PAGE_PATH,
      title: t(
        'Physiotherapeut:in (m/w/d) in Nürnberg: freiberuflich auf Privatbasis | Karriere bei FareWell',
        'Physiotherapist (m/f/d) in Nuremberg: Freelance, Private Practice | Careers at FareWell',
      ),
      description: t(
        'FareWell Nürnberg sucht Physiotherapeut:innen zur freiberuflichen Zusammenarbeit auf Privatbasis: Massage und Körperarbeit ohne Kassenrezepte, moderner Salon im Zentrum, flexible Zeiten und ein eigener Kundenstamm.',
        'FareWell Nuremberg is looking for freelance physiotherapists working privately: massage and bodywork without health-insurance prescriptions, a modern central salon, flexible hours and your own client base.',
      ),
      jobTitle: t(
        'Physiotherapeut / Physiotherapeutin (m/w/d): freiberufliche Zusammenarbeit auf Privatbasis',
        'Physiotherapist (m/f/d): freelance collaboration, private practice',
      ),
      datePosted: '2026-08-31',
      occupationalCategory: t(
        'Physiotherapie, Massage und Wellness',
        'Physiotherapy, massage and wellness',
      ),
      industry: t('Beauty und Wellness', 'Beauty and wellness'),
      breadcrumbName: t(
        'Karriere: Physiotherapeut:in',
        'Careers: physiotherapist',
      ),
      qualifications: t(
        'Staatliche Anerkennung als Physiotherapeut:in oder eine vergleichbare Qualifikation, eine eigene Berufshaftpflicht und ein angemeldetes Gewerbe. Eine Kassenzulassung brauchst du nicht: Bei uns wird ausschließlich privat abgerechnet.',
        'State recognition as a physiotherapist or a comparable qualification, your own professional liability insurance and a registered trade. You do not need a health-insurance licence: everything here is billed privately.',
      ),
      intro: t(
        'Für unseren Salon FareWell im Zentrum von Nürnberg suchen wir eine Physiotherapeutin oder einen Physiotherapeuten zur freiberuflichen Zusammenarbeit auf Privatbasis: Massage und Körperarbeit für Selbstzahler:innen, ohne Rezepte und ohne Kassenabrechnung.',
        'For our salon FareWell in the centre of Nuremberg we are looking for a physiotherapist for a freelance collaboration on a private basis: massage and bodywork for self-paying clients, without prescriptions and without health-insurance billing.',
      ),
      applySubject: t(
        'Bewerbung als Physiotherapeut:in bei FareWell',
        'Application as a physiotherapist at FareWell',
      ),
      // Identisch mit der Masseur:innen-Seite: derselbe Raum, dasselbe Fenster.
      workHours: t(
        'Behandlungen Mo–Sa 08:00–22:00 Uhr, unabhängig von den Öffnungszeiten der Kosmetik. Deine festen wöchentlichen Zeitfenster legen wir gemeinsam fest; keine Anwesenheitspflicht ohne gebuchte Termine.',
        'Treatments Mon–Sat 08:00–22:00, independent of the cosmetics opening hours. We agree your fixed weekly slots together; no obligation to be present without booked appointments.',
      ),
      responsibilities: [
        t(
          'Massagen und körperbezogene Behandlungen auf Privat- und Selbstzahlerbasis',
          'Massages and body-focused treatments for private, self-paying clients',
        ),
        t(
          'Eigenständige Betreuung deiner Kund:innen',
          'Independent care of your clients',
        ),
        t(
          'Aufbau und Pflege eines eigenen Kundenstamms mit Unterstützung des Salons',
          'Building and nurturing your own client base with the support of the salon',
        ),
        t(
          'Freie Wahl deiner Behandlungen im Rahmen dessen, was privat abrechenbar ist',
          'Free choice of your treatments within what can be billed privately',
        ),
        t(
          'Einhaltung von Hygiene- und Qualitätsstandards',
          'Adherence to hygiene and quality standards',
        ),
      ],
      profile: [
        t(
          'Staatliche Anerkennung als Physiotherapeut:in oder eine vergleichbare Qualifikation',
          'State recognition as a physiotherapist or a comparable qualification',
        ),
        t(
          'Gültige Zertifizierungen und fachliche Nachweise',
          'Valid certifications and professional credentials',
        ),
        t(
          'Lust auf Arbeit ohne Rezept, Taktung und Kassenbürokratie',
          'An appetite for work without prescriptions, clock-watching and insurance paperwork',
        ),
        t(
          'Selbständige und strukturierte Arbeitsweise',
          'An independent and structured way of working',
        ),
        t(
          'Eigene Berufshaftpflicht und ein angemeldetes Gewerbe',
          'Your own professional liability insurance and a registered trade',
        ),
        t(
          'Professioneller Umgang mit Kund:innen',
          'A professional approach with clients',
        ),
      ],
      faq: karriereFaqEntries(t, {
        extra: [
          {
            question: t(
              'Kann ich bei euch auf Rezept behandeln?',
              'Can I treat on prescription here?',
            ),
            answer: t(
              'Nein. FareWell ist ein Kosmetikstudio ohne Kassenzulassung, und die haben auch die Räume nicht. Krankengymnastik, Manuelle Therapie und alles andere, was auf Verordnung läuft, kannst du bei uns nicht abrechnen. Was hier läuft, ist Massage und Körperarbeit für Selbstzahler:innen. Wenn du eine Praxis mit Rezeptbetrieb suchst, sind wir ehrlich gesagt die falsche Adresse, und das sagen wir dir lieber jetzt als im Erstgespräch.',
              'No. FareWell is a beauty studio without a health-insurance licence, and the rooms do not have one either. Remedial exercise therapy, manual therapy and anything else that runs on prescription cannot be billed here. What happens here is massage and bodywork for self-paying clients. If you are looking for a practice with prescription work, we are honestly the wrong address, and we would rather tell you now than at the first conversation.',
            ),
          },
          {
            question: t(
              'Warum sucht ihr dann überhaupt Physiotherapeut:innen?',
              'Then why are you looking for physiotherapists at all?',
            ),
            answer: t(
              'Weil dein Befund und deine Hände auch ohne Rezept etwas können, was viele Kund:innen suchen: verstehen, was am Rücken oder an der Schulter los ist, und entsprechend behandeln. Du entscheidest selbst, wie deine Behandlungen heißen und was sie kosten. Was du nicht mitbringen musst, ist eine Zulassung.',
              'Because your assessment and your hands are worth something without a prescription too, and it is what many clients are looking for: understanding what is going on in a back or a shoulder and treating it accordingly. You decide what your treatments are called and what they cost. What you do not need to bring is a licence.',
            ),
          },
          {
            question: t(
              'Was ist der Unterschied zur Stelle für Masseur:innen?',
              'What is the difference from the massage therapist role?',
            ),
            answer: t(
              'Nur die Ausbildung. Raum, Zeiten, Aufteilung und Ablauf sind identisch, ihr teilt euch denselben Behandlungsraum. Wenn du beides bist oder dir nicht sicher bist, welche Seite auf dich passt: Es ist dieselbe Zusammenarbeit, bewirb dich einfach auf einer von beiden.',
              'Only the training. Room, hours, split and process are identical, and you share the same treatment room. If you are both, or unsure which page fits you: it is the same collaboration, so apply through either one.',
            ),
            linkPath: '/karriere/masseur-nuernberg',
            linkLabel: t(
              'Zur Stellenseite für Masseur:innen',
              'To the page for massage therapists',
            ),
          },
          {
            question: t(
              'Wo finde ich die konkreten Zahlen zur Abrechnung?',
              'Where do I find the concrete numbers on settlement?',
            ),
            answer: t(
              'Im Onboarding-Leitfaden für Masseur:innen. Er gilt genauso für dich: dieselbe Aufteilung mit Rechenbeispiel, dieselben drei Wege zu neuen Kund:innen, derselbe geteilte Raum, auf Deutsch und auf Englisch.',
              'In the onboarding guide for massage therapists. It applies to you in exactly the same way: the same split with a worked example, the same three ways to win new clients, the same shared room, in German and in English.',
            ),
            linkPath: '/karriere/masseur-nuernberg/onboarding',
            linkLabel: t('Zum Onboarding-Leitfaden', 'To the onboarding guide'),
          },
          {
            question: t(
              'Muss ich Öl und Material selbst mitbringen?',
              'Do I have to bring my own oil and supplies?',
            ),
            answer: t(
              'Aromaöle stellen wir. Deine Verbrauchsmaterialien und dein Massageöl bringst du mit; weil sich mehrere den Raum teilen, klärt ihr untereinander, ob ihr eine Flasche teilt oder jede und jeder die eigene mitbringt. Die Wäsche ist geregelt, du stellst am Ende deiner Schicht nur die Maschine an.',
              'We provide the aroma oils. You bring your own consumables and your massage oil; since several of you share the room, you sort out among yourselves whether to share a bottle or each bring your own. Laundry is taken care of, you just start the machine at the end of your shift.',
            ),
          },
        ],
      }),
    };
  }
}
