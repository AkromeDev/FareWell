import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GUIDE_COMPONENTS, type GuideStat } from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS, type KarriereRole } from 'src/components/molecules/karriere';
import { KarriereDetailPage } from '../shared/karriere-detail-page';
import { KarriereJobConfig } from '../shared/karriere-seo';
import { karriereFaqEntries, kursPlattformFaq, kursZeitStat } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/tanzlehrer-nuernberg';

/**
 * Stellenseite für selbständige Tanzlehrer:innen. Der Studioraum ist flexibel,
 * aber kein Tanzsaal — das steht bewusst offen in der FAQ, damit niemand mit
 * falschen Erwartungen anreist. Ebenso offen: Der Raum wird tagsüber für
 * Behandlungen gebraucht, Unterricht liegt deshalb früh morgens, abends und am
 * Wochenende. Das Raster und die Regeln dazu stehen in <app-karriere-zeiten>
 * (karriere-zeiten.model.ts).
 */
@Component({
  standalone: true,
  selector: 'app-tanz-karriere',
  imports: [...GUIDE_COMPONENTS, ...KARRIERE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './tanz-karriere.component.html',
})
export class TanzKarriereComponent extends KarriereDetailPage {
  protected readonly jsonLdId = 'tanz-karriere-schema';
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
        'Tanzlehrer:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
        'Dance Teacher (m/f/d) in Nuremberg: Freelance | Careers at FareWell'
      ),
      description: t(
        'FareWell Nürnberg sucht selbständige Tanzlehrer:innen mit eigenem Konzept: flexibler Raum im Zentrum für Einzelunterricht, Paare und kleine Gruppen, Online-Buchung, flexible Zeiten und keine feste Miete.',
        'FareWell Nuremberg is looking for freelance dance teachers with a concept of their own: a flexible room in the city centre for one-to-one lessons, couples and small groups, online booking, flexible hours and no fixed rent.'
      ),
      jobTitle: t(
        'Tanzlehrer:in (m/w/d): freiberufliche Zusammenarbeit',
        'Dance teacher (m/f/d): freelance collaboration'
      ),
      datePosted: '2026-08-07',
      occupationalCategory: t('Tanz und Bewegung', 'Dance and movement'),
      industry: t('Bildung und Bewegung', 'Education and movement'),
      breadcrumbName: t('Karriere: Tanzlehrer:in', 'Careers: dance teacher'),
      qualifications: t(
        'Eine tänzerische Ausbildung oder nachweisbare Bühnen- und Unterrichtserfahrung, Erfahrung im Unterrichten von Einzelpersonen, Paaren oder kleinen Gruppen, eine eigene Berufshaftpflicht und eine angemeldete selbständige Tätigkeit.',
        'Dance training or demonstrable stage and teaching experience, experience teaching individuals, couples or small groups, your own professional liability insurance and a registered freelance activity.'
      ),
      intro: t(
        'Für unser Studio FareWell im Zentrum von Nürnberg suchen wir eine selbständige Tanzlehrerin oder einen selbständigen Tanzlehrer, die oder der bei uns ein eigenes Unterrichtsangebot aufbauen möchte.',
        'For our studio FareWell in the centre of Nuremberg we are looking for a freelance dance teacher who wants to build their own teaching offering with us.'
      ),
      applySubject: t(
        'Bewerbung als Tanzlehrer:in bei FareWell',
        'Application as a dance teacher at FareWell'
      ),
      workHours: t(
        'Unterricht außerhalb des Behandlungsbetriebs: Mo–Fr 07:00–09:00 Uhr und ab 19:30 Uhr, Sa ab 18:00 Uhr, So jederzeit. Innerhalb dieser Fenster legst du deine Zeiten selbst fest.',
        'Lessons outside treatment hours: Mon–Fri 07:00–09:00 and from 19:30, Sat from 18:00, Sun any time. Within these windows you set your own times.'
      ),
      responsibilities: [
        t(
          'Tanzunterricht in deinem Stil: Einzelstunden, Paare oder kleine Gruppen',
          'Dance lessons in your own style: one-to-one, couples or small groups'
        ),
        t(
          'Ein eigenes Unterrichtsformat entwickeln, das in einen flexiblen Studioraum passt',
          'Developing your own teaching format that fits a flexible studio room'
        ),
        t(
          'Eigenständige Betreuung deiner Schüler:innen',
          'Looking after your students independently'
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
          'Eine tänzerische Ausbildung oder nachweisbare Bühnen- und Unterrichtserfahrung',
          'Dance training or demonstrable stage and teaching experience'
        ),
        t(
          'Erfahrung im Unterrichten von Einzelpersonen, Paaren oder kleinen Gruppen',
          'Experience teaching individuals, couples or small groups'
        ),
        t(
          'Ein eigener Stil und ein Konzept, das du aufbauen willst',
          'A style of your own and a concept you want to build'
        ),
        t(
          'Eigene Berufshaftpflicht und eine angemeldete selbständige Tätigkeit',
          'Your own professional liability insurance and a registered freelance activity'
        ),
        t(
          'Geduld mit Anfänger:innen und ein Gespür für Gruppen',
          'Patience with beginners and a feel for groups'
        ),
        t(
          'Verlässlichkeit bei zugesagten Zeiten',
          'Reliability when it comes to agreed times'
        ),
      ],
      faq: karriereFaqEntries(t, {
        extra: [
          {
            question: t('Habt ihr einen richtigen Tanzsaal?', 'Do you have a proper dance hall?'),
            answer: t(
              'Ehrlich gesagt: nein. Wir haben keinen Saal mit Spiegelwand und Schwingboden, sondern einen flexiblen Raum im Studio. Für Einzelunterricht, Paare und kleine Gruppen funktioniert er gut, für große Kurse nicht. Beim Probetag schaust du dir an, ob dein Format hineinpasst, bevor irgendjemand etwas zusagt.',
              'Honestly: no. We do not have a hall with a mirrored wall and a sprung floor, but a flexible room inside the studio. It works well for one-to-one lessons, couples and small groups, but not for large classes. On the trial day you see for yourself whether your format fits, before anyone commits to anything.'
            ),
          },
          kursPlattformFaq(t),
          {
            question: t('Welche Stile sucht ihr?', 'Which styles are you looking for?'),
            answer: t(
              'Offen. Ob Contemporary, Ballett-Basics, Standard und Latein, Hip-Hop oder freie Bewegungsarbeit: Uns interessiert dein Konzept, nicht ein bestimmtes Genre. Erzähl uns lieber, für wen dein Unterricht gedacht ist.',
              'Open. Whether contemporary, ballet basics, ballroom and Latin, hip-hop or free movement work: we care about your concept, not a particular genre. Tell us instead who your teaching is meant for.'
            ),
          },
          {
            question: t(
              'Wie ist das mit Musik und Technik?',
              'What about music and equipment?'
            ),
            answer: t(
              'Die Musikanlage klären wir im Erstgespräch. Bring gern mit, womit du gewohnt bist zu arbeiten; anschließend schauen wir, was sich sinnvoll fest im Raum installieren lässt.',
              'We sort out the sound system at the first meeting. Feel free to bring what you are used to working with; afterwards we look at what makes sense to install permanently in the room.'
            ),
          },
        ],
      }),
    };
  }
}
