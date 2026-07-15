import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/faq';
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = 'FAQ – Häufige Fragen zu Haarentfernung & Behandlungen | FareWell Nürnberg';
const PAGE_DESCRIPTION =
  'Antworten auf die häufigsten Fragen an FareWell Nürnberg: Elektrolyse vs. Diodenlaser, Termine & Preise, Kostenübernahme durch die Krankenkasse, Steuer und US-Forces-Mehrwertsteuerbefreiung.';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
}

@Component({
  standalone: true,
  selector: 'app-faq',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly jsonLdId = 'faq-schema';

  readonly stats: GuideStat[] = [
    { value: '2', label: 'Methoden der Haarentfernung' },
    { value: 'gratis', label: 'Erstberatung' },
    { value: '6', label: 'Tage pro Woche geöffnet' },
    { value: '4', label: 'Ratgeber zum Nachlesen' },
  ];

  readonly toc: GuideTocItem[] = [
    { id: 'behandlungen', label: 'Behandlungen & Methoden' },
    { id: 'termine', label: 'Termine, Beratung & Preise' },
    { id: 'kostenuebernahme', label: 'Krankenkasse & Steuer' },
    { id: 'us-forces', label: 'US Forces & Mehrwertsteuer' },
    { id: 'kontakt', label: 'Kontakt & Öffnungszeiten' },
    { id: 'ratgeber', label: 'Ratgeber zum Vertiefen' },
  ];

  /**
   * Fragen und Antworten als Klartext für das FAQPage-Schema. Inhaltlich
   * deckungsgleich mit dem sichtbaren Akkordeon im Template halten!
   */
  private readonly faqEntries: FaqJsonLdEntry[] = [
    {
      question: 'Was ist der Unterschied zwischen permanenter und dauerhafter Haarentfernung?',
      answer:
        'Permanent ist in Deutschland allein die Elektrolyse (Nadelepilation): Jede Haarwurzel wird einzeln und endgültig verödet – die einzige rechtlich als permanent anerkannte Methode. Der Diodenlaser erreicht eine dauerhafte Haarentfernung, also eine deutliche, langanhaltende Reduktion, ideal für größere Zonen. Bei FareWell bekommst du beide Methoden und eine ehrliche Empfehlung, was für dich passt.',
    },
    {
      question: 'Welche Behandlungen bietet FareWell an?',
      answer:
        'Elektrolyse (Nadelepilation) zur permanenten Haarentfernung, Diodenlaser (4 Wellen) zur dauerhaften Haarentfernung, Microneedling mit Radiofrequenz zur Hautverjüngung, Kavitation zur Körperformung sowie Wellness- und therapeutische Massagen.',
    },
    {
      question: 'Welche Methode der Haarentfernung passt zu mir?',
      answer:
        'Als Faustregel: Helle, feine, rötliche oder vereinzelte Haare und kleine Zonen wie das Gesicht sprechen für die Elektrolyse. Dunklere Haare auf größeren Flächen wie Beinen, Rücken oder Achseln sprechen für den Diodenlaser. In der kostenlosen Erstberatung schauen wir uns Haut und Haare gemeinsam an und empfehlen dir die passende Methode.',
    },
    {
      question: 'Wie viele Sitzungen brauche ich?',
      answer:
        'Haare wachsen in Zyklen, und nur Haare in der Wachstumsphase lassen sich wirksam behandeln. Deshalb sind immer mehrere Sitzungen nötig. Wie viele genau, hängt von Körperzone, Haardichte und Hormonlage ab – eine realistische Einschätzung bekommst du in der kostenlosen Erstberatung.',
    },
    {
      question: 'Wie buche ich einen Termin bei FareWell?',
      answer:
        'Am einfachsten online über Salonkee (salonkee.de/salon/farewell) – rund um die Uhr, mit sofortiger Bestätigung. Alternativ erreichst du uns per Instagram-Nachricht (@farewell.salon) oder telefonisch unter +49 157 5799 5694.',
    },
    {
      question: 'Was kostet eine Behandlung?',
      answer:
        'Alle Preise stehen transparent je Körperzone auf unserer Preisseite unter farewell.salon/price. Die Erstberatung ist kostenlos, und für den Kassenantrag erstellen wir dir einen schriftlichen Kostenvoranschlag.',
    },
    {
      question: 'Ist die Erstberatung wirklich kostenlos?',
      answer:
        'Ja. Wir schauen uns deine Haut- und Haarsituation an, besprechen Methode, Ablauf, Sitzungsanzahl und Kosten – ohne Berechnung und ohne Verpflichtung.',
    },
    {
      question: 'Übernimmt die Krankenkasse die Epilation bei Geschlechtsangleichung?',
      answer:
        'Ja, das ist möglich. Die Kasse übernimmt Epilation als Sachleistung, wenn sie medizinisch notwendig ist (§ 27 SGB V), etwa bei der Diagnose Geschlechtsinkongruenz (ICD F64.0). Der Knackpunkt ist der Ärztevorbehalt (§ 28 SGB V): Die Behandlung muss als ärztliche Leistung gelten. Weil FareWell mit einer delegierenden Ärztin arbeitet, ist genau das gelöst. Wichtig: Der Antrag muss vor Behandlungsbeginn gestellt werden. Alle Schritte erklärt unser Leitfaden „Epilation über die Krankenkasse“.',
    },
    {
      question: 'Was bedeutet „ärztliche Delegation“ bei FareWell?',
      answer:
        'Eine Ärztin delegiert die Epilationsbehandlung an unser geschultes Team und bleibt medizinisch verantwortlich. Dadurch zählt die Nadelepilation bei FareWell als ärztlich delegierte Leistung – die Voraussetzung dafür, dass die Krankenkasse sie als Sachleistung übernehmen kann. Für deinen Antrag erstellen wir gemeinsam den Kostenvoranschlag.',
    },
    {
      question: 'Kann ich die Behandlungskosten von der Steuer absetzen?',
      answer:
        'Ja – den Anteil, den du selbst trägst, kannst du als außergewöhnliche Belastung in der Steuererklärung geltend machen, wenn die medizinische Notwendigkeit dokumentiert ist (z. B. bei Behandlungen im Zuge der Geschlechtsangleichung). Elektrolyse und Diodenlaser werden steuerlich gleich behandelt. Du brauchst drei Bausteine: den medizinischen Nachweis, ordentliche Rechnungen von FareWell und Zahlungsbelege. Details stehen in unserem Steuer-Leitfaden.',
    },
    {
      question: 'Was brauche ich von meiner Ärztin, bevor ich starte?',
      answer:
        'Die Diagnose (Geschlechtsdysphorie bzw. Geschlechtsinkongruenz, ICD F64.0) und eine Bescheinigung, dass die Haarentfernung zur Geschlechtsangleichung medizinisch notwendig ist – idealerweise ausgestellt vor der ersten Sitzung. Für den Kassenantrag kommt der ärztliche Bericht dazu.',
    },
    {
      question: 'Ich gehöre zu den US-Streitkräften – kann ich ohne Mehrwertsteuer zahlen?',
      answer:
        'Ja. Dank des NATO-Truppenstatuts (SOFA) stellen wir dir mit einem NF1-Formular die Behandlung ohne die deutsche Mehrwertsteuer von 19% aus – das Formular musst du vor der Zahlung vorlegen. Alternativ zahlst du voll und holst dir die Mehrwertsteuer über die Remonon-App zurück. Beide Wege erklärt unser Leitfaden zur Mehrwertsteuerbefreiung, auf Deutsch und Englisch.',
    },
    {
      question: 'Do you offer VAT-free treatments for US Forces members?',
      answer:
        "Yes. Under the Status of Forces Agreement, present your NF1 form before you pay and we bill you without the 19% German VAT. You can also pay in full and reclaim the VAT through the Remonon app. On top of that, US Forces members get 20% off laser hair removal for life with the promo code USLASER. Read our English guide 'US Forces VAT relief in Germany' for the full walkthrough.",
    },
    {
      question: 'Gibt es einen Rabatt für US-Streitkräfte?',
      answer:
        'Ja: 20% lebenslang auf Laser-Haarentfernung mit dem Promo-Code USLASER – zusätzlich kombinierbar mit der Mehrwertsteuerbefreiung. Eine Laserbehandlung von 150 € kostet so rund 100 €, etwa ein Drittel weniger.',
    },
    {
      question: 'Wo finde ich FareWell?',
      answer:
        'Im Zentrum von Nürnberg: Frauentorgraben 5, 90443 Nürnberg – wenige Gehminuten vom Hauptbahnhof und Opernhaus entfernt.',
    },
    {
      question: 'Welche Öffnungszeiten hat FareWell?',
      answer:
        'Montag bis Freitag 10–20 Uhr, Samstag 8–17 Uhr. Termine vereinbarst du am besten online über Salonkee.',
    },
  ];

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: PAGE_PATH,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          '@id': `${PAGE_URL}#faq`,
          url: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          inLanguage: 'de',
          mainEntity: this.faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.answer,
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon' },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: PAGE_URL },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
