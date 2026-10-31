import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
  type GuideTocItem,
} from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS } from 'src/components/molecules/karriere';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import { KarriereFaqEntry } from '../shared/karriere-content';

const PAGE_PATH = '/karriere/raum-mieten-nuernberg';
const ORIGIN = 'https://farewell.salon';

/** Ein Beruf, für den der Raum passt, mit Link auf seine Stellenseite. */
interface RaumBeruf {
  icon: string;
  title: string;
  text: string;
  /** Deutscher Pfad der Detailseite; wird per p() lokalisiert. */
  path: string;
}

/**
 * Raum mieten: die Seite für alle, die nicht nach einer Stelle, sondern nach
 * Räumen suchen („Raum mieten als Kosmetikerin“, „als Untermieterin
 * einmieten“). Gleicher Ort, gleiche Zeitfenster wie auf den Stellenseiten,
 * aber zwei Wege hinein: feste Miete oder der übliche Deal mit
 * Umsatzbeteiligung.
 *
 * Bewusst kein JobPosting: Wer einen Raum mietet, bewirbt sich nicht. Das
 * Schema beschreibt deshalb ein Service-Angebot des Salons plus FAQPage, damit
 * KI-Suchen die Antworten auf genau diese Fragen wörtlich finden.
 *
 * Die feste Miete beginnt bei 200 € im Monat für einen festen Tag pro Woche
 * (Joé, 31.10.2026), auf Höhe der Kleinanzeigen-Angebote, die ChatGPT bei der
 * Testsuche vom 30.10.2026 zitierte; mehr Tage und einzelne Abende auf Anfrage.
 * KI-Antworten zitieren konkrete Preise bevorzugt. Der Betrag steht auch in
 * karriere-content.ts, karriere-deal, im Routing und in llms.txt: Ändert er
 * sich, alle Stellen mitziehen.
 */
@Component({
  standalone: true,
  selector: 'app-raum-mieten',
  imports: [
    ...GUIDE_COMPONENTS,
    ...KARRIERE_COMPONENTS,
    RevealOnScrollDirective,
    RouterLink,
  ],
  templateUrl: './raum-mieten.component.html',
})
export class RaumMietenComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'raum-mieten-schema';

  /** FAQ pro Sprache gecacht, das Template hängt per track an der Liste. */
  private faqCache: { lang: Lang; entries: KarriereFaqEntry[] } | null = null;

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      {
        value: this.t('ab 200 €', 'from 200 €'),
        label: this.t('feste Miete im Monat, 1 Tag pro Woche', 'fixed rent a month, 1 day a week'),
        animate: false,
      },
      {
        value: '0 €',
        label: this.t('Fixkosten mit Umsatzbeteiligung', 'fixed costs on a revenue share'),
        animate: false,
      },
      { value: '100%', label: this.t('deine Kund:innen', 'your own clients') },
      {
        value: this.t('selbständig', 'freelance'),
        label: this.t('dein Status', 'your status'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'modelle', label: this.t('Zwei Wege in den Raum', 'Two ways into the room') },
      { id: 'raum', label: this.t('Der Raum und das Haus', 'The room and the house') },
      { id: 'zeiten', label: this.t('Zeiten und freie Fenster', 'Hours and open slots') },
      { id: 'berufe', label: this.t('Für wen der Raum passt', 'Who the room suits') },
      { id: 'faq', label: this.t('Häufige Fragen', 'Frequently asked questions') },
      { id: 'bewerben', label: this.t('Raum anfragen', 'Ask about the room') },
    ];
  }

  get berufe(): RaumBeruf[] {
    const t = (de: string, en: string) => this.t(de, en);
    return [
      {
        icon: '✨',
        title: t('Kosmetiker:in', 'Beautician'),
        text: t(
          'Gesichtsbehandlungen, Pflege, Wimpern, Brauen oder deine eigene Spezialität, in einem eingerichteten Behandlungsraum.',
          'Facials, skincare, lashes, brows or your own speciality, in a fully set-up treatment room.'
        ),
        path: '/karriere/kosmetik-nuernberg',
      },
      {
        icon: '🤲',
        title: t('Masseur:in und Physiotherapeut:in', 'Massage therapist and physiotherapist'),
        text: t(
          'Massage und Körperarbeit auf Privatbasis, in einem eigenen Raum, der nicht an die Kosmetikzeiten gebunden ist.',
          'Massage and bodywork on a private basis, in a room of its own that is not tied to the beauty hours.'
        ),
        path: '/karriere/masseur-nuernberg',
      },
      {
        icon: '🧘',
        title: t('Yoga-Lehrer:in', 'Yoga teacher'),
        text: t(
          'Ein ruhiger Raum für kleine Gruppen und Einzelstunden, früh morgens, abends und am Wochenende.',
          'A quiet room for small groups and one-to-one sessions, early in the morning, in the evening and at the weekend.'
        ),
        path: '/karriere/yoga-nuernberg',
      },
      {
        icon: '💃',
        title: t('Tanzlehrer:in', 'Dance teacher'),
        text: t(
          'Einzelunterricht, Paare und kleine Gruppen. Kein Tanzsaal, dafür mitten in der Innenstadt.',
          'One-to-one lessons, couples and small groups. Not a dance hall, but right in the city centre.'
        ),
        path: '/karriere/tanzlehrer-nuernberg',
      },
      {
        icon: '💉',
        title: t('Ärzt:in für ästhetische Medizin', 'Physician for aesthetic medicine'),
        text: t(
          'Mit Approbation und Injektionserfahrung, in einem Studio, das bereits mit ärztlicher Begleitung arbeitet.',
          'With a medical licence and injection experience, in a studio that already works with medical support.'
        ),
        path: '/karriere/botox-nuernberg',
      },
    ];
  }

  get faq(): KarriereFaqEntry[] {
    const activeLang = this.language.lang();
    if (this.faqCache?.lang !== activeLang) {
      this.faqCache = { lang: activeLang, entries: this.buildFaq() };
    }
    return this.faqCache.entries;
  }

  /**
   * Die Fragen so formuliert, wie Menschen auf Raumsuche sie tippen oder einer
   * KI stellen. Sichtbarer Text und FAQPage-Schema kommen aus dieser Liste.
   */
  private buildFaq(): KarriereFaqEntry[] {
    const t = (de: string, en: string) => this.t(de, en);
    return [
      {
        question: t(
          'Wo kann ich mich in Nürnberg als Kosmetikerin einmieten?',
          'Where can I rent space as a beautician in Nuremberg?'
        ),
        answer: t(
          'Zum Beispiel bei FareWell am Frauentorgraben 5, wenige Minuten vom Nürnberger Hauptbahnhof. Du mietest dich in einen eingerichteten Behandlungsraum ein und arbeitest dort selbständig, mit eigenen Kund:innen und eigenen Preisen. Bei uns behandelt immer nur eine Kosmetikerin zur gleichen Zeit, deshalb stimmen wir deine Tage und deinen Schwerpunkt vorher gemeinsam ab.',
          'At FareWell, for example, at Frauentorgraben 5, a few minutes from Nuremberg main station. You move into a fully set-up treatment room and work there as a freelancer, with your own clients and your own prices. Only one beautician ever treats at a time here, so we agree your days and your focus together beforehand.'
        ),
      },
      {
        question: t(
          'Kann ich bei euch einen Raum zur Untermiete mit fester Miete mieten?',
          'Can I sublet a room from you at a fixed rent?'
        ),
        answer: t(
          'Ja. Neben unserem Modell mit Umsatzbeteiligung kannst du den Raum auch zu einer festen Miete nutzen: ab 200 € im Monat für einen festen Tag pro Woche. Brauchst du mehr Tage oder nur einzelne Abende, schreib uns, was du brauchst, und wir machen dir ein Angebot.',
          'Yes. Alongside our revenue share model you can also use the room at a fixed rent: from 200 € a month for one fixed day a week. If you need more days or only single evenings, write to us with what you need and we will make you an offer.'
        ),
      },
      {
        question: t(
          'Was kostet ein Behandlungsraum bei FareWell?',
          'What does a treatment room at FareWell cost?'
        ),
        answer: t(
          'Es gibt zwei Wege. Mit Umsatzbeteiligung zahlst du 0 € Fixkosten, FareWell bekommt einen kleineren Anteil an dem, was du tatsächlich umsetzt. Mit fester Miete zahlst du ab 200 € im Monat für einen festen Tag pro Woche und behältst deinen ganzen Umsatz; für mehr Tage oder andere Zeitfenster machen wir dir ein Angebot.',
          'There are two ways. On a revenue share you pay 0 € in fixed costs, and FareWell receives a smaller share of what you actually take in. On a fixed rent you pay from 200 € a month for one fixed day a week and keep all of your revenue; for more days or other time slots we will make you an offer.'
        ),
      },
      {
        question: t(
          'Kann ich den Raum nur an einzelnen Tagen oder Abenden nutzen?',
          'Can I use the room only on certain days or evenings?'
        ),
        answer: t(
          'Ja. Du legst deine festen Tage selbst fest, innerhalb der Zeitfenster im Wochenplan oben. Behandlungen laufen montags bis freitags von 10 bis 20 Uhr und samstags von 8 bis 17 Uhr, Massage montags bis samstags von 8 bis 22 Uhr, Kurse wie Yoga oder Tanz früh morgens von 7 bis 9 Uhr, abends ab 19:30 Uhr und sonntags ganztägig.',
          'Yes. You set your own fixed days, within the time slots in the weekly plan above. Treatments run Monday to Friday from 10:00 to 20:00 and Saturday from 08:00 to 17:00, massage Monday to Saturday from 08:00 to 22:00, and classes such as yoga or dance early in the morning from 07:00 to 09:00, in the evening from 19:30 and all day on Sunday.'
        ),
      },
      {
        question: t(
          'Gibt es auch einen Raum für Yoga oder Tanz?',
          'Is there also a room for yoga or dance?'
        ),
        answer: t(
          'Ja. Für Kurse gibt es einen ruhigen Raum für kleine Gruppen und Einzelstunden, früh morgens, abends und am Wochenende. Ein Tanzsaal ist es nicht, dafür liegt er mitten in der Innenstadt. Ob eine feste Miete für deine Kurszeiten oder die Umsatzbeteiligung besser passt, klären wir gemeinsam.',
          'Yes. For classes there is a quiet room for small groups and one-to-one sessions, early in the morning, in the evening and at the weekend. It is not a dance hall, but it sits right in the city centre. Whether a fixed rent for your class times or the revenue share fits better, we work out together.'
        ),
      },
      {
        question: t(
          'Welche Voraussetzungen brauche ich, um mich einzumieten?',
          'What do I need in order to rent the room?'
        ),
        answer: t(
          'Eine echte Selbständigkeit, also ein angemeldetes Gewerbe oder eine freiberufliche Tätigkeit, die Ausbildung und die Nachweise, die dein Beruf verlangt, und eine eigene Berufshaftpflicht. Was du für den Weg in die Selbständigkeit sonst noch brauchst, steht Schritt für Schritt in unserer Freelancer Road.',
          'Genuine self-employment, meaning a registered trade or a freelance activity, the training and credentials your profession requires, and your own professional liability insurance. Everything else you need on the way to self-employment is laid out step by step in our Freelancer Road.'
        ),
        linkPath: '/karriere/freelancer-road',
        linkLabel: t('Zur Freelancer Road', 'Go to the Freelancer Road'),
      },
    ];
  }

  ngOnInit(): void {
    const prefix = this.language.prefix();
    const title = this.t(
      'Raum mieten in Nürnberg für Kosmetik, Massage & Yoga | FareWell',
      'Rent a Room in Nuremberg for Beauty, Massage & Yoga | FareWell'
    );
    const description = this.t(
      'Behandlungsraum zur Untermiete in Nürnberg, Frauentorgraben 5: feste Miete ab 200 € im Monat oder 0 € Fixkosten mit Umsatzbeteiligung. Für selbständige Kosmetiker:innen, Masseur:innen, Yoga- und Tanzlehrer:innen.',
      'A treatment room to sublet in Nuremberg, Frauentorgraben 5: a fixed rent from 200 € a month, or 0 € fixed costs on a revenue share. For freelance beauticians, massage therapists, yoga and dance teachers.'
    );
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const homeUrl = `${ORIGIN}${prefix}`;
    const inLanguage = this.language.lang();

    this.seo.setPageSeo({ title, description, path: PAGE_PATH });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage,
          isPartOf: { '@id': `${ORIGIN}/#website` },
          about: { '@id': `${pageUrl}#service` },
        },
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            'Behandlungsraum mieten in Nürnberg',
            'Treatment room for rent in Nuremberg'
          ),
          serviceType: this.t(
            'Vermietung von Behandlungs- und Kursräumen an Selbständige',
            'Renting treatment and class rooms to freelancers'
          ),
          description,
          provider: { '@id': `${ORIGIN}/#organization` },
          areaServed: { '@type': 'City', name: 'Nürnberg' },
          audience: {
            '@type': 'BusinessAudience',
            name: this.t(
              'Selbständige Kosmetiker:innen, Masseur:innen, Physiotherapeut:innen, Yoga- und Tanzlehrer:innen',
              'Freelance beauticians, massage therapists, physiotherapists, yoga and dance teachers'
            ),
          },
          offers: {
            '@type': 'Offer',
            name: this.t('Feste Miete', 'Fixed rent'),
            description: this.t(
              'Ab 200 € im Monat für einen festen Tag pro Woche; mehr Tage und einzelne Abende auf Anfrage. Alternativ 0 € Fixkosten mit Umsatzbeteiligung.',
              'From 200 € a month for one fixed day a week; more days and single evenings on request. Alternatively 0 € fixed costs on a revenue share.'
            ),
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              minPrice: 200,
              priceCurrency: 'EUR',
              unitCode: 'MON',
              unitText: this.t('Monat', 'month'),
            },
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          inLanguage,
          mainEntity: this.faq.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: { '@type': 'Answer', text: entry.answer },
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
              item: `${ORIGIN}${prefix}/karriere`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Raum mieten', 'Rent a room'),
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
