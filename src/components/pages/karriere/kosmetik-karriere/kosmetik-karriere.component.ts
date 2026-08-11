import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GUIDE_COMPONENTS, type GuideStat } from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS, type KarriereRole } from 'src/components/molecules/karriere';
import { KarriereDetailPage } from '../shared/karriere-detail-page';
import { KarriereJobConfig } from '../shared/karriere-seo';
import { karriereFaqEntries, zeitStat } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/kosmetik-nuernberg';

/**
 * Stellenseite für selbständige Kosmetiker:innen. Aufbau, Ton und Konditionen
 * wie auf allen Karriere-Detailseiten; der Deal, der FAQ-Sockel und die
 * Bewerbungskarte kommen aus dem geteilten Karriere-Baukasten.
 */
@Component({
  standalone: true,
  selector: 'app-kosmetik-karriere',
  imports: [...GUIDE_COMPONENTS, ...KARRIERE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './kosmetik-karriere.component.html',
})
export class KosmetikKarriereComponent extends KarriereDetailPage {
  protected readonly jsonLdId = 'kosmetik-karriere-schema';
  override readonly role: KarriereRole = 'kosmetik';
  // Eigene 1200x630-JPEG-Fassung: das Original ist WebP im Hochformat und
  // taugt als Vorschaubild weder vom Format noch vom Zuschnitt her.
  protected override readonly ogImage = 'assets/images/treatment/og-kosmetik.jpg';

  protected override get hoursStat(): GuideStat {
    return zeitStat((de, en) => this.t(de, en), '10–20', 'Mo–Fr · Sa 08–17', 'Mon–Fri · Sat 08–17');
  }

  protected buildConfig(): KarriereJobConfig {
    const t = (de: string, en: string) => this.t(de, en);

    return {
      path: PAGE_PATH,
      title: t(
        'Kosmetiker:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
        'Beautician (m/f/d) in Nuremberg: Freelance | Careers at FareWell'
      ),
      description: t(
        'FareWell Nürnberg sucht selbständige Kosmetiker:innen mit eigenem Konzept: voll ausgestatteter Raum im Zentrum, Online-Buchung, flexible Zeiten, keine feste Miete und Hilfe beim eigenen Google-Business-Profil.',
        'FareWell Nuremberg is looking for freelance beauticians with a concept of their own: a fully equipped room in the city centre, online booking, flexible hours, no fixed rent and help setting up your own Google Business profile.'
      ),
      jobTitle: t(
        'Kosmetiker:in (m/w/d): freiberufliche Zusammenarbeit',
        'Beautician (m/f/d): freelance collaboration'
      ),
      datePosted: '2026-08-07',
      occupationalCategory: t('Kosmetik und Ästhetik', 'Cosmetics and aesthetics'),
      industry: t('Beauty und Wellness', 'Beauty and wellness'),
      breadcrumbName: t('Karriere: Kosmetiker:in', 'Careers: beautician'),
      qualifications: t(
        'Abgeschlossene Ausbildung als Kosmetiker:in oder eine vergleichbare Qualifikation, gültige Zertifikate für die angebotenen Behandlungen, bei apparativen Verfahren die Fachkunde nach NiSV, eine eigene Berufshaftpflicht und ein angemeldetes Gewerbe.',
        'Completed training as a beautician or a comparable qualification, valid certificates for the treatments offered, the NiSV competence certificate for device-based procedures, your own professional liability insurance and a registered trade.'
      ),
      intro: t(
        'Für unser Kosmetikstudio FareWell im Zentrum von Nürnberg suchen wir selbständige Kosmetiker:innen mit einem eigenen Schwerpunkt, die bei uns ihr eigenes Konzept aufbauen wollen.',
        'For our beauty studio FareWell in the centre of Nuremberg we are looking for freelance beauticians with a focus of their own, who want to build their own concept with us.'
      ),
      applySubject: t(
        'Bewerbung als Kosmetiker:in bei FareWell',
        'Application as a beautician at FareWell'
      ),
      workHours: t(
        'Behandlungsbetrieb Mo–Fr 10:00–20:00 Uhr, Sa 08:00–17:00 Uhr. Innerhalb dieser Zeiten legst du deine festen Tage selbst fest; keine Anwesenheitspflicht ohne gebuchte Termine.',
        'Treatment hours Mon–Fri 10:00–20:00, Sat 08:00–17:00. Within those hours you set your own fixed days; no obligation to be present without booked appointments.'
      ),
      responsibilities: [
        t(
          'Kosmetische Behandlungen in deinem Schwerpunkt, von der klassischen Gesichtsbehandlung bis zu deinen Spezialitäten',
          'Cosmetic treatments in your area of focus, from classic facials to your own specialities'
        ),
        t(
          'Eigenständige Beratung und Betreuung deiner Kund:innen',
          'Independent consultation and care for your clients'
        ),
        t(
          'Aufbau und Pflege eines eigenen Kundenstamms mit Unterstützung des Salons',
          'Building and nurturing your own client base with the support of the salon'
        ),
        t(
          'Ein eigenes Angebot entwickeln, das das bestehende Behandlungsspektrum ergänzt',
          'Developing your own offering that complements the existing range of treatments'
        ),
        t(
          'Einhaltung der Hygiene- und Qualitätsstandards des Studios',
          'Keeping to the studio’s hygiene and quality standards'
        ),
      ],
      profile: [
        t(
          'Abgeschlossene Ausbildung als Kosmetiker:in oder eine vergleichbare Qualifikation',
          'Completed training as a beautician or a comparable qualification'
        ),
        t(
          'Gültige Zertifikate und fachliche Nachweise für die Behandlungen, die du anbietest',
          'Valid certificates and professional credentials for the treatments you offer'
        ),
        t(
          'Bei apparativen Behandlungen: die Fachkunde nach NiSV, soweit dein Angebot sie verlangt',
          'For device-based treatments: the NiSV competence certificate, where your offering requires it'
        ),
        t(
          'Ein eigener Schwerpunkt, mit dem du dich von anderen unterscheidest',
          'A focus of your own that sets you apart'
        ),
        t(
          'Selbständige, strukturierte Arbeitsweise und Zuverlässigkeit',
          'An independent, structured way of working and reliability'
        ),
        t(
          'Freude an ehrlicher Beratung statt Verkaufsdruck',
          'A genuine liking for honest advice rather than sales pressure'
        ),
      ],
      faq: karriereFaqEntries(t, {
        extra: [
          {
            question: t(
              'Kann ich eigene Geräte und Produkte mitbringen?',
              'Can I bring my own devices and products?'
            ),
            answer: t(
              'Ja. Pflegeprodukte und Verbrauchsmaterial für deine eigenen Behandlungen bringst du selbst mit. Wenn du mit eigenen Geräten arbeiten willst, sprechen wir vorher über Platz, Strom und Lagerung. Die vorhandene Ausstattung des Studios darfst du im Rahmen deiner Qualifikation und der gesetzlichen Vorgaben mitnutzen.',
              'Yes. You bring your own care products and consumables for your own treatments. If you want to work with your own devices, we talk about space, power and storage beforehand. You may also use the studio’s existing equipment, within the limits of your qualification and the legal requirements.'
            ),
          },
          {
            question: t(
              'Mache ich dem bestehenden FareWell-Angebot Konkurrenz?',
              'Would I be competing with FareWell’s existing services?'
            ),
            answer: t(
              'Nein, und das ist uns wichtig. Bei uns behandelt immer nur eine Kosmetikerin zur gleichen Zeit, der Raum ist auf eine Person ausgelegt. Deine festen Zeitfenster und dein Schwerpunkt werden deshalb im Erstgespräch so abgestimmt, dass sie das bestehende Angebot ergänzen statt es zu doppeln.',
              'No, and that matters to us. Only one beautician ever treats at a time here; the room is set up for one person. So we align your fixed time slots and your focus at the first meeting, in a way that complements the existing offering rather than duplicating it.'
            ),
          },
          {
            question: t(
              'Brauche ich die Fachkunde nach NiSV?',
              'Do I need the NiSV competence certificate?'
            ),
            answer: t(
              'Das hängt davon ab, was du anbietest. Für Behandlungen mit Laser, IPL, Hochfrequenz oder vergleichbaren Geräten verlangt die NiSV, die Verordnung zum Schutz vor nichtionisierender Strahlung, einen Fachkundenachweis. Für klassische Kosmetik ohne solche Geräte brauchst du ihn nicht. Was für dein Konzept gilt, schauen wir uns im Erstgespräch gemeinsam an.',
              'That depends on what you offer. For treatments using lasers, IPL, high frequency or comparable devices, the German NiSV regulation on protection against non-ionising radiation requires a competence certificate. For classic cosmetics without such devices you do not need one. We look at what applies to your concept together at the first meeting.'
            ),
          },
        ],
      }),
    };
  }
}
