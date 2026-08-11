import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GUIDE_COMPONENTS, type GuideStat } from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS, type KarriereRole } from 'src/components/molecules/karriere';
import { KarriereDetailPage } from '../shared/karriere-detail-page';
import { KarriereJobConfig } from '../shared/karriere-seo';
import { karriereFaqEntries, kursPlattformFaq, kursZeitStat } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/yoga-nuernberg';

/**
 * Stellenseite für selbständige Yoga-Lehrer:innen. Yoga gibt es bei FareWell
 * noch nicht — die Seite sucht bewusst jemanden, der es von Grund auf aufbaut.
 *
 * Anders als bei den Behandlungsberufen sind die Zeiten hier nicht frei: Der
 * Raum wird tagsüber für Behandlungen gebraucht, Stunden liegen deshalb früh
 * morgens, abends und am Wochenende. Das Raster und die Regeln dazu stehen in
 * <app-karriere-zeiten> (karriere-zeiten.model.ts).
 */
@Component({
  standalone: true,
  selector: 'app-yoga-karriere',
  imports: [...GUIDE_COMPONENTS, ...KARRIERE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './yoga-karriere.component.html',
})
export class YogaKarriereComponent extends KarriereDetailPage {
  protected readonly jsonLdId = 'yoga-karriere-schema';
  override readonly role: KarriereRole = 'kurs';
  // Kein eigenes ogImage: das Standardbild ist bereits der Empfang im Studio,
  // und ohne Override setzt der SeoService auch Format und Maße mit.

  /** Statt „flexibel“: das feste Zeitfenster für Kurse. */
  protected override get hoursStat(): GuideStat {
    return kursZeitStat((de, en) => this.t(de, en));
  }

  protected buildConfig(): KarriereJobConfig {
    const t = (de: string, en: string) => this.t(de, en);

    return {
      path: PAGE_PATH,
      title: t(
        'Yoga-Lehrer:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
        'Yoga Teacher (m/f/d) in Nuremberg: Freelance | Careers at FareWell'
      ),
      description: t(
        'FareWell Nürnberg sucht selbständige Yoga-Lehrer:innen, die ein eigenes Kursangebot aufbauen wollen: ruhiger Raum im Zentrum, Online-Buchung, flexible Zeiten, keine feste Miete und Hilfe beim eigenen Google-Business-Profil.',
        'FareWell Nuremberg is looking for freelance yoga teachers who want to build their own class offering: a quiet room in the city centre, online booking, flexible hours, no fixed rent and help setting up your own Google Business profile.'
      ),
      jobTitle: t(
        'Yoga-Lehrer:in (m/w/d): freiberufliche Zusammenarbeit',
        'Yoga teacher (m/f/d): freelance collaboration'
      ),
      datePosted: '2026-08-07',
      occupationalCategory: t('Yoga und Bewegung', 'Yoga and movement'),
      industry: t('Gesundheit und Wellness', 'Health and wellness'),
      breadcrumbName: t('Karriere: Yoga-Lehrer:in', 'Careers: yoga teacher'),
      qualifications: t(
        'Eine anerkannte Yoga-Ausbildung (zum Beispiel 200 Stunden oder mehr), Erfahrung im Unterrichten von Gruppen oder Einzelstunden, eine eigene Berufshaftpflicht und eine angemeldete selbständige Tätigkeit.',
        'A recognised yoga teacher training (for example 200 hours or more), experience teaching groups or one-to-one sessions, your own professional liability insurance and a registered freelance activity.'
      ),
      intro: t(
        'Yoga gibt es bei FareWell im Zentrum von Nürnberg noch nicht. Genau deshalb suchen wir eine selbständige Yoga-Lehrerin oder einen selbständigen Yoga-Lehrer, die oder der dieses Angebot bei uns von Grund auf aufbaut.',
        'Yoga does not yet exist at FareWell in the centre of Nuremberg. That is exactly why we are looking for a freelance yoga teacher to build this offering with us from the ground up.'
      ),
      applySubject: t(
        'Bewerbung als Yoga-Lehrer:in bei FareWell',
        'Application as a yoga teacher at FareWell'
      ),
      workHours: t(
        'Kurse außerhalb des Behandlungsbetriebs: Mo–Fr 07:00–09:00 Uhr und ab 19:30 Uhr, Sa ab 18:00 Uhr, So jederzeit. Innerhalb dieser Fenster legst du deine Zeiten selbst fest.',
        'Classes outside treatment hours: Mon–Fri 07:00–09:00 and from 19:30, Sat from 18:00, Sun any time. Within these windows you set your own times.'
      ),
      responsibilities: [
        t(
          'Yoga-Stunden in deinem Stil: offene Stunden, feste Kursreihen oder Einzelunterricht',
          'Yoga classes in your own style: drop-in classes, fixed course series or one-to-one sessions'
        ),
        t(
          'Eigenständige Betreuung deiner Teilnehmenden, vom ersten Mal bis zur Routine',
          'Looking after your participants independently, from their first time to a steady routine'
        ),
        t(
          'Ein eigenes Kursformat entwickeln, das zu einem ruhigen Raum im Studio passt',
          'Developing your own class format that suits a quiet room inside the studio'
        ),
        t(
          'Aufbau und Pflege eines eigenen Teilnehmerkreises mit Unterstützung des Studios',
          'Building and nurturing your own circle of participants with the support of the studio'
        ),
        t(
          'Den Raum so hinterlassen, dass die nächste Person sofort loslegen kann',
          'Leaving the room so the next person can start right away'
        ),
      ],
      profile: [
        t(
          'Eine anerkannte Yoga-Ausbildung, zum Beispiel 200 Stunden oder mehr',
          'A recognised yoga teacher training, for example 200 hours or more'
        ),
        t(
          'Erfahrung im Unterrichten, ob in der Gruppe oder in Einzelstunden',
          'Teaching experience, whether in groups or one-to-one'
        ),
        t(
          'Ein eigener Stil und eine klare Idee, was du hier aufbauen willst',
          'A style of your own and a clear idea of what you want to build here'
        ),
        t(
          'Eigene Berufshaftpflicht und eine angemeldete selbständige Tätigkeit',
          'Your own professional liability insurance and a registered freelance activity'
        ),
        t(
          'Achtsamer Umgang mit Menschen, die zum ersten Mal auf einer Matte stehen',
          'A mindful way with people standing on a mat for the first time'
        ),
        t(
          'Verlässlichkeit bei zugesagten Zeiten',
          'Reliability when it comes to agreed times'
        ),
      ],
      faq: karriereFaqEntries(t, {
        extra: [
          {
            question: t(
              'Wo finden die Stunden statt, und wie viele Teilnehmende passen hinein?',
              'Where do the classes take place, and how many participants fit in?'
            ),
            answer: t(
              'Wir haben einen ruhigen Raum im Studio, ausgelegt für kleine Gruppen und Einzelstunden, keinen großen Kursraum. Wie viele Matten realistisch hineinpassen, schauen wir uns beim Probetag gemeinsam an, damit du dein Format danach planen kannst.',
              'We have a quiet room inside the studio, suited to small groups and one-to-one sessions rather than a large class hall. How many mats realistically fit is something we look at together on the trial day, so you can plan your format around it.'
            ),
          },
          kursPlattformFaq(t),
          {
            question: t(
              'Kann ich Kurse und Einzelstunden mischen?',
              'Can I mix courses and one-to-one sessions?'
            ),
            answer: t(
              'Ja. Ob feste Kursreihe, offene Stunden oder Einzelsessions: Das Format entwickelst du. Wir bilden es im Buchungssystem Salonkee ab, damit deine Teilnehmenden online buchen können.',
              'Yes. Whether a fixed course series, drop-in classes or one-to-one sessions: you develop the format. We map it into the Salonkee booking system so your participants can book online.'
            ),
          },
          {
            question: t(
              'Muss ich Matten und Material selbst stellen?',
              'Do I have to provide mats and equipment myself?'
            ),
            answer: t(
              'Am Anfang ja: Matten und Kleinmaterial bringst du mit. Sobald dein Angebot läuft und feste Zeiten hat, sprechen wir darüber, was sich sinnvoll fest im Raum lagern lässt.',
              'At the start, yes: you bring mats and small equipment. As soon as your offering is running with fixed times, we talk about what makes sense to store permanently in the room.'
            ),
          },
        ],
      }),
    };
  }
}
