import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GUIDE_COMPONENTS, type GuideStat } from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS, type KarriereRole } from 'src/components/molecules/karriere';
import { KarriereDetailPage } from '../shared/karriere-detail-page';
import { KarriereJobConfig } from '../shared/karriere-seo';
import { karriereFaqEntries, zeitStat } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/botox-nuernberg';

/**
 * Stellenseite für ästhetische Medizin (Botulinumtoxin). Einziger Beruf mit
 * harter Zugangsvoraussetzung: Botulinumtoxin ist verschreibungspflichtig und
 * die Injektion approbierten Ärzt:innen vorbehalten. Die Tätigkeit fügt sich
 * in das bestehende Delegationsmodell ein, das auch die Preisseite beschreibt.
 */
@Component({
  standalone: true,
  selector: 'app-botox-karriere',
  imports: [...GUIDE_COMPONENTS, ...KARRIERE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './botox-karriere.component.html',
})
export class BotoxKarriereComponent extends KarriereDetailPage {
  protected readonly jsonLdId = 'botox-karriere-schema';
  override readonly role: KarriereRole = 'botox';
  // Eigene 1200x630-JPEG-Fassung des Behandlungsfotos: WebP zeigen mehrere
  // Messenger im Link-Vorschaubild nicht an.
  protected override readonly ogImage = 'assets/images/treatment/og-aesthetische-medizin.jpg';

  protected override get hoursStat(): GuideStat {
    return zeitStat((de, en) => this.t(de, en), '10–20', 'Mo–Fr · Sa 08–17', 'Mon–Fri · Sat 08–17');
  }

  /** Statt „selbständig“: die Voraussetzung, die diese Stelle definiert. */
  protected override get lastStat(): GuideStat {
    return {
      value: this.t('Approbation', 'Medical licence'),
      label: this.t('Voraussetzung', 'Requirement'),
    };
  }

  protected buildConfig(): KarriereJobConfig {
    const t = (de: string, en: string) => this.t(de, en);

    return {
      path: PAGE_PATH,
      title: t(
        'Ärztin / Arzt (m/w/d) für Botox & ästhetische Medizin in Nürnberg | Karriere bei FareWell',
        'Physician (m/f/d) for Botox & Aesthetic Medicine in Nuremberg | Careers at FareWell'
      ),
      description: t(
        'FareWell Nürnberg sucht approbierte Ärzt:innen mit Injektionserfahrung für ein eigenes Angebot mit Botulinumtoxin: Raum im Zentrum, Online-Buchung, flexible Zeiten, keine feste Miete, eingebettet in unser bestehendes Delegationsmodell.',
        'FareWell Nuremberg is looking for licensed physicians with injection experience to build their own botulinum toxin offering: a room in the city centre, online booking, flexible hours, no fixed rent, embedded in our existing medical delegation model.'
      ),
      jobTitle: t(
        'Ärztin / Arzt (m/w/d) für ästhetische Medizin: Botulinumtoxin, freiberuflich',
        'Physician (m/f/d) for aesthetic medicine: botulinum toxin, freelance'
      ),
      datePosted: '2026-08-07',
      occupationalCategory: t('Ästhetische Medizin', 'Aesthetic medicine'),
      industry: t('Ästhetische Medizin', 'Aesthetic medicine'),
      breadcrumbName: t('Karriere: Ästhetische Medizin', 'Careers: aesthetic medicine'),
      qualifications: t(
        'Deutsche Approbation als Ärztin oder Arzt, nachweisbare Erfahrung mit ästhetischen Injektionen (insbesondere Botulinumtoxin), sicherer Umgang mit Aufklärung, Dokumentation und Notfallmanagement sowie eine eigene Berufshaftpflicht für die ärztliche Tätigkeit.',
        'A German medical licence (Approbation), demonstrable experience with aesthetic injections (in particular botulinum toxin), confident handling of informed consent, documentation and emergency management, and your own professional liability insurance for medical practice.'
      ),
      intro: t(
        'Für unser Kosmetikstudio FareWell im Zentrum von Nürnberg suchen wir eine approbierte Ärztin oder einen approbierten Arzt mit Erfahrung in ästhetischen Injektionen, die oder der bei uns ein eigenes Angebot mit Botulinumtoxin aufbauen möchte.',
        'For our beauty studio FareWell in the centre of Nuremberg we are looking for a licensed physician with experience in aesthetic injections, who wants to build their own botulinum toxin offering with us.'
      ),
      applySubject: t(
        'Bewerbung als Ärztin / Arzt für ästhetische Medizin bei FareWell',
        'Application as a physician for aesthetic medicine at FareWell'
      ),
      workHours: t(
        'Behandlungsbetrieb Mo–Fr 10:00–20:00 Uhr, Sa 08:00–17:00 Uhr. In der Regel ein fester Nachmittag oder früher Abend pro Woche; keine Anwesenheitspflicht ohne gebuchte Termine.',
        'Treatment hours Mon–Fri 10:00–20:00, Sat 08:00–17:00. Usually one fixed afternoon or early evening per week; no obligation to be present without booked appointments.'
      ),
      responsibilities: [
        t(
          'Ärztliche Beratung, Aufklärung und Indikationsstellung in eigener Verantwortung',
          'Medical consultation, informed consent and indication, under your own responsibility'
        ),
        t(
          'Injektionen mit Botulinumtoxin, auf Wunsch weitere ästhetische Injektionsbehandlungen',
          'Botulinum toxin injections and, if you wish, further aesthetic injection treatments'
        ),
        t(
          'Eigene Dokumentation und Nachsorge deiner Patient:innen',
          'Your own documentation and follow-up care for your patients'
        ),
        t(
          'Aufbau und Pflege eines eigenen Patientenstamms mit Unterstützung des Studios',
          'Building and nurturing your own patient base with the support of the studio'
        ),
        t(
          'Fachliche Verantwortung für die Behandlungen, die du bei uns anbietest',
          'Professional responsibility for the treatments you offer here'
        ),
      ],
      profile: [
        t('Deutsche Approbation als Ärztin oder Arzt', 'A German medical licence (Approbation)'),
        t(
          'Nachweisbare Erfahrung mit ästhetischen Injektionen, insbesondere Botulinumtoxin',
          'Demonstrable experience with aesthetic injections, in particular botulinum toxin'
        ),
        t(
          'Sicherer Umgang mit Aufklärung, Dokumentation und Notfallmanagement',
          'Confident handling of informed consent, documentation and emergency management'
        ),
        t(
          'Eigene Berufshaftpflicht für die ärztliche Tätigkeit',
          'Your own professional liability insurance for medical practice'
        ),
        t(
          'Freude an ehrlicher Beratung und realistischen Erwartungen statt an maximalen Umsätzen',
          'A genuine liking for honest advice and realistic expectations rather than maximum revenue'
        ),
        t(
          'Idealerweise Interesse, das ästhetische Angebot mittelfristig mitzuentwickeln',
          'Ideally an interest in helping develop the aesthetic offering over time'
        ),
      ],
      faq: karriereFaqEntries(t, {
        model: {
          answer: t(
            'Du zahlst keine feste Miete und kein Fixum. Wir arbeiten mit einer Umsatzbeteiligung auf deine Behandlungen. Verschreibungspflichtige Präparate beziehst und verantwortest du selbst; sie fließen nicht in die Beteiligung ein. Die genaue Aufteilung und den Abrechnungsrhythmus halten wir im Erstgespräch schriftlich fest, bevor du startest.',
            'You pay no fixed rent and no flat fee. We work with a revenue share on your treatments. You source and take responsibility for prescription-only preparations yourself; they are not part of the share. We put the exact split and the settlement rhythm in writing at the first meeting, before you start.'
          ),
        },
        clients: {
          question: t('Wem gehören meine Patient:innen?', 'Who do my patients belong to?'),
          answer: t(
            'Dir. Du behandelst in eigener ärztlicher Verantwortung: deine Patient:innen, deine Preise, deine Dokumentation. Wir empfehlen dir ausdrücklich ein eigenes Google-Business-Profil auf deinen Namen. Bewertungen landen dann bei dir, und wenn du eines Tages weiterziehst, nimmst du Profil und Bewertungen einfach mit.',
            'You. You treat under your own medical responsibility: your patients, your prices, your documentation. We actively encourage you to set up your own Google Business profile in your name. Reviews then land with you, and if you move on one day you simply take the profile and the reviews with you.'
          ),
        },
        extra: [
          {
            question: t(
              'Welche Qualifikation ist zwingend?',
              'Which qualification is non-negotiable?'
            ),
            answer: t(
              'Eine deutsche Approbation als Ärztin oder Arzt und nachweisbare Erfahrung mit ästhetischen Injektionen. Botulinumtoxin ist verschreibungspflichtig, und die Injektion ist ärztlichen Behandler:innen vorbehalten. Ohne Approbation geht es bei dieser Stelle nicht, deshalb steht die Voraussetzung ganz vorne.',
              'A German medical licence (Approbation) and demonstrable experience with aesthetic injections. Botulinum toxin is prescription-only, and injecting it is reserved for physicians. Without a licence this role is not possible, which is why the requirement is stated up front.'
            ),
          },
          {
            question: t(
              'Wie ist die Tätigkeit rechtlich eingebettet?',
              'How is the work embedded legally?'
            ),
            answer: t(
              'Du behandelst in eigener ärztlicher Verantwortung, mit eigener Aufklärung, eigener Dokumentation und eigener Berufshaftpflicht. FareWell stellt Raum, Termine, Buchungssystem und Sichtbarkeit. Mit ärztlicher Verantwortung im Haus arbeiten wir bereits: Einen Teil unserer kosmetischen Behandlungen bieten wir unter ärztlicher Delegation an. Dein Angebot fügt sich direkt in diese Struktur ein.',
              'You treat under your own medical responsibility, with your own informed consent process, your own documentation and your own liability insurance. FareWell provides the room, the appointments, the booking system and the visibility. We already work with medical responsibility in the house: some of our cosmetic treatments are offered under medical delegation. Your offering fits directly into that structure.'
            ),
            linkPath: '/price',
            linkFragment: 'aerztliche-delegation',
            linkLabel: t(
              'Behandlungen unter ärztlicher Delegation ansehen',
              'See the treatments under medical delegation'
            ),
          },
          {
            question: t(
              'Wer besorgt Präparate und Material?',
              'Who sources the preparations and materials?'
            ),
            answer: t(
              'Verschreibungspflichtige Präparate beziehst, lagerst und verantwortest du selbst. Raum, Liege, Hygiene-Infrastruktur, Wäsche und Buchungssystem stellen wir.',
              'You source, store and take responsibility for prescription-only preparations yourself. We provide the room, the treatment couch, the hygiene infrastructure, the laundry and the booking system.'
            ),
          },
          {
            question: t(
              'Kann ich das neben meiner Praxis oder Klinik machen?',
              'Can I do this alongside my own practice or clinic?'
            ),
            answer: t(
              'Ja. Viele starten mit einem festen Nachmittag oder Abend pro Woche. Anwesenheit ohne gebuchte Termine erwarten wir nicht, und die Zeitfenster legen wir gemeinsam so, dass sie zu deiner Haupttätigkeit passen.',
              'Yes. Many start with one fixed afternoon or evening per week. We do not expect you to be present without booked appointments, and we set the time slots together so they fit around your main role.'
            ),
          },
        ],
      }),
    };
  }
}
