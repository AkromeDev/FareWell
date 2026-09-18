/**
 * Inhalt der Freelancer Road: Etappen, Schritte, Behörden-Kontakte und Joés
 * Erfahrungen aus der eigenen Gründung (Jan. 2025 bis Herbst 2025).
 *
 * Quelle ist das private GitHub-Project-Board „Farewell" (87 Karten). Was hier
 * steht, ist bewusst gefiltert: öffentliche Ämter mit Adresse und Nummer ja,
 * Privatpersonen nein („frag Joé nach dem Kontakt"). Rechtliche Aussagen sind
 * als Erfahrung und Hinweis formuliert, nicht als Beratung; wo es vom Einzelfall
 * abhängt, nennt der Schritt die Stelle, die es verbindlich sagen kann.
 *
 * Zweisprachig: jeder Text ist ein {de, en}-Paar. Die Schritte-Seite rendert
 * beide Sprachen ins DOM (<span class="lang de|en">), wie die übrige Prosa der
 * Karriere-Seiten. Kein Gedankenstrich als Satztrenner (Hausregel).
 */

export type ProfessionId = 'kosmetik' | 'massage' | 'physio' | 'kurse' | 'medizin';

export interface Bi {
  de: string;
  en: string;
}

export interface Profession {
  id: ProfessionId;
  icon: string;
  label: Bi;
  /** Ein Satz zur steuerlichen Einordnung, die den Rest der Road prägt. */
  status: Bi;
}

export interface Contact {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: Bi;
  url?: string;
}

export interface Link {
  label: Bi;
  url: string;
}

export interface Step {
  id: string;
  title: Bi;
  /** Ein bis zwei Sätze, immer sichtbar. */
  summary: Bi;
  /** Aufzählungspunkte im ausgeklappten Zustand. */
  details: Bi[];
  /** Für welche Berufe der Schritt gilt. Leer = alle. */
  professions?: ProfessionId[];
  /** Gewichtung: Pflicht (rechtlich), empfohlen, optional. */
  weight: 'pflicht' | 'empfohlen' | 'optional';
  /** Joés eigene Erfahrung, in der ersten Person. */
  joe?: Bi;
  /** Was FareWell hier konkret abnimmt oder mitbringt. */
  farewell?: Bi;
  contacts?: Contact[];
  links?: Link[];
}

export interface Phase {
  id: string;
  index: string;
  tag: Bi;
  title: Bi;
  lead: Bi;
  steps: Step[];
}

/** Stand der Inhalte, wird im Kleingedruckten der Seiten angezeigt. */
export const ROAD_STAND = '2026';

export const PROFESSIONS: Profession[] = [
  {
    id: 'kosmetik',
    icon: '✨',
    label: { de: 'Kosmetik, Laser, Elektrolyse', en: 'Cosmetics, laser, electrolysis' },
    status: {
      de: 'Gewerbe und Handwerk (zulassungsfrei). Zuständig: Gewerbeamt, Handwerkskammer, für Laser und IPL die NiSV.',
      en: 'A trade and a craft (no master certificate needed). Handled by the trade office, the chamber of crafts and, for laser and IPL, the NiSV.',
    },
  },
  {
    id: 'massage',
    icon: '🤲',
    label: { de: 'Massage', en: 'Massage' },
    status: {
      de: 'Je nach Ausbildung freier Beruf (staatlich geprüfte Masseur:in) oder Gewerbe (Wellness-Massage). Das Finanzamt entscheidet anhand deiner Unterlagen.',
      en: 'Depending on your training either a liberal profession (state-certified massage therapist) or a trade (wellness massage). The tax office decides based on your documents.',
    },
  },
  {
    id: 'physio',
    icon: '💪',
    label: { de: 'Physiotherapie (privat)', en: 'Physiotherapy (private)' },
    status: {
      de: 'Freier Beruf, keine Kammer, keine Gewerbeanmeldung. Bei FareWell nur Privat- und Selbstzahlerleistungen, keine Kassenrezepte.',
      en: 'A liberal profession: no chamber, no trade registration. At FareWell private and self-pay work only, no insurance prescriptions.',
    },
  },
  {
    id: 'kurse',
    icon: '🧘',
    label: { de: 'Yoga, Tanz, Kurse', en: 'Yoga, dance, classes' },
    status: {
      de: 'Unterrichtende Tätigkeit, in der Regel freiberuflich. Achtung: selbständige Lehrer:innen sind meist rentenversicherungspflichtig.',
      en: 'Teaching, usually a liberal profession. Note: self-employed teachers in Germany are usually subject to mandatory pension insurance.',
    },
  },
  {
    id: 'medizin',
    icon: '💉',
    label: { de: 'Ärzt:in, ästhetische Medizin', en: 'Physician, aesthetic medicine' },
    status: {
      de: 'Freier Beruf mit Approbation und Ärztekammer. Botox ist Heilkunde: Heilmittelwerbegesetz statt Rabattplattformen.',
      en: 'A liberal profession with a licence and the medical chamber. Botox is medicine: the advertising law for medical products applies, no discount platforms.',
    },
  },
];

const ALL_GEWERBE: ProfessionId[] = ['kosmetik', 'massage'];
const FREIE_BERUFE: ProfessionId[] = ['physio', 'kurse', 'medizin'];

const GEWERBEAMT: Contact = {
  name: 'Gewerbeamt Nürnberg (Ordnungsamt, Sachgebiet Gewerbewesen)',
  phone: '0911 231-0',
  email: 'gewerbeanzeigen@stadt.nuernberg.de',
  address: 'Innerer Laufer Platz 3, 90403 Nürnberg',
  hours: {
    de: 'Mo, Di, Do 08:00–15:45 · Mi, Fr 08:00–12:30 (Stand 2025)',
    en: 'Mon, Tue, Thu 08:00–15:45 · Wed, Fri 08:00–12:30 (as of 2025)',
  },
  url: 'https://www.nuernberg.de/internet/ordnungsamt/gewerbe.html',
};

const GESUNDHEITSAMT: Contact = {
  name: 'Gesundheitsamt Nürnberg',
  phone: '0911 231-2333',
  email: 'gesundheitsamt@stadt.nuernberg.de',
  address: 'Burgstraße 4, 90403 Nürnberg',
  hours: {
    de: 'Mo–Fr 08:30–12:30, Do zusätzlich 14:00–16:00 (Stand 2025)',
    en: 'Mon–Fri 08:30–12:30, Thu also 14:00–16:00 (as of 2025)',
  },
  url: 'https://www.nuernberg.de/internet/gesundheit_nbg/',
};

const HWK: Contact = {
  name: 'Handwerkskammer für Mittelfranken',
  phone: '0911 5309-0',
  email: 'info@hwk-mittelfranken.de',
  address: 'Sulzbacher Straße 11–15, 90489 Nürnberg',
  hours: {
    de: 'Mo–Do 07:30–17:00 · Fr 07:30–14:30 (Stand 2025)',
    en: 'Mon–Thu 07:30–17:00 · Fri 07:30–14:30 (as of 2025)',
  },
  url: 'https://www.hwk-mittelfranken.de/',
};

const HWK_BERATUNG: Contact = {
  name: 'HWK Mittelfranken, Unternehmensberatung',
  phone: '0911 5309-498',
  email: 'unternehmensberatung@hwk-mittelfranken.de',
};

const IHK: Contact = {
  name: 'IHK Nürnberg für Mittelfranken, Gründungsberatung',
  phone: '0911 1335-1516',
  address: 'Hauptmarkt 25/27, 90403 Nürnberg',
  url: 'https://www.ihk.de/nuernberg/',
};

const LFA: Contact = {
  name: 'LfA Förderbank Bayern, Repräsentanz Nürnberg',
  phone: '0911 81008-00',
  email: 'nuernberg@lfa.de',
  address: 'Am Tullnaupark 8, 90402 Nürnberg',
  url: 'https://www.lfa.de/',
};

const BAYERN_INNOVATIV: Contact = {
  name: 'Bayern Innovativ',
  phone: '0911 20671-0',
  address: 'Am Tullnaupark 8, 90402 Nürnberg',
  url: 'https://www.bayern-innovativ.de/',
};

const AFA: Contact = {
  name: 'Agentur für Arbeit Nürnberg',
  phone: '0800 4 5555 00',
  address: 'Richard-Wagner-Platz 5, 90443 Nürnberg',
  url: 'https://www.arbeitsagentur.de/vor-ort/nuernberg/startseite',
};

const FINANZAMT: Contact = {
  name: 'Finanzamt Nürnberg (Neuaufnahme, Umsatzsteuer)',
  phone: '0911 3998-250',
  url: 'https://www.finanzamt.bayern.de/Nuernberg/',
};

const DRV: Contact = {
  name: 'Deutsche Rentenversicherung, kostenloses Servicetelefon',
  phone: '0800 1000 4800',
  url: 'https://www.deutsche-rentenversicherung.de/',
};

const BGW: Contact = {
  name: 'BGW, Berufsgenossenschaft für Gesundheitsdienst und Wohlfahrtspflege',
  url: 'https://www.bgw-online.de/',
};

const VBG: Contact = {
  name: 'VBG, Verwaltungs-Berufsgenossenschaft (Sport, Unterricht)',
  url: 'https://www.vbg.de/',
};

const GAA: Contact = {
  name: 'Gewerbeaufsichtsamt bei der Regierung von Mittelfranken (NiSV-Anzeige)',
  url: 'https://www.regierung.mittelfranken.bayern.de/',
};

export const PHASES: Phase[] = [
  // ------------------------------------------------------------------ 0
  {
    id: 'entscheiden',
    index: '01',
    tag: { de: 'Bevor du startest', en: 'Before you start' },
    title: { de: 'Entscheiden und vorbereiten', en: 'Decide and prepare' },
    lead: {
      de: 'Die Schritte, die Geld und Nerven sparen, wenn sie vor der ersten Anmeldung passieren. Vieles davon ist ein Anruf.',
      en: 'The steps that save money and nerves when they happen before the first registration. Most of them are a phone call.',
    },
    steps: [
      {
        id: 'erstgespraech',
        weight: 'pflicht',
        title: { de: 'Erstgespräch und Probe-Session bei FareWell', en: 'First meeting and trial session at FareWell' },
        summary: {
          de: 'Wir lernen uns kennen, du zeigst deine Arbeit, und wir halten den Deal schriftlich fest, bevor irgendetwas angemeldet wird.',
          en: 'We get to know each other, you show your work, and we put the deal in writing before anything gets registered.',
        },
        details: [
          {
            de: 'Bring mit: deine Ausbildungsnachweise, eine erste Idee deiner Leistungen und Preise, und deine Fragen.',
            en: 'Bring your training certificates, a first idea of your services and prices, and your questions.',
          },
          {
            de: 'Ergebnis des Gesprächs: Aufteilung, Abrechnungsrhythmus, deine festen Zeiten und was dir gehört, alles in einem kurzen Kooperationsvertrag.',
            en: 'Outcome of the meeting: the split, the billing rhythm, your fixed hours and what belongs to you, all in a short cooperation agreement.',
          },
          {
            de: 'Hast du viele Produkte und schwankende Kosten, gilt der Anteil auf den Gewinn nach Material, Kosten und Steuern, nicht auf den Umsatz. Liegen die 30 % für FareWell in einem Monat unter 300 €, behältst du sie. Das halten wir im Gespräch fest.',
            en: 'If you have many products and fluctuating costs, the share applies to profit after materials, costs and taxes, not to revenue. If FareWell\'s 30% comes to less than 300 € in a month, you keep it. We put that down in the meeting.',
          },
          {
            de: 'Bei der Probe-Session filmen wir mit deinem Okay ein wenig. Daraus wird dein erstes Vorstellungsvideo.',
            en: 'During the trial session we film a little, with your okay. That becomes your first introduction video.',
          },
        ],
        farewell: {
          de: 'Der Vertrag ist von einer Anwältin geprüft und für alle gleich. Du bekommst ihn vorab zum Lesen.',
          en: 'The agreement has been checked by a lawyer and is the same for everyone. You get it in advance to read.',
        },
      },
      {
        id: 'haupt-oder-neben',
        weight: 'pflicht',
        title: { de: 'Haupt- oder Nebenerwerb? Und wie du aus dem Job kommst', en: 'Main or side business? And how you leave your job' },
        summary: {
          de: 'Die Antwort bestimmt Krankenversicherung, Förderung und Steuer. Wer noch angestellt ist, kann klein anfangen und später umstellen.',
          en: 'The answer shapes health insurance, funding and tax. If you are still employed, you can start small and switch later.',
        },
        details: [
          {
            de: 'Nebenerwerb: unter 18 Stunden pro Woche und weniger Einkommen als aus dem Job. Die Krankenkasse bleibt über den Arbeitgeber, das ist der günstigste Start.',
            en: 'Side business: under 18 hours a week and less income than from your job. Health insurance stays with your employer, which is the cheapest start.',
          },
          {
            de: 'Wenn du selbst kündigst, gibt es beim Arbeitslosengeld eine Sperrzeit von zwölf Wochen. Es gibt keinen Trick drumherum, die Agentur für Arbeit sagt das klar.',
            en: 'If you resign yourself, unemployment benefit comes with a twelve-week blocking period. There is no trick around it, the employment agency is clear about that.',
          },
          {
            de: 'Als arbeitslos giltst du, solange du weniger als 15 Stunden pro Woche selbständig arbeitest. Das ist das Fenster für den Gründungszuschuss.',
            en: 'You count as unemployed as long as you work less than 15 hours a week self-employed. That is the window for the start-up grant.',
          },
        ],
        joe: {
          de: 'Ich habe zuerst ein Nebengewerbe angemeldet, während ich noch angestellt war, und später auf Vollerwerb umgestellt. So konnte ich Konto, Logo, Website und Verträge in Ruhe bauen, ohne dass die Uhr lief.',
          en: 'I registered a side business first while I was still employed and switched to full-time later. That let me build the bank account, logo, website and contracts calmly, without the clock running.',
        },
        contacts: [AFA],
      },
      {
        id: 'einordnung',
        weight: 'pflicht',
        title: { de: 'Gewerbe oder freier Beruf? Welche Kammer?', en: 'Trade or liberal profession? Which chamber?' },
        summary: {
          de: 'Zwei Anrufe klären, ob du ein Gewerbe anmeldest oder direkt zum Finanzamt gehst, und wer deine Kammer ist.',
          en: 'Two phone calls settle whether you register a trade or go straight to the tax office, and which chamber is yours.',
        },
        details: [
          {
            de: 'Kosmetik ist zulassungsfreies Handwerk: Gewerbeanmeldung, danach automatisch Mitglied der Handwerkskammer. Eine besondere Erlaubnis brauchst du nicht.',
            en: 'Cosmetics is a craft without master requirement: trade registration, then automatic membership of the chamber of crafts. No special permit needed.',
          },
          {
            de: 'Physiotherapie, staatlich geprüfte Massage, Unterricht und ärztliche Tätigkeit sind freie Berufe: keine Gewerbeanmeldung, keine IHK oder HWK, nur der Fragebogen beim Finanzamt.',
            en: 'Physiotherapy, state-certified massage, teaching and medical work are liberal professions: no trade registration, no chamber of commerce or crafts, only the tax office questionnaire.',
          },
          {
            de: 'Wellness-Massage ohne Heilberufsausbildung ist Gewerbe. Im Zweifel entscheidet das Finanzamt anhand deiner Ausbildung, frag vorher nach.',
            en: 'Wellness massage without a health-profession qualification is a trade. When in doubt the tax office decides based on your training, ask before you register.',
          },
        ],
        joe: {
          de: 'Ich habe IHK und HWK angerufen und dieselbe Frage gestellt. Beide waren sich einig: Kosmetik ist Handwerk. Zehn Minuten Telefon haben mir einen falschen Antrag erspart.',
          en: 'I called both the chamber of commerce and the chamber of crafts and asked the same question. Both agreed: cosmetics is a craft. Ten minutes on the phone saved me a wrong application.',
        },
        contacts: [HWK, IHK],
      },
      {
        id: 'businessplan',
        weight: 'empfohlen',
        title: { de: 'Businessplan und Finanzplan', en: 'Business plan and financial plan' },
        summary: {
          de: 'Nötig, sobald du Förderung oder einen Kredit willst. Auch ohne: eine Seite Zahlen zeigt dir, ab wann du davon leben kannst.',
          en: 'Needed as soon as you want funding or a loan. Even without: one page of numbers shows you when you can live off it.',
        },
        details: [
          {
            de: 'Die Vorlagen der Unternehmenswerkstatt Mittelfranken sind das, was Banken und Kammern sehen wollen. Finanzplan über drei Jahre, inklusive deiner privaten Ausgaben.',
            en: 'The templates of the Unternehmenswerkstatt Mittelfranken are what banks and chambers expect. Financial plan over three years, including your private expenses.',
          },
          {
            de: 'Steuern gehören in die Kosten. Das war der erste Fehler, den mir jemand aus meinem Plan gestrichen hat.',
            en: 'Taxes belong in the costs. That was the first mistake someone crossed out of my plan.',
          },
          {
            de: 'Lass zwei Leute drüberlesen, die nichts mit der Branche zu tun haben. Was sie nicht verstehen, versteht die Bank auch nicht.',
            en: 'Have two people read it who have nothing to do with the industry. What they do not understand, the bank will not understand either.',
          },
        ],
        farewell: {
          de: 'Joé hat Businessplan und Finanzplan für FareWell auf Deutsch und Französisch geschrieben und teilt Struktur und Zahlenlogik gern mit dir.',
          en: 'Joé wrote the business and financial plan for FareWell in German and French and is happy to share the structure and the logic behind the numbers.',
        },
        links: [
          { label: { de: 'Vorlagen der Unternehmenswerkstatt', en: 'Unternehmenswerkstatt templates' }, url: 'https://www.uwd.de/group/p49198' },
        ],
      },
      {
        id: 'foerderung',
        weight: 'empfohlen',
        title: { de: 'Förderung prüfen, bevor du dich anmeldest', en: 'Check funding before you register' },
        summary: {
          de: 'Viele Zuschüsse müssen vor der Anmeldung oder vor der ersten Ausgabe beantragt sein. Danach ist das Geld weg.',
          en: 'Many grants must be applied for before registration or before the first expense. Afterwards the money is gone.',
        },
        details: [
          {
            de: 'Gründungszuschuss der Agentur für Arbeit: nur aus der Arbeitslosigkeit heraus, mit noch mindestens 150 Tagen Restanspruch und einer Tragfähigkeitsbescheinigung von IHK oder HWK.',
            en: 'The start-up grant of the employment agency: only out of unemployment, with at least 150 days of remaining entitlement and a viability certificate from the chamber.',
          },
          {
            de: 'Im Finanzplan für den Gründungszuschuss den Zuschuss selbst nicht als Einnahme eintragen. Das hat mir die Beraterin ausdrücklich gesagt.',
            en: 'In the financial plan for the start-up grant, do not list the grant itself as income. The adviser told me that explicitly.',
          },
          {
            de: 'LfA Förderbank Bayern: Startkredite, Beratungssprechtag in der IHK. Bayern Innovativ: Zuschüsse und Programme, sitzt im selben Haus.',
            en: 'LfA Förderbank Bayern: start-up loans, consultation days at the chamber of commerce. Bayern Innovativ: grants and programmes, in the same building.',
          },
          {
            de: 'Faustregel für alle Programme: erst Antrag, dann Kauf oder Start. Rückwirkend gibt es nichts.',
            en: 'Rule of thumb for every programme: apply first, buy or start second. Nothing is paid retroactively.',
          },
        ],
        joe: {
          de: 'Der produktivste Termin meiner ganzen Gründung war die Gründungsberatung der IHK am Hauptmarkt. Eine Stunde, und ich wusste, welche Stelle für welche Förderung zuständig ist. Die Sprechtage mit der LfA laufen über dieselbe Adresse.',
          en: 'The most productive appointment of my whole founding was the start-up consultation at the chamber of commerce on Hauptmarkt. One hour, and I knew which office handles which funding. The LfA consultation days run through the same address.',
        },
        contacts: [IHK, LFA, BAYERN_INNOVATIV],
        links: [
          { label: { de: 'Förderdatenbank des Bundes', en: 'Federal funding database' }, url: 'https://www.foerderdatenbank.de/' },
        ],
      },
      {
        id: 'agentur-fuer-arbeit',
        weight: 'optional',
        title: { de: 'Agentur für Arbeit: Beratung und Gründungszuschuss', en: 'Employment agency: advice and start-up grant' },
        summary: {
          de: 'Nur, wenn du aus einer Anstellung kommst. Dann aber früh, denn der Weg hat Fristen.',
          en: 'Only if you come from employment. But then early, because this path has deadlines.',
        },
        details: [
          {
            de: 'Erst die Leistungsberatung (Arbeitslosengeld), dann ein eigener Termin zu arbeitsrechtlichen Themen und Gründungszuschuss. Der Terminvorschlag kommt per Brief.',
            en: 'First the benefits consultation (unemployment pay), then a separate appointment on employment-law topics and the start-up grant. The appointment proposal arrives by post.',
          },
          {
            de: 'Danach alle zwei Wochen Fortschritt zeigen und das Eröffnungsdatum genau nennen. Leg dir dafür Kalender-Erinnerungen an.',
            en: 'Afterwards show progress every two weeks and name the opening date precisely. Set calendar reminders for it.',
          },
          {
            de: 'Lebenslauf und Anschreiben in das Portal der Agentur hochladen und Bescheid geben, sonst hängt der Vorgang.',
            en: 'Upload your CV and cover letter to the agency portal and let them know, otherwise the file stalls.',
          },
        ],
        joe: {
          de: 'Der Brief mit dem Terminvorschlag kam nicht von allein. Ich habe nach einer Woche angerufen, dann ging es. Frag mich nach dem Namen der Beraterin, die sich mit Gründungen auskennt.',
          en: 'The letter with the appointment proposal did not arrive on its own. I called after a week, then it moved. Ask me for the name of the adviser who knows start-ups.',
        },
        contacts: [AFA],
      },
    ],
  },

  // ------------------------------------------------------------------ 1
  {
    id: 'anmelden',
    index: '02',
    tag: { de: 'Ämter', en: 'Offices' },
    title: { de: 'Anmelden', en: 'Register' },
    lead: {
      de: 'Der Papierteil. In dieser Reihenfolge, damit jede Stelle die Nummer der vorherigen schon hat.',
      en: 'The paperwork. In this order, so every office already has the number from the previous one.',
    },
    steps: [
      {
        id: 'gewerbe',
        weight: 'pflicht',
        professions: ALL_GEWERBE,
        title: { de: 'Gewerbe anmelden', en: 'Register the trade' },
        summary: {
          de: 'Online oder vor Ort beim Gewerbeamt. Danach informieren sich Finanzamt, Kammer und Berufsgenossenschaft von selbst, du bekommst trotzdem von jedem Post.',
          en: 'Online or in person at the trade office. Afterwards the tax office, chamber and accident insurer are notified automatically, you still get mail from each of them.',
        },
        details: [
          {
            de: 'Als Tätigkeit reicht eine normale Beschreibung, zum Beispiel „kosmetische Dienstleistungen, apparative Haarentfernung". Nicht zu detailliert werden.',
            en: 'A plain description of the activity is enough, for example "cosmetic services, device-based hair removal". Do not go into too much detail.',
          },
          {
            de: 'Betriebsstätte ist die Adresse von FareWell. Wenn du deine Privatadresse angibst, schreib dazu, dass dort nur die Verwaltung stattfindet.',
            en: 'The place of business is the FareWell address. If you enter your private address, add that only administration happens there.',
          },
          {
            de: 'Kosmetik braucht keine Erlaubnis bei der Anmeldung. Bei Fragen antwortet das Amt per E-Mail schnell.',
            en: 'Cosmetics needs no permit at registration. For questions the office answers quickly by email.',
          },
        ],
        joe: {
          de: 'Die Sache mit der Adresse habe ich am Telefon gelernt: Ich hatte den Salon noch nicht und wollte mein Nebengewerbe trotzdem anmelden. „Nur Verwaltung" dazuschreiben, fertig.',
          en: 'The address thing I learned on the phone: I did not have the salon yet and still wanted to register my side business. Add "administration only", done.',
        },
        contacts: [GEWERBEAMT],
      },
      {
        id: 'finanzamt',
        weight: 'pflicht',
        title: { de: 'Finanzamt: Fragebogen zur steuerlichen Erfassung', en: 'Tax office: registration questionnaire' },
        summary: {
          de: 'Innerhalb eines Monats nach Start, nur noch elektronisch über ELSTER. Daraus kommt deine Steuernummer, ohne die du keine Rechnung schreiben kannst.',
          en: 'Within one month of starting, electronically via ELSTER only. It produces your tax number, without which you cannot write an invoice.',
        },
        details: [
          {
            de: 'Freie Berufe starten hier, ohne Gewerbeanmeldung davor.',
            en: 'Liberal professions start here, with no trade registration before.',
          },
          {
            de: 'Kleinunternehmerregelung: bis 25.000 € Umsatz im Vorjahr und 100.000 € im laufenden Jahr keine Umsatzsteuer, aber auch kein Vorsteuerabzug. Für den Start meist sinnvoll, mit Steuerberater:in besprechen.',
            en: 'Small-business rule: up to 25,000 € turnover last year and 100,000 € this year no VAT, but no input tax deduction either. Usually sensible at the start, discuss with a tax adviser.',
          },
          {
            de: 'ELSTER-Zertifikat früh beantragen, die Freischaltung kommt per Brief und dauert ein bis zwei Wochen.',
            en: 'Apply for the ELSTER certificate early, the activation code comes by post and takes one to two weeks.',
          },
          {
            de: 'Gleich mit erledigen: deine IBAN bei „Mein ELSTER" hinterlegen. Erstattungen und Hilfen kommen sonst nicht an.',
            en: 'Do at the same time: store your IBAN in "Mein ELSTER". Refunds and aid payments cannot arrive otherwise.',
          },
        ],
        joe: {
          de: 'Beim Finanzamt Nürnberg habe ich drei Nummern durchprobiert. Die, die oben steht, war die richtige für Neuaufnahme und Umsatzsteuer. Vor 12:00 anrufen.',
          en: 'At the Nuremberg tax office I tried three numbers. The one above was the right one for new registrations and VAT. Call before noon.',
        },
        contacts: [FINANZAMT],
        links: [{ label: { de: 'Mein ELSTER', en: 'Mein ELSTER' }, url: 'https://www.elster.de/' }],
      },
      {
        id: 'ust-id',
        weight: 'optional',
        title: { de: 'Umsatzsteuer-Identifikationsnummer', en: 'VAT identification number' },
        summary: {
          de: 'Brauchst du, sobald du Software oder Material im Ausland kaufst, zum Beispiel ein KI-Abo aus den USA oder Geräte aus der Schweiz.',
          en: 'Needed as soon as you buy software or supplies abroad, for example an AI subscription from the US or devices from Switzerland.',
        },
        details: [
          {
            de: 'Online beim Bundeszentralamt für Steuern beantragen, mit deiner Steuernummer. Kommt per Post, ein bis zwei Wochen.',
            en: 'Apply online at the Federal Central Tax Office with your tax number. Arrives by post, one to two weeks.',
          },
          {
            de: 'Bei ausländischen Anbietern die Nummer im Konto hinterlegen. Dann rechnen sie ohne Mehrwertsteuer ab (Reverse Charge) und du meldest sie in der Voranmeldung.',
            en: 'Store the number in your account with foreign providers. They then invoice without VAT (reverse charge) and you declare it in your advance return.',
          },
        ],
        joe: {
          de: 'Ich habe es zuerst per Brief probiert und eine Fehlermeldung bekommen. Dann wochenlang gewartet, dann angerufen. Nimm gleich das Online-Formular.',
          en: 'I tried by letter first and got an error message. Then waited for weeks, then called. Use the online form straight away.',
        },
        links: [{ label: { de: 'BZSt: USt-IdNr. beantragen', en: 'BZSt: apply for a VAT ID' }, url: 'https://www.bzst.de/' }],
      },
      {
        id: 'kammer',
        weight: 'pflicht',
        professions: ['kosmetik', 'massage'],
        title: { de: 'Handwerkskammer: Mitgliedschaft bestätigen und nutzen', en: 'Chamber of crafts: confirm membership and use it' },
        summary: {
          de: 'Die Mitgliedschaft kommt mit der Gewerbeanmeldung. Ein Anruf bestätigt, dass alles angekommen ist, und öffnet die Angebote, für die du sowieso zahlst.',
          en: 'Membership comes with the trade registration. One call confirms everything arrived and opens the services you are paying for anyway.',
        },
        details: [
          {
            de: 'Gilt für Kosmetik. Wellness-Massage als Gewerbe landet bei der IHK, freie Berufe haben keine Kammer.',
            en: 'Applies to cosmetics. Wellness massage as a trade goes to the chamber of commerce, liberal professions have no chamber.',
          },
          {
            de: 'Nützlich: kostenlose Unternehmensberatung, Rahmenverträge für Strom, Rabatte auf Zeiterfassung, Musterverträge, Innungen und Fachschulen, wenn du später Leute suchst.',
            en: 'Useful: free business consulting, framework contracts for electricity, discounts on time tracking, template contracts, guilds and trade schools if you later look for staff.',
          },
        ],
        joe: {
          de: 'Ich habe mich online registriert und dann angerufen, ob es geklappt hat. Hatte es nicht ganz. Der Anruf hat es gelöst. Die Unternehmensberatung der HWK hat mir später den Stromvertrag vermittelt.',
          en: 'I registered online and then called to check whether it had worked. It had not, quite. The call fixed it. The chamber\'s business consulting later brokered my electricity contract.',
        },
        contacts: [HWK, HWK_BERATUNG],
      },
      {
        id: 'berufsgenossenschaft',
        weight: 'pflicht',
        title: { de: 'Berufsgenossenschaft anmelden', en: 'Register with the accident insurer' },
        summary: {
          de: 'Innerhalb einer Woche nach Start, auch als Solo-Selbständige:r. Ob du dich selbst versichern musst oder freiwillig kannst, sagt dir die Kasse am Telefon.',
          en: 'Within one week of starting, also as a solo freelancer. Whether you must insure yourself or may do so voluntarily, the insurer tells you on the phone.',
        },
        details: [
          {
            de: 'Kosmetik, Massage, Physiotherapie und ärztliche Tätigkeit: BGW. Yoga, Tanz und Unterricht: in der Regel VBG. Im Zweifel bei einer anfragen, sie leiten weiter.',
            en: 'Cosmetics, massage, physiotherapy and medical work: BGW. Yoga, dance and teaching: usually VBG. When in doubt ask one, they forward you.',
          },
          {
            de: 'Frag beim selben Anruf nach der Schulung zur Arbeitssicherheit. Sie ist kostenlos und wird spätestens dann Pflicht, wenn du jemanden einstellst.',
            en: 'In the same call ask about the occupational safety training. It is free and becomes mandatory at the latest when you hire someone.',
          },
        ],
        joe: {
          de: 'Mein Anruf bei der BGW war kurz: „Muss ich noch etwas machen?" Antwort: nein, aber die Schulung wäre gut. Ich habe sie gebucht.',
          en: 'My call to the BGW was short: "Do I need to do anything else?" Answer: no, but the training would be good. I booked it.',
        },
        contacts: [BGW, VBG],
      },
      {
        id: 'sozialversicherung',
        weight: 'pflicht',
        title: { de: 'Kranken- und Rentenversicherung klären', en: 'Settle health and pension insurance' },
        summary: {
          de: 'Der teuerste Posten im ersten Jahr und der, den alle am längsten aufschieben. Ein Anruf bei der Krankenkasse und einer bei der Rentenversicherung.',
          en: 'The most expensive item in year one, and the one everyone postpones longest. One call to your health insurer and one to the pension insurance.',
        },
        details: [
          {
            de: 'Gesetzlich freiwillig versichert: Beitrag nach Einkommen, am Anfang oft der Mindestbeitrag. Privat: günstiger in jungen Jahren, dafür kaum ein Weg zurück. Entscheide es nicht nach dem ersten Monat.',
            en: 'Voluntary statutory cover: contribution based on income, often the minimum at first. Private: cheaper when young, but almost no way back. Do not decide it based on your first month.',
          },
          {
            de: 'Rentenversicherungspflicht trifft selbständige Lehrer:innen (Yoga, Tanz, Kurse) fast immer, und Pflege- und Heilberufe, die überwiegend auf ärztliche Verordnung arbeiten. Innerhalb von drei Monaten melden, sonst gibt es Nachzahlungen.',
            en: 'Mandatory pension insurance almost always applies to self-employed teachers (yoga, dance, classes), and to health professions working mainly on medical prescription. Report within three months, otherwise back payments follow.',
          },
          {
            de: 'Das kostenlose Servicetelefon der Rentenversicherung beantwortet die Frage „bin ich pflichtig?" verbindlich, wenn du deine Tätigkeit genau beschreibst.',
            en: 'The pension insurance\'s free service line answers "am I liable?" reliably if you describe your activity precisely.',
          },
        ],
        contacts: [DRV],
      },
      {
        id: 'hygiene',
        weight: 'empfohlen',
        professions: ['kosmetik', 'massage', 'physio', 'medizin'],
        title: { de: 'Gesundheitsamt und Hygieneplan', en: 'Health office and hygiene plan' },
        summary: {
          de: 'In Bayern brauchst du für Kosmetik keine Genehmigung vom Gesundheitsamt. Einen Hygieneplan solltest du trotzdem haben, und bei FareWell gibt es schon einen.',
          en: 'In Bavaria cosmetics needs no permit from the health office. You should still have a hygiene plan, and FareWell already has one.',
        },
        details: [
          {
            de: 'Maßstab ist das Merkblatt des Bayerischen Landesamts für Gesundheit für Tattoo- und Piercingstudios: Flächen, Instrumente, Hände, Desinfektionsmittel nur aus der VAH-Liste.',
            en: 'The benchmark is the Bavarian health authority\'s leaflet for tattoo and piercing studios: surfaces, instruments, hands, disinfectants from the VAH list only.',
          },
          {
            de: 'Das Gesundheitsamt kann unangekündigt kontrollieren. Ein geschriebener Plan und dokumentierte Einweisungen sind dann alles, was sie sehen wollen.',
            en: 'The health office may inspect unannounced. A written plan and documented instructions are then all they want to see.',
          },
        ],
        joe: {
          de: 'Ich war mehrfach am Telefon mit dem Gesundheitsamt und habe wenig Konkretes bekommen, außer: „Halten Sie sich an das Tätowierer-Merkblatt." Das habe ich getan und daraus den FareWell-Hygieneplan geschrieben. Du übernimmst ihn einfach.',
          en: 'I was on the phone with the health office several times and got little concrete guidance, except: "Follow the tattoo studio leaflet." I did, and wrote the FareWell hygiene plan from it. You simply adopt it.',
        },
        farewell: {
          de: 'Hygieneplan, Desinfektionsmittel und die Einweisung in den Raum bekommst du von uns. Du unterschreibst die Einweisung, das ist deine Dokumentation.',
          en: 'Hygiene plan, disinfectants and the induction to the room come from us. You sign the induction, that is your documentation.',
        },
        contacts: [GESUNDHEITSAMT],
        links: [
          {
            label: { de: 'LGL-Merkblatt für Tattoo- und Piercingstudios', en: 'LGL leaflet for tattoo and piercing studios' },
            url: 'https://www.lgl.bayern.de/downloads/gesundheit/hygiene/doc/merkblatt_tattoo_piercingstudios_betreiber.pdf',
          },
        ],
      },
      {
        id: 'nisv',
        weight: 'pflicht',
        professions: ['kosmetik'],
        title: { de: 'NiSV: Fachkunde und Anzeige für Laser und IPL', en: 'NiSV: certificate and notification for laser and IPL' },
        summary: {
          de: 'Wer Laser oder IPL bedient, braucht die NiSV-Fachkunde und muss die Tätigkeit zwei Wochen vor Beginn anzeigen. Ohne Zertifikat läuft bei uns kein Gerät.',
          en: 'Anyone operating laser or IPL needs the NiSV certificate and must notify the authority two weeks before starting. Without the certificate no device runs here.',
        },
        details: [
          {
            de: 'Fachkunde „optische Strahlung" bei einem anerkannten Anbieter, mehrere Tage Kurs plus Prüfung. Zertifikat aufbewahren, es wird bei der Anzeige verlangt.',
            en: 'Certificate for "optical radiation" from a recognised provider, several days of course plus exam. Keep the certificate, it is required for the notification.',
          },
          {
            de: 'Anzeige beim Gewerbeaufsichtsamt der Regierung von Mittelfranken, spätestens zwei Wochen vor der ersten Behandlung. Geräte, Fachkunde und Betriebsstätte angeben.',
            en: 'Notification to the trade supervisory office of the Government of Middle Franconia, at least two weeks before the first treatment. State devices, certificate and place of business.',
          },
          {
            de: 'Elektrolyse fällt nicht unter die NiSV. Wer nur Nadelepilation macht, braucht die Fachkunde nicht.',
            en: 'Electrolysis is not covered by the NiSV. If you only do needle epilation, you do not need the certificate.',
          },
        ],
        farewell: {
          de: 'Die Geräte, die Geräteeinweisung und der Laserschutz laufen über FareWell. Deine Fachkunde bringst du mit, oder wir planen den Kurs vor deinem Start ein.',
          en: 'The devices, the device training and laser safety run through FareWell. You bring your certificate, or we schedule the course before your start.',
        },
        contacts: [GAA],
        links: [{ label: { de: 'NiSV-Kurse und Infos', en: 'NiSV courses and info' }, url: 'https://nisv.eu/' }],
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: 'absichern',
    index: '03',
    tag: { de: 'Sicherheit', en: 'Safety' },
    title: { de: 'Absichern: Versicherung, Konto, Verträge', en: 'Secure yourself: insurance, account, contracts' },
    lead: {
      de: 'Nichts davon bringt Kund:innen. Alles davon entscheidet, ob ein schlechter Tag dich das Geschäft kostet.',
      en: 'None of this brings clients. All of it decides whether one bad day costs you the business.',
    },
    steps: [
      {
        id: 'haftpflicht',
        weight: 'pflicht',
        title: { de: 'Berufs- und Betriebshaftpflicht', en: 'Professional and business liability insurance' },
        summary: {
          de: 'Vor der ersten Kundin, nicht danach. Für Behandlungen am Menschen ist das die eine Versicherung, über die es keine Diskussion gibt.',
          en: 'Before the first client, not after. For treatments on people this is the one insurance that is not up for debate.',
        },
        details: [
          {
            de: 'Achte darauf, dass deine konkrete Tätigkeit im Vertrag steht: Laser, Microneedling, Massage, Unterricht. Eine allgemeine Kosmetik-Police deckt nicht automatisch apparative Behandlungen.',
            en: 'Make sure your specific activity is named in the policy: laser, microneedling, massage, teaching. A general cosmetics policy does not automatically cover device-based treatments.',
          },
          {
            de: 'Rechtsschutz ist optional, aber günstig, und macht den Anruf beim Anwalt zur Routine statt zur Kostenfrage.',
            en: 'Legal expenses insurance is optional but cheap, and turns a call to a lawyer into routine instead of a cost question.',
          },
          {
            de: 'Ärzt:innen: die Berufshaftpflicht muss ästhetische Eingriffe ausdrücklich einschließen, viele Praxis-Policen tun das nicht.',
            en: 'Physicians: professional liability must explicitly include aesthetic procedures, many practice policies do not.',
          },
        ],
        joe: {
          de: 'Ehrlich: Mein Vergleich zwischen Betriebshaftpflicht und Vermögensschadenhaftpflicht hat länger gedauert, als er sollte. Frag mich, wo ich gelandet bin und wen ich dafür angerufen habe.',
          en: 'Honestly: my comparison between business liability and financial loss liability took longer than it should have. Ask me where I ended up and who I called for it.',
        },
      },
      {
        id: 'konto',
        weight: 'empfohlen',
        title: { de: 'Geschäftskonto und Steuerrücklage', en: 'Business account and tax reserve' },
        summary: {
          de: 'Ein eigenes Konto ab Tag eins. Nicht, weil es Pflicht wäre, sondern weil sonst deine Buchhaltung aus Kontoauszügen mit Supermarkt-Einkäufen besteht.',
          en: 'A separate account from day one. Not because it is mandatory, but because otherwise your bookkeeping consists of bank statements with grocery shopping.',
        },
        details: [
          {
            de: 'Ein Konto reicht. Wenn du zwei willst: eines für Miete, Versicherungen und große Beträge, ein günstiges Online-Konto mit Karte für den Alltag.',
            en: 'One account is enough. If you want two: one for rent, insurance and large amounts, a cheap online account with a card for daily use.',
          },
          {
            de: 'Von jeder Einnahme etwa 30 % auf ein Unterkonto schieben. Die erste Steuervorauszahlung kommt ohne Vorwarnung.',
            en: 'Move about 30% of every income to a sub-account. The first advance tax payment comes without warning.',
          },
          {
            de: 'Der Kredit für Geräte oder Umbau kommt am ehesten von der Hausbank, mit dem Finanzplan aus Etappe eins. Vergleich vorher drei Banken am Telefon.',
            en: 'A loan for equipment or renovation most likely comes from your main bank, with the financial plan from stage one. Compare three banks by phone first.',
          },
        ],
        joe: {
          de: 'Ich habe fünf Banken angerufen, eine Tabelle gemacht und bin bei einer Filialbank für das Große und einem Online-Konto für den Alltag gelandet. Die Tabelle gebe ich dir gern.',
          en: 'I called five banks, made a spreadsheet and ended up with a branch bank for the big things and an online account for daily use. Happy to share the spreadsheet.',
        },
      },
      {
        id: 'buchhaltung',
        weight: 'pflicht',
        title: { de: 'Rechnungen und Buchhaltung', en: 'Invoices and bookkeeping' },
        summary: {
          de: 'Jede Rechnung braucht dieselben Pflichtangaben, jeder Beleg gehört als PDF in einen Ordner mit System. Ein Buchhaltungsprogramm nimmt dir beides ab.',
          en: 'Every invoice needs the same mandatory details, every receipt belongs as a PDF in a folder with a system. Bookkeeping software takes care of both.',
        },
        details: [
          {
            de: 'Pflichtangaben: dein Name und deine Adresse, Steuernummer oder USt-IdNr., fortlaufende Rechnungsnummer, Datum, Leistung, Zeitraum, Betrag, Steuersatz oder der Hinweis auf die Kleinunternehmerregelung.',
            en: 'Mandatory details: your name and address, tax number or VAT ID, sequential invoice number, date, service, period, amount, tax rate or the note on the small-business rule.',
          },
          {
            de: 'Seit 2025 musst du E-Rechnungen empfangen können (ein E-Mail-Postfach reicht). Ausstellen an Privatkund:innen bleibt wie bisher.',
            en: 'Since 2025 you must be able to receive e-invoices (an email inbox is enough). Issuing to private clients stays as before.',
          },
          {
            de: 'Belege im Original als PDF aufbewahren, nicht als Screenshot. Ordnerlogik: Jahr, Kategorie, Datum im Dateinamen.',
            en: 'Keep receipts as original PDFs, not screenshots. Folder logic: year, category, date in the file name.',
          },
          {
            de: 'Software-Abos auf den Firmennamen laufen lassen, damit der Beleg absetzbar ist.',
            en: 'Run software subscriptions in the business name so the receipt is deductible.',
          },
        ],
        joe: {
          de: 'Meine erste Rechnung habe ich mit einem YouTube-Video und einer Vorlage geschrieben, dann auf ein Programm gewechselt. Der Wechsel war der bessere Teil. Die monatliche Belegsuche war vorher der schlechtere.',
          en: 'I wrote my first invoice with a YouTube video and a template, then switched to software. The switch was the better part. The monthly receipt hunt before it was the worse part.',
        },
        farewell: {
          de: 'Deine Kund:innen zahlen bei FareWell über Salonkee oder an der Kasse. Die Abrechnung zwischen uns kommt einmal im Monat als Aufstellung, du schreibst eine Rechnung dagegen. Bei kostenintensiven Angeboten zählt dabei der Gewinn nach Material, Kosten und Steuern, und unter 300 € Anteil für FareWell behältst du alles. Ein Abendessen statt einer Überweisung ist dann ausdrücklich erlaubt.',
          en: 'Your clients pay at FareWell via Salonkee or at the till. The settlement between us comes once a month as a statement, you write one invoice against it. For cost-heavy offers the basis is profit after materials, costs and taxes, and below 300 € of share for FareWell you keep everything. A dinner instead of a bank transfer is explicitly allowed then.',
        },
      },
      {
        id: 'steuerberatung',
        weight: 'empfohlen',
        title: { de: 'Steuerberater:in finden', en: 'Find a tax adviser' },
        summary: {
          de: 'Für Solo-Selbständige oft günstiger als gedacht. Mindestens ein Termin am Anfang, in dem du alle Fragen des ersten Jahres auf einmal stellst.',
          en: 'For solo freelancers often cheaper than expected. At least one appointment at the start where you ask all the first-year questions at once.',
        },
        details: [
          {
            de: 'Frag in deinem Netzwerk nach einer Empfehlung, nicht bei Google. Eine Kanzlei, die kleine Dienstleister kennt, spart dir mehr, als sie kostet.',
            en: 'Ask your network for a recommendation, not Google. A firm that knows small service providers saves you more than it costs.',
          },
          {
            de: 'Fragen für den ersten Termin: Kleinunternehmer ja oder nein, Voranmeldungsrhythmus, welche Belege, was ist absetzbar, wann kommt die erste Vorauszahlung.',
            en: 'Questions for the first appointment: small-business rule yes or no, advance return rhythm, which receipts, what is deductible, when the first prepayment is due.',
          },
        ],
        joe: {
          de: 'Ich habe meine Steuerberaterin über eine Empfehlung gefunden und beim ersten Termin eine Liste mit zwanzig Fragen mitgebracht. Frag mich nach dem Kontakt.',
          en: 'I found my tax adviser through a recommendation and brought a list of twenty questions to the first meeting. Ask me for the contact.',
        },
      },
      {
        id: 'vertraege',
        weight: 'pflicht',
        title: { de: 'Verträge, Einwilligungen, Datenschutz', en: 'Contracts, consent forms, data protection' },
        summary: {
          de: 'Kooperationsvertrag mit FareWell, Einverständniserklärung deiner Kund:innen, AGB und der Umgang mit Gesundheitsdaten. Einmal sauber aufsetzen, dann jahrelang Ruhe.',
          en: 'Cooperation agreement with FareWell, your clients\' consent form, terms and conditions, and how you handle health data. Set it up cleanly once, then have peace for years.',
        },
        details: [
          {
            de: 'Einverständniserklärung mit Anamnese und Haftungsausschluss für jede Behandlung, unterschrieben, bevor du anfängst. Bei uns digital auf dem Tablet.',
            en: 'Consent form with medical history and liability waiver for every treatment, signed before you begin. Here it is digital on the tablet.',
          },
          {
            de: 'Anamnesen sind Gesundheitsdaten: nur du hast Zugriff, Aufbewahrung nach Frist, Löschung dokumentiert. Das gehört in ein Verzeichnis der Verarbeitungstätigkeiten, eine Seite reicht.',
            en: 'Medical histories are health data: only you have access, retention by deadline, deletion documented. That belongs in a record of processing activities, one page is enough.',
          },
          {
            de: 'AGB mit Absageregel. Am Anfang kulant, aber die Regel steht schon drin, damit du sie später ohne Diskussion anwenden kannst.',
            en: 'Terms and conditions with a cancellation rule. Lenient at the start, but the rule is already in there so you can apply it later without debate.',
          },
        ],
        joe: {
          de: 'Ich habe alle meine Vorlagen von einer Anwältin prüfen lassen und sie dafür bezahlt, auch wenn sie es umsonst angeboten hätte. Das war die richtige Entscheidung. Du bekommst die geprüften Vorlagen von mir, nur dein Name muss rein.',
          en: 'I had all my templates checked by a lawyer and paid her for it, even though she offered to do it for free. That was the right call. You get the checked templates from me, only your name goes in.',
        },
        farewell: {
          de: 'Kooperationsvertrag, Einverständniserklärung, AGB-Vorlage und Datenschutztext liegen fertig bei FareWell.',
          en: 'Cooperation agreement, consent form, terms template and data protection text are ready at FareWell.',
        },
      },
      {
        id: 'scheinselbstaendigkeit',
        weight: 'pflicht',
        title: { de: 'Scheinselbständigkeit vermeiden', en: 'Avoid false self-employment' },
        summary: {
          de: 'Der Grund, warum bei FareWell alles dir gehört: eigene Preise, eigene Kund:innen, eigene Werkzeuge, eigener Kalender. So bleibt dein Status sauber, für dich und für uns.',
          en: 'The reason everything at FareWell belongs to you: your own prices, clients, tools and calendar. That keeps your status clean, for you and for us.',
        },
        details: [
          {
            de: 'Du entscheidest, wann du arbeitest, was du anbietest und was es kostet. FareWell gibt keine Anweisungen, sondern stellt Raum und Werkzeuge.',
            en: 'You decide when you work, what you offer and what it costs. FareWell gives no instructions, it provides the room and the tools.',
          },
          {
            de: 'Mehrere Auftraggeber oder eigene Kund:innen, eigenes Google-Profil, eigene Rechnung an uns statt Lohnzettel von uns.',
            en: 'Several clients or your own customers, your own Google profile, your own invoice to us instead of a payslip from us.',
          },
          {
            de: 'Wer sicher sein will, kann bei der Rentenversicherung ein Statusfeststellungsverfahren beantragen. Kostenlos, dauert einige Wochen, gibt Klarheit für beide Seiten.',
            en: 'If you want certainty, you can request a status determination from the pension insurance. Free, takes a few weeks, gives clarity for both sides.',
          },
        ],
        contacts: [DRV],
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: 'sichtbar',
    index: '04',
    tag: { de: 'Mit Joé', en: 'With Joé' },
    title: { de: 'Sichtbar werden', en: 'Become visible' },
    lead: {
      de: 'Der Teil, in dem FareWell am meisten mitarbeitet. Alles, was hier entsteht, läuft unter deinem Namen und gehört dir.',
      en: 'The part where FareWell contributes most. Everything created here runs under your name and belongs to you.',
    },
    steps: [
      {
        id: 'leistungen-preise',
        weight: 'pflicht',
        title: { de: 'Leistungsliste und Preise festlegen', en: 'Define your service list and prices' },
        summary: {
          de: 'Eine Liste: Name der Behandlung, Dauer, Preis, zwei Sätze Beschreibung. Daraus baut Joé deine Seite und deinen Salonkee-Kalender.',
          en: 'One list: treatment name, duration, price, two sentences of description. From it Joé builds your page and your Salonkee calendar.',
        },
        details: [
          {
            de: 'Was du anbietest, wann und zu welchem Preis, entscheidest du. FareWell schlägt höchstens vor, was zu dem passt, was es im Studio schon gibt, damit ihr euch ergänzt statt zu konkurrieren.',
            en: 'What you offer, when and at what price is your decision. FareWell at most suggests what fits what the studio already has, so you complement each other instead of competing.',
          },
          {
            de: 'Ruf drei Mitbewerber:innen als Kund:in an und frag nach Preis, Dauer und nächstem Termin. Was sie nicht beantworten können, ist deine Lücke.',
            en: 'Call three competitors as a client and ask for price, duration and next available slot. What they cannot answer is your gap.',
          },
          {
            de: 'Wenn du mit einem niedrigeren Preis startest, nenn ihn von Anfang an Eröffnungsangebot mit Enddatum. Eine stille Preiserhöhung später verzeihen Kund:innen nicht.',
            en: 'If you start with a lower price, call it an opening offer with an end date from day one. A quiet price rise later is something clients do not forgive.',
          },
          {
            de: 'Runde Zahlen, die sich nicht in einen Minutenpreis umrechnen lassen. 15 € pro 15 Minuten liest jeder als 1 € pro Minute.',
            en: 'Round numbers that do not translate into a per-minute price. 15 € per 15 minutes reads as 1 € per minute to everyone.',
          },
        ],
        joe: {
          de: 'Mein Konkurrenzcheck war ein Nachmittag am Telefon. Keiner konnte sagen, was eine Behandlung kostet oder wie lange sie dauert. Daraus ist der Zeit- und Preisrechner auf unserer Website geworden.',
          en: 'My competitor check was one afternoon on the phone. Nobody could say what a treatment costs or how long it takes. That turned into the time and price calculator on our website.',
        },
      },
      {
        id: 'google-profil',
        weight: 'pflicht',
        title: { de: 'Dein eigenes Google-Unternehmensprofil', en: 'Your own Google Business Profile' },
        summary: {
          de: 'In deinem Namen, mit der Adresse von FareWell. Die Bewertungen darauf sammelst du, und sie gehen mit dir, wohin du auch gehst.',
          en: 'In your name, at the FareWell address. The reviews on it are yours, and they go with you wherever you go.',
        },
        details: [
          {
            de: 'Anlegen mit deinem eigenen Google-Konto, nicht mit dem von FareWell. Kategorie nach deinem Beruf, Öffnungszeiten nach deinen Zeiten im Studio.',
            en: 'Create it with your own Google account, not FareWell\'s. Category by your profession, opening hours by your hours at the studio.',
          },
          {
            de: 'Nach jeder guten Behandlung um eine Bewertung bitten, mit QR-Code oder Link. Zehn Bewertungen im ersten Monat sind realistisch und ändern alles.',
            en: 'Ask for a review after every good treatment, with a QR code or link. Ten reviews in the first month is realistic and changes everything.',
          },
          {
            de: 'Verifizierung läuft per Video oder Postkarte an die Studioadresse. Sag Joé Bescheid, er fängt die Karte ab.',
            en: 'Verification runs by video or a postcard to the studio address. Tell Joé, he catches the card.',
          },
        ],
        farewell: {
          de: 'Joé richtet das Profil mit dir ein, verknüpft es mit deiner Seite und deinen Social-Media-Konten und zeigt dir, was die Zahlen darin bedeuten.',
          en: 'Joé sets up the profile with you, links it to your page and social accounts and shows you what the numbers in it mean.',
        },
        links: [{ label: { de: 'Google Unternehmensprofil', en: 'Google Business Profile' }, url: 'https://www.google.com/business/' }],
      },
      {
        id: 'seite-buchung',
        weight: 'pflicht',
        title: { de: 'Deine Website und die Online-Buchung', en: 'Your website and online booking' },
        summary: {
          de: 'Eine eigene Seite auf farewell.salon oder eine eigene Website unter deiner Domain, Joé baut beides mit dir: zweisprachig, mit Suchmaschinenoptimierung, plus dein Kalender in Salonkee. Texte und Bilder sind deine.',
          en: 'Your own page on farewell.salon or your own website under your own domain, Joé builds either with you: bilingual, search-engine optimised, plus your calendar in Salonkee. Texts and images are yours.',
        },
        details: [
          {
            de: 'Eine eigene Website ist oft die bessere Wahl: Mehrere Websites, die aufeinander verweisen, bringen bei Google allen mehr Besucher:innen. Deine Seite stärkt unsere und umgekehrt.',
            en: 'A separate website is often the better choice: several websites linking to each other bring everyone more visitors on Google. Your site strengthens ours and vice versa.',
          },
          {
            de: 'Du lieferst: Leistungsliste, drei bis fünf Fotos von dir und deiner Arbeit, einen Absatz über dich. Den Rest schreibt Joé mit dir zusammen.',
            en: 'You deliver: the service list, three to five photos of you and your work, a paragraph about yourself. Joé writes the rest with you.',
          },
          {
            de: 'Salonkee: eigener Kalender, eigene Leistungen, Buchungslink, den du überall verwenden kannst. Zahlungen laufen darüber oder an der Kasse.',
            en: 'Salonkee: your own calendar, your own services, a booking link you can use everywhere. Payments run through it or at the till.',
          },
          {
            de: 'Startest du mit einer Seite auf farewell.salon und willst später eine eigene Domain, ziehen die Inhalte mit. Joé hilft beim Umzug, das ist Teil des Deals.',
            en: 'If you start with a page on farewell.salon and later want your own domain, the content moves with you. Joé helps with the move, that is part of the deal.',
          },
        ],
        joe: {
          de: 'Diese Website habe ich selbst gebaut, von der ersten Zeile bis zur Suchmaschinenoptimierung. Deine Seite bekommt denselben Unterbau, und du musst dafür nichts lernen, außer mir zu sagen, was du anbietest.',
          en: 'I built this website myself, from the first line to the search-engine optimisation. Your page gets the same foundation, and you do not have to learn anything except to tell me what you offer.',
        },
      },
      {
        id: 'marke',
        weight: 'empfohlen',
        title: { de: 'Logo, Signatur, Visitenkarten', en: 'Logo, signature, business cards' },
        summary: {
          de: 'Ein Logo in allen Formaten an einem sicheren Ort, eine E-Mail-Signatur mit Telefonnummer, hundert Visitenkarten. Klein, aber es unterscheidet Profi von Hobby.',
          en: 'A logo in every format in one safe place, an email signature with phone number, a hundred business cards. Small, but it separates professional from hobby.',
        },
        details: [
          {
            de: 'Logo als SVG, PNG mit transparentem Hintergrund, hell und dunkel. Alles in einen Cloud-Ordner, den du nie wieder suchen musst.',
            en: 'Logo as SVG, PNG with transparent background, light and dark. Everything in one cloud folder you never have to search for again.',
          },
          {
            de: 'Visitenkarten und ein kleiner Flyer mit deinem Buchungslink als QR-Code. Etwas altmodisch, deshalb fällt es auf.',
            en: 'Business cards and a small flyer with your booking link as a QR code. A little old-fashioned, which is why it stands out.',
          },
        ],
        joe: {
          de: 'Meine erste Unterschrift-Grafik habe ich verloren und neu machen müssen. Beim Logo habe ich es dann richtig gemacht: alle Formate, ein Ordner, fertig.',
          en: 'I lost my first signature graphic and had to redo it. With the logo I then did it right: every format, one folder, done.',
        },
        farewell: {
          de: 'Joé macht dir ein Logo und die Signatur, wenn du keins hast. Die Dateien gehören dir.',
          en: 'Joé makes you a logo and the signature if you do not have one. The files belong to you.',
        },
      },
      {
        id: 'social-media',
        weight: 'empfohlen',
        title: { de: 'Social-Media-Konten anlegen, auch wenn sie noch leer sind', en: 'Create social media accounts, even while they are empty' },
        summary: {
          de: 'Instagram und ein Meta-Business-Konto zuerst, TikTok und LinkedIn je nach Zielgruppe. Alle mit demselben Namen, alle im Google-Profil verlinkt.',
          en: 'Instagram and a Meta Business account first, TikTok and LinkedIn depending on your audience. All with the same name, all linked in your Google profile.',
        },
        details: [
          {
            de: 'Ein gutes Profilbild, drei Sätze Bio, Buchungslink. Mehr braucht es am Anfang nicht.',
            en: 'One good profile picture, a three-sentence bio, the booking link. Nothing more is needed at first.',
          },
          {
            de: 'Das Meta-Business-Konto brauchst du für Anzeigen, auch wenn du noch keine schaltest. Es dauert Tage bis zur Freigabe, deshalb früh.',
            en: 'You need the Meta Business account for ads, even before you run any. Approval takes days, hence early.',
          },
          {
            de: 'Video ist der Kanal, der für Behandlungen am besten funktioniert, und vor der Kamera stehst du, nicht Joé. Deine Kund:innen wollen die Person sehen, zu der sie gehen.',
            en: 'Video is the channel that works best for treatments, and the person in front of the camera is you, not Joé. Your clients want to see the person they are going to.',
          },
          {
            de: 'Joé filmt und bereitet die Videos mit dir vor. Das erste schneidet er selbst und zeigt dir dabei, wie er es macht. Ab dem zweiten schneidest du, wenn du kannst, denn dein Kanal soll ohne ihn weiterlaufen.',
            en: 'Joé films and prepares the videos with you. He edits the first one himself and shows you how he does it. From the second one on you edit, if you can, because your channel should keep running without him.',
          },
        ],
        farewell: {
          de: 'Dein Vorstellungsvideo aus der Probe-Session postet FareWell auf dem eigenen Kanal und markiert dich. Der erste Schwung Follower kommt von dort.',
          en: 'FareWell posts your introduction video from the trial session on its own channel and tags you. The first wave of followers comes from there.',
        },
      },
      {
        id: 'marketing',
        weight: 'empfohlen',
        title: { de: 'Marketing-Strategie mit Joé: was wirkt, was kostet, was misst man', en: 'Marketing strategy with Joé: what works, what it costs, how to measure it' },
        summary: {
          de: 'Ein Nachmittag, an dem du lernst, wie Google Ads, Meta und Plattformen wie Groupon funktionieren, was sie in unserem Fall bringen und was nicht.',
          en: 'One afternoon where you learn how Google Ads, Meta and platforms like Groupon work, what they deliver in our case and what they do not.',
        },
        details: [
          {
            de: 'Google Ads: kleines Tagesbudget auf wenige Suchbegriffe mit Ort, eigene Landingpage, Conversion-Messung. Das Gerüst steht bei FareWell schon.',
            en: 'Google Ads: a small daily budget on a few search terms with location, your own landing page, conversion tracking. The scaffolding already exists at FareWell.',
          },
          {
            de: 'Plattformen wie Groupon oder Urban Sports Club: großer Abschlag, aber neue Gesichter. Was darüber reinkommt, bleibt zu 100 % bei dir, FareWell nimmt davon nichts.',
            en: 'Platforms like Groupon or Urban Sports Club: a big discount, but new faces. What comes in through them stays 100% with you, FareWell takes nothing from it.',
          },
          {
            de: 'Ärzt:innen: keine Rabattplattformen, keine Vorher-nachher-Bilder in der Werbung. Das Heilmittelwerbegesetz gilt auch auf Instagram.',
            en: 'Physicians: no discount platforms, no before-and-after pictures in advertising. The medical advertising law also applies on Instagram.',
          },
          {
            de: 'Der 20 %-Vorteil für Kund:innen, die zwischen den Angeboten im Studio wechseln, ist dein günstigster Kanal: Die Kund:innen sind schon da.',
            en: 'The 20% perk for clients switching between the studio\'s offers is your cheapest channel: the clients are already here.',
          },
        ],
        joe: {
          de: 'Drei Jahre lang habe ich in einer Agentur Google-Ads- und Performance-Kampagnen für andere Firmen geplant und ausgewertet, danach den Online-Marketing-Aufbau eines Webshops geleitet. Das Wissen bekommst du an einem Nachmittag, nicht in drei Jahren.',
          en: 'For three years I planned and evaluated Google Ads and performance campaigns for other companies at an agency, then led the online marketing build-up of a web shop. You get that knowledge in one afternoon, not three years.',
        },
      },
      {
        id: 'erste-kundinnen',
        weight: 'empfohlen',
        title: { de: 'Die ersten zwanzig Kund:innen', en: 'The first twenty clients' },
        summary: {
          de: 'Sie kommen nicht aus Anzeigen. Sie kommen aus deinem Umfeld, aus dem Studio und von Leuten, die du persönlich einlädst.',
          en: 'They do not come from ads. They come from your circle, from the studio and from people you invite personally.',
        },
        details: [
          {
            de: 'Eine Liste mit fünfzig Namen aus deinem Telefon. Jede:r bekommt eine persönliche Nachricht mit deinem Buchungslink, nicht einen Sammelpost.',
            en: 'A list of fifty names from your phone. Each gets a personal message with your booking link, not a group post.',
          },
          {
            de: 'Empfehlungsbonus: Wer jemanden bringt, bekommt etwas. In Euro formuliert, nicht in Prozent.',
            en: 'Referral bonus: whoever brings someone gets something. Phrased in euros, not percent.',
          },
          {
            de: 'Nachbarschaft: Läden und Büros rund um den Frauentorgraben persönlich besuchen, mit Flyer und einem Code nur für sie.',
            en: 'The neighbourhood: visit shops and offices around Frauentorgraben in person, with a flyer and a code just for them.',
          },
        ],
        farewell: {
          de: 'Für die Nachbarschaftsrunde gibt es bei FareWell ein fertiges System: Liste, Promo-Codes pro Laden, personalisierter Flyer. Joé zeigt es dir.',
          en: 'For the neighbourhood round FareWell has a ready-made system: list, promo codes per shop, personalised flyer. Joé shows you.',
        },
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: 'laufen',
    index: '05',
    tag: { de: 'Routine', en: 'Routine' },
    title: { de: 'Laufen lassen und wachsen', en: 'Keep it running and grow' },
    lead: {
      de: 'Was jeden Monat wiederkommt, und was du mitnimmst, wenn du irgendwann weiterziehst.',
      en: 'What comes back every month, and what you take with you if you ever move on.',
    },
    steps: [
      {
        id: 'monatsroutine',
        weight: 'pflicht',
        title: { de: 'Die Monatsroutine', en: 'The monthly routine' },
        summary: {
          de: 'Eine feste Stunde am Monatsende: Belege, Rechnung an FareWell, Umsatzsteuer-Voranmeldung, Rücklage, ein Blick auf die Zahlen.',
          en: 'One fixed hour at the end of the month: receipts, invoice to FareWell, VAT advance return, reserve, a look at the numbers.',
        },
        details: [
          {
            de: 'Voranmeldung bis zum 10. des Folgemonats, wenn du umsatzsteuerpflichtig bist. Mit Dauerfristverlängerung einen Monat später.',
            en: 'Advance VAT return by the 10th of the following month if you are VAT-liable. One month later with a permanent extension.',
          },
          {
            de: 'Zahlen, die du kennen solltest: Behandlungen pro Woche, Umsatz pro Stunde im Studio, Anteil Neukund:innen, Bewertungen diesen Monat.',
            en: 'Numbers you should know: treatments per week, revenue per studio hour, share of new clients, reviews this month.',
          },
          {
            de: 'Betriebsurlaub früh festlegen und im Kalender sperren. Zwischen Weihnachten und dem 5. Januar kommt ohnehin kaum jemand.',
            en: 'Set your holiday closure early and block it in the calendar. Between Christmas and the 5th of January hardly anyone comes anyway.',
          },
        ],
        joe: {
          de: 'Ich habe mir eine Monats-Checkliste geschrieben, nachdem ich zweimal die Voranmeldung zu spät gemacht habe. Sie hängt jetzt neben dem Kalender.',
          en: 'I wrote myself a monthly checklist after filing the advance return late twice. It now hangs next to the calendar.',
        },
      },
      {
        id: 'raum-regeln',
        weight: 'pflicht',
        title: { de: 'Der geteilte Raum: Absagen, Übergabe, Wäsche', en: 'The shared room: cancellations, handover, linen' },
        summary: {
          de: 'Der Raum funktioniert, weil alle ihn so hinterlassen, wie sie ihn vorfinden wollen. Ein paar Regeln, die wir vor dem Start durchgehen.',
          en: 'The room works because everyone leaves it the way they want to find it. A few rules we go through before you start.',
        },
        details: [
          {
            de: 'Absagen und Nichterscheinen laufen über Salonkee, mit den Regeln aus deinen AGB.',
            en: 'Cancellations and no-shows run through Salonkee, with the rules from your terms.',
          },
          {
            de: 'Frische Wäsche pro Kund:in, Flächen desinfizieren, Geräte zurück an ihren Platz. Die Putz- und Aufgabenliste des Studios ist digital, du bekommst einen Zugang.',
            en: 'Fresh linen per client, disinfect surfaces, devices back in their place. The studio\'s cleaning and task list is digital, you get access.',
          },
          {
            de: 'Raumtemperatur im Sommer im Blick behalten. Über 26 Grad dürfen die Lasergeräte nicht laufen.',
            en: 'Keep an eye on the room temperature in summer. Above 26 degrees the laser devices must not run.',
          },
        ],
      },
      {
        id: 'wachsen',
        weight: 'optional',
        title: { de: 'Wachsen: Kooperationen, Weiterbildung, erste Mitarbeitende', en: 'Growing: partnerships, training, first employees' },
        summary: {
          de: 'Wenn der Kalender voll ist. Kooperationen mit Ärzt:innen, eine zweite Qualifikation, oder jemand, der dir hilft. Jeder dieser Wege hat seine eigenen Ämter.',
          en: 'When the calendar is full. Partnerships with physicians, a second qualification, or someone to help you. Each of these paths has its own offices.',
        },
        details: [
          {
            de: 'Kooperation mit Dermatolog:innen oder Hausärzt:innen: schnellere Termine für deine Kund:innen, Empfehlungen in beide Richtungen. Alle in der Stadt anrufen, bis eine:r Ja sagt.',
            en: 'Partnering with dermatologists or GPs: faster appointments for your clients, referrals in both directions. Call everyone in town until one says yes.',
          },
          {
            de: 'Erste Mitarbeitende: Betriebsnummer bei der Agentur für Arbeit, Arbeitgeber-Signal beim Finanzamt freischalten, Anmeldung bei der Krankenkasse, Lohnabrechnung an die Steuerberatung geben. Fachschulen und Innungen helfen beim Suchen.',
            en: 'First employees: company number from the employment agency, employer flag activated at the tax office, registration with the health insurer, payroll handed to the tax adviser. Trade schools and guilds help with the search.',
          },
          {
            de: 'Wer Laser mit Mitarbeitenden betreibt, braucht eine:n Laserschutzbeauftragte:n nach OStrV. Ein Tageskurs.',
            en: 'Anyone running lasers with employees needs a laser safety officer under the OStrV. A one-day course.',
          },
        ],
        joe: {
          de: 'Meine erste Stellenanzeige lief über die Agentur für Arbeit, die mich an die Kosmetik-Fachschulen und die Innung verwiesen hat. Der Markt ist eng, mehr Arbeitgeber als Bewerber:innen. Früh anfangen.',
          en: 'My first job ad ran through the employment agency, which pointed me to the cosmetics schools and the guild. The market is tight, more employers than applicants. Start early.',
        },
      },
      {
        id: 'mitnehmen',
        weight: 'empfohlen',
        title: { de: 'Wenn du weiterziehst: was du mitnimmst', en: 'If you move on: what you take with you' },
        summary: {
          de: 'Alles, was in dieser Road unter deinem Namen entstanden ist. Diese Liste ist Teil des Vertrags, damit es am Ende keine Diskussion gibt.',
          en: 'Everything in this road that was created under your name. This list is part of the agreement so there is no debate at the end.',
        },
        details: [
          {
            de: 'Dein Google-Unternehmensprofil mit allen Bewertungen. Es war nie unseres.',
            en: 'Your Google Business Profile with all its reviews. It was never ours.',
          },
          {
            de: 'Texte, Bilder und Videos deiner Seite als Export. Deine Social-Media-Konten sowieso.',
            en: 'Texts, images and videos of your page as an export. Your social media accounts anyway.',
          },
          {
            de: 'Deine Kampagnen, Anzeigentexte, Landingpage-Inhalte und die Zahlen dazu. Deine Kund:innenliste, mit ihrer Einwilligung.',
            en: 'Your campaigns, ad copy, landing page content and the numbers behind them. Your client list, with their consent.',
          },
          {
            de: 'Dein Portfolio: Vorher-nachher-Bilder, Vorstellungsvideo, Referenzen. Und die Erfahrung, wie man so etwas aufbaut.',
            en: 'Your portfolio: before-and-after pictures, introduction video, references. And the experience of how to build something like this.',
          },
        ],
        farewell: {
          de: 'Kündigungsfrist und Übergabe stehen im Kooperationsvertrag. Joé hilft beim Umzug der Inhalte, so wie er beim Aufbau geholfen hat.',
          en: 'Notice period and handover are in the cooperation agreement. Joé helps move the content, just as he helped build it.',
        },
      },
    ],
  },
];

/** Alle Schritte flach, für Zähler und Fortschritt. */
export const ALL_STEPS: Step[] = PHASES.flatMap((phase) => phase.steps);

export function stepAppliesTo(step: Step, profession: ProfessionId | null): boolean {
  if (!profession || !step.professions || step.professions.length === 0) {
    return true;
  }
  return step.professions.includes(profession);
}

export function professionById(id: string | null): Profession | null {
  return PROFESSIONS.find((p) => p.id === id) ?? null;
}

// Unbenutzte Sammlung bewusst exportiert: dokumentiert, welche Berufe als
// „freie Berufe" behandelt werden, falls ein Schritt das später braucht.
export const FREIE_BERUFE_IDS = FREIE_BERUFE;
