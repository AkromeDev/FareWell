/**
 * Inhalt der Gastro Road: die Freelancer Road, umgebaut für alle, die in
 * Nürnberg ein Restaurant eröffnen oder Kochkurse geben wollen. Kein
 * FareWell-Bezug: keine „Das übernimmt FareWell"-Kästen. Joés Erfahrungen
 * stehen nur dort, wo sie aus seiner eigenen Gründung übertragbar sind, und
 * nur mit seinen eigenen Sätzen aus der Freelancer Road, nie neu erfunden.
 *
 * Recherchiert im September 2026: Gesetzestexte, Stadt Nürnberg (Ordnungsamt,
 * Gesundheitsamt, Bauordnung, SUN, Liegenschaftsamt), LGL, IHK, BGN, DRV,
 * KfW, LfA, DEHOGA. Rechtliche Aussagen sind als Hinweis formuliert, nicht als
 * Beratung; wo es vom Einzelfall abhängt, nennt der Schritt die Stelle, die es
 * verbindlich sagen kann. Beträge und Fristen tragen ihr Jahr, damit sichtbar
 * ist, wann sie zu prüfen sind. Kontakte stehen in road-contacts.ts.
 *
 * Zweisprachig: jeder Text ist ein {de, en}-Paar. Kein Gedankenstrich als
 * Satztrenner (Hausregel, der Spec prüft das).
 */

import type { Phase, Profession, RoadDefinition } from './road.model';
import {
  AFA,
  BAUORDNUNG,
  BETRIEBSNUMMERN,
  BGN,
  BGN_PRAEVENTION,
  DEHOGA_MFR,
  DRV,
  FINANZAMT,
  GASTSTAETTEN,
  GESUNDHEITSAMT_BELEHRUNG,
  GEWERBEAMT,
  HWK,
  IHK,
  IHK_UNTERRICHTUNG,
  KFW,
  LEBENSMITTELUEBERWACHUNG,
  LFA,
  LIEGENSCHAFTSAMT,
  MINIJOB,
  STAB_WOHNEN,
  SUN,
  WIRTSCHAFTSFOERDERUNG,
} from './road-contacts';

export type GastroId = 'restaurant' | 'kochkurse';

/** Stand der Inhalte, im Kleingedruckten der Seite. */
export const GASTRO_STAND = 'September 2026';

const RESTAURANT: GastroId[] = ['restaurant'];
const KOCHKURSE: GastroId[] = ['kochkurse'];

export const GASTRO_PROFESSIONS: Profession<GastroId>[] = [
  {
    id: 'restaurant',
    icon: '🍽️',
    label: { de: 'Restaurant, Café, Imbiss', en: 'Restaurant, café, snack bar' },
    status: {
      de: 'Gewerbe mit IHK-Mitgliedschaft. Eine Gaststättenerlaubnis brauchst du nur, wenn du Alkohol ausschenkst. Als Lebensmittelunternehmen registriert und unangekündigt kontrolliert wirst du in jedem Fall.',
      en: 'A trade with chamber of commerce membership. You only need a restaurant licence if you serve alcohol. You are registered as a food business and inspected without notice in any case.',
    },
  },
  {
    id: 'kochkurse',
    icon: '🧑‍🍳',
    label: { de: 'Kochkurse, Kochschule', en: 'Cooking classes, cooking school' },
    status: {
      de: 'Unterricht (freier Beruf) oder Gewerbe, je nach Zuschnitt, das Finanzamt entscheidet. Lebensmittelunternehmen bist du trotzdem, und als selbständige Lehrkraft in der Regel rentenversicherungspflichtig.',
      en: 'Teaching (a liberal profession) or a trade, depending on how you set it up; the tax office decides. You are still a food business, and as a self-employed teacher usually subject to mandatory pension insurance.',
    },
  },
];

export const GASTRO_PHASES: Phase<GastroId>[] = [
  // ------------------------------------------------------------------ 1
  {
    id: 'planen',
    index: '01',
    tag: { de: 'Bevor du startest', en: 'Before you start' },
    title: { de: 'Entscheiden und planen', en: 'Decide and plan' },
    lead: {
      de: 'Die Schritte, die Geld und Nerven sparen, wenn sie vor dem ersten Vertrag passieren. In der Gastronomie ist der teuerste Fehler ein Mietvertrag für Räume, die nie ein Restaurant werden dürfen.',
      en: 'The steps that save money and nerves when they happen before the first contract. In gastronomy the most expensive mistake is a lease for premises that can never legally become a restaurant.',
    },
    steps: [
      {
        id: 'gruendungsberatung',
        weight: 'empfohlen',
        title: { de: 'Erst beraten lassen, dann unterschreiben', en: 'Get advice first, sign later' },
        summary: {
          de: 'Die erste Beratung kostet in Nürnberg nichts, und sie spart den teuersten Fehler der Gastronomie: einen Vertrag für Räume, Geräte oder Getränke, der nicht zu deinem Plan passt.',
          en: 'In Nuremberg the first round of advice costs nothing, and it saves you gastronomy\'s most expensive mistake: a contract for premises, equipment or drinks that does not fit your plan.',
        },
        details: [
          {
            de: 'IHK Nürnberg: Gründungsberatung, eine eigene Beratung zum Mietrecht und Finanzierungssprechtage mit der LfA Förderbank. Die IHK stellt auch die Tragfähigkeitsbescheinigung für den Gründungszuschuss aus.',
            en: 'Chamber of commerce (IHK Nürnberg): start-up advice, separate tenancy-law advice and financing consultation days with the LfA development bank. The IHK also issues the viability certificate for the start-up grant.',
          },
          {
            de: 'DEHOGA Bayern, der Verband der Gastronomie: ein kostenloser Gründungs-Check-up für alle, die in Bayern ein Lokal gründen oder übernehmen, mit Konzept, Tragfähigkeit, Recht und Finanzierung.',
            en: 'DEHOGA Bayern, the hospitality association: a free founders\' check-up for anyone opening or taking over a restaurant in Bavaria, covering concept, viability, legal and financing questions.',
          },
          {
            de: 'Wirtschaftsförderung der Stadt Nürnberg: kostenlose Online-Erstberatung für Gründer:innen an festen Terminen, die Daten stehen auf der Website.',
            en: 'The city of Nuremberg\'s business development office: free online first consultations for founders on fixed dates, listed on its website.',
          },
          {
            de: 'Bring zu jedem Termin dieselbe Seite mit: was du anbieten willst, wo, für wen, mit welchem Budget. Dann vergleichst du Antworten statt Gespräche.',
            en: 'Bring the same one-page summary to every appointment: what you want to offer, where, for whom, with what budget. Then you compare answers instead of conversations.',
          },
        ],
        joe: {
          de: 'Der produktivste Termin meiner ganzen Gründung war die Gründungsberatung der IHK am Hauptmarkt. Eine Stunde, und ich wusste, welche Stelle für welche Förderung zuständig ist. Die Sprechtage mit der LfA laufen über dieselbe Adresse.',
          en: 'The most productive appointment of my whole founding was the start-up consultation at the chamber of commerce on Hauptmarkt. One hour, and I knew which office handles which funding. The LfA consultation days run through the same address.',
        },
        contacts: [IHK, DEHOGA_MFR, WIRTSCHAFTSFOERDERUNG],
        links: [
          {
            label: { de: 'DEHOGA Bayern: Gründungs-Check-up', en: 'DEHOGA Bayern: founders\' check-up' },
            url: 'https://www.dehoga-bayern.de/karriere/existenzgruendung/gruendungs-check-up/',
          },
        ],
      },
      {
        id: 'haupt-oder-neben',
        weight: 'pflicht',
        title: { de: 'Haupt- oder Nebenerwerb? Und wie du aus dem Job kommst', en: 'Main or side business? And how you leave your job' },
        summary: {
          de: 'Kochkurse lassen sich gut neben dem Job starten, an Abenden und Wochenenden. Ein Restaurant ist ab dem ersten Tag ein Vollzeitbetrieb, plan es auch so.',
          en: 'Cooking classes can start well alongside a job, in the evenings and at weekends. A restaurant is a full-time business from day one, so plan it that way.',
        },
        details: [
          {
            de: 'Nebenerwerb heißt: Die Anstellung bleibt die Hauptsache, die Krankenversicherung läuft weiter über den Arbeitgeber. Wo die Grenze zum Hauptberuf liegt, sagt dir deine Krankenkasse verbindlich, frag sie mit deinen geplanten Stunden.',
            en: 'Side business means your job stays the main thing and your health insurance keeps running through your employer. Where the line to a main occupation lies, your health insurer tells you reliably, ask them with your planned hours.',
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
        title: { de: 'Gewerbe oder freier Beruf? Frag, bevor du dich festlegst', en: 'Trade or liberal profession? Ask before you commit' },
        summary: {
          de: 'Ein Restaurant ist immer ein Gewerbe. Bei Kochkursen kommt es darauf an, ob du unterrichtest oder ein Erlebnis verkaufst. Das entscheidet das Finanzamt, nicht du.',
          en: 'A restaurant is always a trade. With cooking classes it depends on whether you teach or sell an experience. The tax office decides that, not you.',
        },
        details: [
          {
            de: 'Restaurant, Café, Imbiss: Gewerbe, automatisch Mitglied der IHK. Einen Meistertitel brauchst du für die Gastronomie nicht.',
            en: 'Restaurant, café, snack bar: a trade, with automatic chamber of commerce membership. Gastronomy needs no master craftsman certificate.',
          },
          {
            de: 'Kochkurse können Unterricht und damit ein freier Beruf sein: ein fester Lernplan, du bringst Techniken bei, die Teilnehmenden kochen selbst, das gemeinsame Essen ist Nebensache.',
            en: 'Cooking classes can be teaching and therefore a liberal profession: a fixed curriculum, you teach techniques, participants cook themselves, the shared meal is secondary.',
          },
          {
            de: 'Richtung Gewerbe gehen: Kochevents für Firmen und Geburtstage, ein ganzes Menü mit Wein als Hauptsache, Küchenvermietung, Catering. Wer Messer, Gewürze oder Wein verkauft, hat dafür immer ein Gewerbe.',
            en: 'Things that point to a trade: cooking events for companies and birthdays, a full menu with wine as the main thing, kitchen rental, catering. Selling knives, spices or wine is always a trade.',
          },
          {
            de: 'Selbst wenn das Finanzamt freiberuflich sagt, verlangt das Gewerbeamt manchmal trotzdem eine Anmeldung. Beschreib beiden dieselbe Tätigkeit und notier die Antworten. Eine verbindliche Auskunft des Finanzamts ist kostenlos, solange es um weniger als 10.000 € Steuer geht.',
            en: 'Even if the tax office says liberal profession, the trade office sometimes still asks for a registration. Describe the same activity to both and note the answers. A binding ruling from the tax office is free as long as less than 10,000 € of tax is at stake.',
          },
          {
            de: 'Kuchen und Torten fürs eigene Café backen ist Gastronomie. Wer in größerem Umfang Brot oder Torten außer Haus verkauft, betreibt Bäcker- oder Konditorhandwerk und braucht einen Meister. Im Zweifel klärt es die Handwerkskammer.',
            en: 'Baking cakes and tarts for your own café is gastronomy. Selling bread or cakes to take away on a larger scale is the baker\'s or confectioner\'s craft and needs a master craftsman. When in doubt, the chamber of crafts settles it.',
          },
        ],
        joe: {
          de: 'Ich habe IHK und HWK angerufen und dieselbe Frage gestellt. Beide waren sich einig: Kosmetik ist Handwerk. Zehn Minuten Telefon haben mir einen falschen Antrag erspart.',
          en: 'I called both the chamber of commerce and the chamber of crafts and asked the same question. Both agreed: cosmetics is a craft. Ten minutes on the phone saved me a wrong application.',
        },
        contacts: [FINANZAMT, GEWERBEAMT, HWK],
      },
      {
        id: 'businessplan',
        weight: 'empfohlen',
        title: { de: 'Businessplan mit den Zahlen der Gastronomie', en: 'Business plan with gastronomy numbers' },
        summary: {
          de: 'Banken sind bei Gastronomie vorsichtig, aus gutem Grund. Ein Plan mit ehrlichen Kennzahlen entscheidet zwischen Kredit und Absage, und er zeigt dir, ab wann du davon leben kannst.',
          en: 'Banks are cautious with gastronomy, for good reason. A plan with honest figures decides between a loan and a rejection, and it shows you when you can live off it.',
        },
        details: [
          {
            de: 'Richtwerte des Branchenverbands DEHOGA, in Prozent vom Nettoumsatz: Personal etwa 35 %, in vielen klassischen Betrieben inzwischen über 40 %; Wareneinsatz etwa 28 %; Miete 8 bis 12 %; Energie 5 bis 7 %. Was übrig bleibt, muss dich bezahlen.',
            en: 'Benchmarks from the DEHOGA hospitality association, as a share of net revenue: staff about 35 %, in many traditional businesses now over 40 %; cost of goods about 28 %; rent 8 to 12 %; energy 5 to 7 %. Whatever is left has to pay you.',
          },
          {
            de: 'Rechne mit Nettoumsatz. Speisen haben seit 2026 dauerhaft 7 % Umsatzsteuer, Getränke 19 %, Kochkurse in der Regel 19 %.',
            en: 'Calculate with net revenue. Since 2026 food carries 7 % VAT permanently, drinks 19 %, cooking classes usually 19 %.',
          },
          {
            de: 'Die Gewinnschwelle: Fixkosten geteilt durch den Anteil, der nach Wareneinsatz und anderen variablen Kosten vom Umsatz übrig bleibt. Beispiel: 24.000 € Fixkosten im Monat und 35 % variable Kosten ergeben rund 36.900 € Nettoumsatz im Monat, etwa 1.420 € an jedem von 26 Öffnungstagen.',
            en: 'Break-even: fixed costs divided by the share of revenue left after cost of goods and other variable costs. Example: 24,000 € of fixed costs a month and 35 % variable costs mean about 36,900 € net revenue a month, roughly 1,420 € on each of 26 opening days.',
          },
          {
            de: 'Plan mindestens 20 % Eigenkapital ein. Wer sich alles leihen muss, findet kaum eine Bank, sagt die IHK. Der Grund: 2025 gingen im Gastgewerbe 108 von 10.000 Unternehmen insolvent, im Schnitt aller Branchen 69.',
            en: 'Plan for at least 20 % equity. Anyone who has to borrow everything will hardly find a bank, says the chamber of commerce. The reason: in 2025, 108 of every 10,000 hospitality businesses went insolvent, against 69 across all sectors.',
          },
          {
            de: 'Kochkurse: Rechne pro Kurs, nicht pro Monat. Zutaten, Raummiete, Getränke und Plattformprovision pro Person, dann der Preis, ab dem sich ein Kurs mit halber Gruppe noch trägt.',
            en: 'Cooking classes: calculate per class, not per month. Ingredients, room hire, drinks and platform commission per person, then the price at which a class with half a group still pays for itself.',
          },
          {
            de: 'Lass zwei Leute drüberlesen, die nichts mit der Branche zu tun haben. Was sie nicht verstehen, versteht die Bank auch nicht.',
            en: 'Have two people read it who have nothing to do with the industry. What they do not understand, the bank will not understand either.',
          },
        ],
        joe: {
          de: 'Steuern gehören in die Kosten. Das war der erste Fehler, den mir jemand aus meinem Plan gestrichen hat.',
          en: 'Taxes belong in the costs. That was the first mistake someone crossed out of my plan.',
        },
        links: [
          { label: { de: 'Vorlagen der Unternehmenswerkstatt', en: 'Unternehmenswerkstatt templates' }, url: 'https://www.uwd.de/group/p49198' },
        ],
      },
      {
        id: 'finanzierung',
        weight: 'empfohlen',
        title: { de: 'Finanzierung und Förderung, bevor du etwas kaufst', en: 'Financing and funding before you buy anything' },
        summary: {
          de: 'Förderkredite laufen über deine Hausbank und müssen beantragt sein, bevor du Küche, Geräte oder Einrichtung bestellst. Rückwirkend gibt es nichts.',
          en: 'Development loans run through your bank and must be applied for before you order a kitchen, equipment or furniture. Nothing is paid retroactively.',
        },
        details: [
          {
            de: 'KfW ERP-Gründerkredit StartGeld: bis 200.000 €, davon bis 80.000 € für Betriebsmittel. Die KfW trägt 80 % des Risikos der Bank, das macht die Zusage leichter.',
            en: 'KfW ERP start-up loan "StartGeld": up to 200,000 €, of which up to 80,000 € for working capital. KfW carries 80 % of the bank\'s risk, which makes approval easier.',
          },
          {
            de: 'LfA Förderbank Bayern, Gründungskredit Smart: bis 150.000 €, auch für Gründungen im Nebenerwerb, ebenfalls mit 80 % Risikoübernahme für die Bank.',
            en: 'LfA Förderbank Bayern, "Gründungskredit Smart": up to 150,000 €, also for part-time start-ups, likewise with 80 % of the risk taken off the bank.',
          },
          {
            de: 'Gründungszuschuss der Agentur für Arbeit: nur aus der Arbeitslosigkeit, mit mindestens 150 Tagen Restanspruch und einer Tragfähigkeitsbescheinigung, beantragt vor dem Start. Einen Rechtsanspruch gibt es nicht.',
            en: 'Start-up grant from the employment agency: only out of unemployment, with at least 150 days of remaining entitlement and a viability certificate, applied for before you start. There is no legal entitlement.',
          },
          {
            de: 'Brauereien und Getränkehändler finanzieren oft Theke, Einrichtung oder ein Darlehen, gegen einen Liefervertrag über Jahre, meist mit Mindestabnahme. Lass so einen Vertrag vor der Unterschrift prüfen. Er läuft weiter, auch wenn dein Lokal nicht läuft.',
            en: 'Breweries and drinks wholesalers often finance the bar, the furniture or a loan, in exchange for a supply contract over years, usually with a minimum purchase. Have such a contract checked before you sign. It keeps running even if your restaurant does not.',
          },
          {
            de: 'Eine eigene Gastro-Förderung der Stadt Nürnberg gibt es nicht (Stand 2026). Faustregel für alle Programme: erst Antrag, dann Kauf oder Start.',
            en: 'The city of Nuremberg has no gastronomy grant of its own (as of 2026). Rule of thumb for every programme: apply first, buy or start second.',
          },
        ],
        joe: {
          de: 'Im Finanzplan für den Gründungszuschuss den Zuschuss selbst nicht als Einnahme eintragen. Das hat mir die Beraterin ausdrücklich gesagt.',
          en: 'In the financial plan for the start-up grant, do not list the grant itself as income. The adviser told me that explicitly.',
        },
        contacts: [KFW, LFA, AFA],
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
            de: 'Danach regelmäßig Fortschritt zeigen und das Eröffnungsdatum genau nennen. Leg dir dafür Kalender-Erinnerungen an.',
            en: 'Afterwards show progress regularly and name the opening date precisely. Set calendar reminders for it.',
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

  // ------------------------------------------------------------------ 2
  {
    id: 'hygiene',
    index: '02',
    tag: { de: 'Das Wichtigste', en: 'What matters most' },
    title: { de: 'Hygiene: bevor die Kontrolle klingelt', en: 'Hygiene: before the inspector rings' },
    lead: {
      de: 'Wer Essen an andere abgibt, ist ein Lebensmittelunternehmen, eine Kochschule genauso wie ein Restaurant. Die Lebensmittelkontrolle kommt ohne Termin, und Nürnberg veröffentlicht derzeit mehr Verstöße als jede andere Stadt in Bayern. Diese Etappe steht vor dem Mietvertrag, weil sie bestimmt, welche Küche überhaupt geht.',
      en: 'Whoever hands food to others is a food business, a cooking school as much as a restaurant. The food inspectors come without an appointment, and Nuremberg currently publishes more violations than any other city in Bavaria. This stage comes before the lease because it decides which kitchen will work at all.',
    },
    steps: [
      {
        id: 'kueche',
        weight: 'pflicht',
        title: { de: 'Was die Küche können muss, vor dem Mietvertrag', en: 'What the kitchen must be able to do, before the lease' },
        summary: {
          de: 'Die EU-Hygieneverordnung legt fest, wie Räume für Lebensmittel gebaut sein müssen. Prüf das an jedem Objekt, bevor du unterschreibst. Umbauen nach der Unterschrift ist der teuerste Weg.',
          en: 'The EU hygiene regulation sets out how rooms for food must be built. Check it for every property before you sign. Rebuilding after signing is the most expensive way.',
        },
        details: [
          {
            de: 'Handwaschbecken mit warmem und kaltem Wasser, Seife und hygienischer Händetrocknung, getrennt von den Becken für Lebensmittel und Geschirr. Die Toiletten dürfen nicht direkt in Räume führen, in denen mit Lebensmitteln gearbeitet wird.',
            en: 'Hand-wash basins with hot and cold water, soap and hygienic hand drying, separate from the sinks for food and dishes. Toilets must not open directly into rooms where food is handled.',
          },
          {
            de: 'Böden und Wände glatt, dicht und abwaschbar, Arbeitsflächen aus glattem, korrosionsfestem Material, genug Kühlung mit Thermometern, Insektengitter an Fenstern, die sich öffnen lassen. Reinigungsmittel lagern nicht dort, wo Lebensmittel sind.',
            en: 'Floors and walls smooth, impervious and washable, work surfaces of smooth, corrosion-resistant material, enough refrigeration with thermometers, insect screens on windows that open. Cleaning agents are not stored where food is.',
          },
          {
            de: 'Rein und unrein getrennt: Anlieferung und Abfall, rohe und fertige Speisen, Straßen- und Arbeitskleidung (Spinde). Für Küchen verlangt die Berufsgenossenschaft rutschhemmende Böden der Klasse R12.',
            en: 'Clean and dirty kept apart: deliveries and waste, raw and finished food, street clothes and work clothes (lockers). For kitchens the accident insurer requires slip-resistant floors of class R12.',
          },
          {
            de: 'Fettabscheider: Restaurants und Imbisse in Nürnberg müssen einen haben. Die Entwässerung braucht vor dem Umbau eine Genehmigung der Stadtentwässerung SUN, danach jährliche Wartung, ein Betriebstagebuch und alle fünf Jahre eine Generalinspektion. Frag den Vermieter, ob einer da ist: Einbauen muss ihn der Eigentümer.',
            en: 'Grease separator: restaurants and snack bars in Nuremberg must have one. The drainage needs approval from the city drainage service SUN before any conversion, then yearly maintenance, an operating log and a general inspection every five years. Ask the landlord whether there is one: the owner has to install it.',
          },
          {
            de: 'Abluft: Wohin die Küchenabluft geht, klärst du mit Vermieter, Eigentümergemeinschaft und Bauordnung, bevor du unterschreibst.',
            en: 'Extraction: where the kitchen exhaust goes, you settle with the landlord, the owners\' association and the building authority before you sign.',
          },
          {
            de: 'Kochkurse zu Hause: Die Lebensmittelüberwachung in München lässt Lebensmittelbetriebe in Privaträumen in der Regel nicht zu, weil sich privat und gewerblich nicht trennen lassen. Frag in Nürnberg vorher nach, oder plan gleich mit einer gemieteten Profiküche.',
            en: 'Cooking classes at home: Munich\'s food inspectors usually do not allow food businesses in private homes, because private and commercial use cannot be separated. Ask in Nuremberg first, or plan with a rented professional kitchen from the start.',
          },
        ],
        contacts: [LEBENSMITTELUEBERWACHUNG, SUN, BAUORDNUNG],
        links: [
          {
            label: { de: 'SUN: Merkblatt Fettabscheider (PDF)', en: 'SUN: grease separator leaflet (PDF, German)' },
            url: 'https://www.nuernberg.de/imperia/md/sun/dokumente/sun/info_fettabscheider.pdf',
          },
        ],
      },
      {
        id: 'registrierung',
        weight: 'pflicht',
        title: { de: 'Als Lebensmittelunternehmen registrieren', en: 'Register as a food business' },
        summary: {
          de: 'Pflicht vor dem ersten Gast oder dem ersten Kurs, kostenlos und online möglich. Auch die erste Kontrolle danach kostet nichts.',
          en: 'Required before the first guest or the first class, free of charge and possible online. The first inspection afterwards costs nothing either.',
        },
        details: [
          {
            de: 'Zuständig ist die Lebensmittelüberwachung im Ordnungsamt. Registrieren geht online, per Post mit dem bayerischen Meldeformular oder vor Ort mit Termin. Angaben: Name, Adresse, Rechtsform, Name des Betriebs und was du dort tust.',
            en: 'The responsible office is the food inspection unit of the city\'s Ordnungsamt. You can register online, by post with the Bavarian form or in person by appointment. Details: name, address, legal form, business name and what you do there.',
          },
          {
            de: 'Auch eine Kochschule ist ein Lebensmittelunternehmen: Sie gibt Lebensmittel an Teilnehmende weiter, und das zählt, ob bezahlt oder nicht. Eine bayerische Vorschrift, die Kochschulen ausdrücklich nennt, gibt es nicht. Frag bei der Registrierung nach der Einstufung.',
            en: 'A cooking school is a food business too: it hands food to participants, and that counts whether paid or not. No Bavarian rule names cooking schools explicitly, so ask about the classification when you register.',
          },
          {
            de: 'In Bayern gilt die Gewerbeanmeldung zwar auch als Meldung, Nürnberg verlangt die Registrierung aber ausdrücklich vor dem Start. Mach sie getrennt, sie kostet nichts. Wer Kochkurse freiberuflich gibt, hat gar keine Gewerbeanmeldung, dann ist die Registrierung der einzige Weg.',
            en: 'In Bavaria the trade registration technically counts as notification too, but Nuremberg explicitly requires registration before starting. Do it separately, it costs nothing. If you teach cooking as a liberal profession you have no trade registration at all, and registration is the only way.',
          },
          {
            de: 'Kostenlos sind die Registrierung und die Erstkontrolle. Findet die Kontrolle Mängel und muss jemand wiederkommen, kostet die zweite Kontrolle Gebühren.',
            en: 'Registration and the first inspection are free. If the inspection finds defects and someone has to come back, the second inspection is charged.',
          },
          {
            de: 'Später melden: wesentliche Änderungen wie einen Umbau oder einen anderen Ablauf in der Küche, und die Schließung.',
            en: 'Report later: significant changes such as a conversion or a different workflow in the kitchen, and closure.',
          },
        ],
        contacts: [LEBENSMITTELUEBERWACHUNG],
        links: [
          {
            label: { de: 'Stadt Nürnberg: Lebensmittelbetrieb registrieren', en: 'City of Nuremberg: register a food business (German)' },
            url: 'https://www.nuernberg.de/internet/ordnungsamt/lebensmittelregistrierung.html',
          },
        ],
      },
      {
        id: 'belehrung',
        weight: 'pflicht',
        title: { de: 'Belehrung beim Gesundheitsamt (§ 43 IfSG)', en: 'Health office instruction (Section 43 Infection Protection Act)' },
        summary: {
          de: 'Das, was viele noch „Gesundheitszeugnis" nennen. Pflicht für alle, die in der Küche arbeiten oder mit Speisen und Geschirr zu tun haben, auch für dich selbst. Die Bescheinigung darf bei Arbeitsbeginn höchstens drei Monate alt sein.',
          en: 'What many still call the "health certificate". Required for everyone who works in the kitchen or handles food and dishes, yourself included. The certificate may be at most three months old when work starts.',
        },
        details: [
          {
            de: 'Gesundheitsamt Nürnberg: Einzelbelehrung vor Ort, ohne Termin, Montag bis Freitag von 8 bis 11 Uhr, 28 €, Ausweis mitbringen. Auf Wunsch auf Englisch, für andere Sprachen gibt es Merkblätter.',
            en: 'Nuremberg health office: individual instruction in person, no appointment, Monday to Friday from 8 to 11 am, 28 €, bring photo ID. In English on request, leaflets for other languages.',
          },
          {
            de: 'Nicht zu früh gehen: Am ersten Arbeitstag darf die Bescheinigung höchstens drei Monate alt sein. Danach gilt sie unbefristet.',
            en: 'Do not go too early: on your first working day the certificate may be at most three months old. After that it stays valid indefinitely.',
          },
          {
            de: 'Wer sie braucht: Köch:innen, Service, Spülkräfte, du selbst, und wer einen Kochkurs leitet. Die Teilnehmenden eines Kochkurses brauchen keine, sie kochen nicht gewerbsmäßig.',
            en: 'Who needs it: cooks, service staff, dishwashers, you yourself, and whoever leads a cooking class. Cooking-class participants need none, because they do not cook commercially.',
          },
          {
            de: 'Danach bist du dran: Alle zwei Jahre belehrst du dein Team selbst (Folgebelehrung) und dokumentierst es, auch dich selbst, wenn du allein arbeitest. Bescheinigungen und Nachweise liegen im Betrieb, an wechselnden Orten reicht eine beglaubigte Kopie.',
            en: 'After that it is your turn: every two years you instruct your team yourself (follow-up instruction) and document it, yourself included if you work alone. Certificates and records stay at the premises; at changing locations a certified copy is enough.',
          },
          {
            de: 'Wer Durchfall, hohes Fieber, Gelbsucht oder eine entzündete, nässende Wunde hat, darf nicht in die Küche und muss es dir sofort sagen. Das gilt auch für Kursteilnehmende.',
            en: 'Anyone with diarrhoea, a high fever, jaundice or an inflamed, weeping wound must not enter the kitchen and has to tell you at once. That applies to class participants too.',
          },
          {
            de: 'Das Gesundheitsamt Nürnberger Land bietet die Belehrung auch online an, in zehn Sprachen, für 12,50 €. Praktisch für ein mehrsprachiges Team, frag vorher in Nürnberg, ob sie dort anerkannt wird.',
            en: 'The Nürnberger Land district health office also offers the instruction online, in ten languages, for 12.50 €. Handy for a multilingual team; ask in Nuremberg first whether it is accepted there.',
          },
        ],
        contacts: [GESUNDHEITSAMT_BELEHRUNG],
        links: [
          {
            label: { de: 'Online-Belehrung Landkreis Nürnberger Land', en: 'Online instruction, Nürnberger Land district' },
            url: 'https://www.nuernberger-land.de/serviceleistungen/schule-bildung-beruf/belehrung-fuer-den-umgang-mit-lebensmitteln',
          },
        ],
      },
      {
        id: 'hygieneschulung',
        weight: 'pflicht',
        title: { de: 'Hygieneschulung für dich und dein Team', en: 'Hygiene training for you and your team' },
        summary: {
          de: 'Die Belehrung ist nicht die Schulung. Wer mit leicht verderblichen Lebensmitteln arbeitet, braucht eine Schulung nach der Lebensmittelhygiene-Verordnung, und die Behörden erwarten sie jährlich und bei jeder Neueinstellung.',
          en: 'The instruction is not the training. Anyone working with perishable food needs training under the food hygiene ordinance, and the authorities expect it yearly and for every new hire.',
        },
        details: [
          {
            de: 'Inhalt nach Gesetz: zehn Themen, von Eigenkontrollen und Rückverfolgbarkeit über Kühlung und Reinigung bis zum Umgang mit Abfall. Wer eine abgeschlossene Ausbildung als Koch oder Köchin hat, gilt als geschult.',
            en: 'Content by law: ten topics, from self-checks and traceability to cooling, cleaning and waste. Anyone with a completed cook\'s apprenticeship counts as trained.',
          },
          {
            de: 'Nachweis: wer teilgenommen hat, mit Unterschrift, wann, welche Themen, wer geschult hat. Du darfst dein Team selbst schulen, wenn du das Wissen hast, das Protokoll ist dann dein Nachweis.',
            en: 'Proof: who took part, with signature, when, which topics, who trained them. You may train your team yourself if you have the knowledge; the record is then your proof.',
          },
          {
            de: 'Wie oft: Das Gesetz nennt keine Frist. Die Lebensmittelüberwachung München erwartet mindestens einmal im Jahr und bei jeder Neueinstellung, rechne in Nürnberg mit demselben.',
            en: 'How often: the law sets no interval. Munich\'s food inspectors expect at least once a year and for every new hire; expect the same in Nuremberg.',
          },
          {
            de: 'Für dich selbst: Die Gaststättenunterrichtung der IHK (105 €, ein Nachmittag) behandelt Eigenkontrolle, HACCP, Gerichte mit Ei und Hackfleisch und Zusatzstoffe. Ob Nürnberg sie auch als Hygieneschulung anerkennt, frag bei der Lebensmittelüberwachung. Eintägige Kurse nach § 4 LMHV bieten die IHK-Akademien für etwa 160 € an.',
            en: 'For yourself: the chamber of commerce\'s restaurant instruction (105 €, one afternoon) covers self-checks, HACCP, egg and minced-meat dishes and additives. Whether Nuremberg also accepts it as hygiene training, ask the food inspectors. One-day courses under Section 4 LMHV are offered by the IHK academies for about 160 €.',
          },
          {
            de: 'Kursteilnehmende sind keine Angestellten und brauchen keine Schulung. Du als Kursleitung schon, außer du bist ausgebildete:r Koch oder Köchin.',
            en: 'Class participants are not employees and need no training. You as the instructor do, unless you are a trained cook.',
          },
        ],
        contacts: [IHK_UNTERRICHTUNG],
        links: [
          {
            label: { de: 'IHK-Onlinehilfe Lebensmittelhygiene (Vorlagen)', en: 'IHK online help on food hygiene (templates, German)' },
            url: 'https://www.onlinehilfe-lebensmittelhygiene.de/',
          },
        ],
      },
      {
        id: 'haccp',
        weight: 'pflicht',
        title: { de: 'HACCP-Konzept und Eigenkontrollen', en: 'HACCP plan and self-checks' },
        summary: {
          de: 'Du musst schriftlich zeigen können, wo in deiner Küche etwas schiefgehen kann und wie du es verhinderst. Der einfache Weg ist die DEHOGA-Leitlinie für eine Gute Hygienepraxis in der Gastronomie, angepasst an deine Küche.',
          en: 'You must be able to show in writing where things can go wrong in your kitchen and how you prevent it. The simple route is DEHOGA\'s guideline for good hygiene practice in gastronomy, adapted to your kitchen.',
        },
        details: [
          {
            de: 'Die Leitlinie (3. Auflage 2022) ist amtlich geprüft und bei der EU notifiziert, du bekommst sie über den DEHOGA. Sie ersetzt kein eigenes Konzept, aber sie gibt dir die Struktur. Eine unveränderte Vorlage fällt bei der Kontrolle auf.',
            en: 'The guideline (3rd edition 2022) is officially checked and notified to the EU; you get it through DEHOGA. It does not replace your own plan, but it gives you the structure. An unchanged template stands out at an inspection.',
          },
          {
            de: 'Die Unterlagen, die bei der Kontrolle gefragt sind: Reinigungs- und Desinfektionsplan mit Nachweis, Temperaturlisten für jeden Kühlschrank, jede Tiefkühltruhe und jede Warmhaltung, Wareneingangskontrolle, Schädlingsmonitoring, Schulungs- und Belehrungsnachweise.',
            en: 'The records inspectors ask for: cleaning and disinfection plan with log, temperature lists for every fridge, freezer and hot-holding unit, goods-in checks, pest monitoring, training and instruction records.',
          },
          {
            de: 'Temperaturen: Fleisch, Feinkost und fertige Salate höchstens 7 °C, Geflügel 4 °C, Innereien 3 °C, Hackfleisch 2 °C, frischer Fisch auf Eis 2 °C, Tiefkühlware −18 °C. Warmhalten mit mindestens 65 °C, höchstens drei Stunden. Gekochtes zügig abkühlen, Richtwert unter 10 °C in zwei Stunden. Täglich messen und aufschreiben, auch was du bei einer Abweichung getan hast.',
            en: 'Temperatures: meat, deli and ready salads at most 7 °C, poultry 4 °C, offal 3 °C, minced meat 2 °C, fresh fish on ice 2 °C, frozen goods −18 °C. Hot-hold at 65 °C or more, for no more than three hours. Cool cooked food quickly, as a guide below 10 °C within two hours. Measure and write it down daily, including what you did when a value was off.',
          },
          {
            de: 'Rückverfolgbarkeit: Von jeder Lieferung festhalten, von wem, was, wie viel, Charge, Haltbarkeit und wann sie ankam. Eine Rechnung allein reicht in der Regel nicht. Auf Anfrage musst du das der Behörde innerhalb von 24 Stunden elektronisch schicken können, eine Tabelle genügt.',
            en: 'Traceability: for every delivery record who from, what, how much, batch, shelf life and when it arrived. An invoice alone is usually not enough. On request you must be able to send this to the authority electronically within 24 hours; a spreadsheet will do.',
          },
          {
            de: 'Schädlinge: Ein Vertrag mit einer Fachfirma ist keine Pflicht, ein dokumentiertes Monitoring schon, mit ungiftigen Fallen und monatlicher Kontrolle. Von den 32 Nürnberger Einträgen auf der bayerischen Liste veröffentlichter Verstöße (Stand September 2026) betrafen 24 auch die Schädlingsbekämpfung. Eine Fachfirma ist deshalb gut angelegtes Geld.',
            en: 'Pests: a contract with a pest-control firm is not mandatory, documented monitoring is, with non-toxic traps and monthly checks. Of the 32 Nuremberg entries on Bavaria\'s list of published violations (as of September 2026), 24 also concerned pest control. A professional firm is therefore money well spent.',
          },
          {
            de: 'Frittierfett riechen und schmecken, höchstens bei 175 °C frittieren, jeden Wechsel notieren. Speisen mit rohem Ei: warm innerhalb von zwei Stunden servieren, kalt innerhalb von zwei Stunden auf 7 °C kühlen und binnen 24 Stunden servieren, zum Mitnehmen nur mit dem Hinweis „sofort verbrauchen". Oder pasteurisiertes Ei nehmen.',
            en: 'Smell and taste frying fat, fry at no more than 175 °C, note every change. Dishes with raw egg: serve warm ones within two hours, cool cold ones to 7 °C within two hours and serve them within 24 hours, and for takeaway only with a "consume immediately" note. Or use pasteurised egg.',
          },
        ],
        contacts: [DEHOGA_MFR],
        links: [
          {
            label: { de: 'Liste der geprüften Hygiene-Leitlinien mit Bezugsquellen (PDF)', en: 'List of approved hygiene guidelines with suppliers (PDF, German)' },
            url: 'https://www.lebensmittelverband.de/fileadmin/Seiten/Lebensmittel/Sicherheit_und_Recht/Hygiene/Leitlinien_GHP_mit_Bezugsquellen_Stand_7_2026.pdf',
          },
          {
            label: { de: 'IHK-Onlinehilfe: Eigenkontrolle in der Gastronomie', en: 'IHK online help: self-checks in gastronomy (German)' },
            url: 'https://www.onlinehilfe-lebensmittelhygiene.de/de/gastronomie/eigenkontrolle/',
          },
        ],
      },
      {
        id: 'allergene',
        weight: 'pflicht',
        title: { de: 'Allergene und Zusatzstoffe kennzeichnen', en: 'Label allergens and additives' },
        summary: {
          de: 'Die 14 Hauptallergene musst du auch bei loser Ware angeben, schriftlich oder mündlich mit schriftlicher Grundlage. Die Angaben müssen zu deinen Rezepten passen, nicht zu einer Vorlage aus dem Internet.',
          en: 'You must declare the 14 main allergens for unpackaged food too, in writing or orally backed by a written record. The details must match your recipes, not a template from the internet.',
        },
        details: [
          {
            de: 'Schriftlich: auf der Karte (Fußnoten sind erlaubt), auf einem Schild am Gericht, als Aushang oder in einer Mappe, auf die ein sichtbarer Hinweis zeigt.',
            en: 'In writing: on the menu (footnotes are allowed), on a sign by the dish, as a notice, or in a folder that a visible notice points to.',
          },
          {
            de: 'Mündlich geht nur, wenn es pro Gericht eine schriftliche Dokumentation gibt, das Team sofort Auskunft geben kann und ein sichtbarer Hinweis sagt, dass es so läuft. Pauschale Sätze wie „kann Spuren von allem enthalten" reichen nicht.',
            en: 'Orally only works if there is a written record per dish, the team can answer immediately and a visible notice says that this is how it works. Blanket statements like "may contain traces of anything" are not enough.',
          },
          {
            de: 'Zusatzstoffe auf demselben Weg kennzeichnen, zum Beispiel „mit Farbstoff", „mit Konservierungsstoff", „mit Geschmacksverstärker", „mit Süßungsmittel". Grundlage sind die Angaben deiner Lieferanten, prüf sie bei jedem Produktwechsel.',
            en: 'Mark additives the same way, for example "with colouring", "with preservative", "with flavour enhancer", "with sweetener". The basis is your suppliers\' specifications; check them whenever a product changes.',
          },
          {
            de: 'Geräte, die mit einem Allergen in Kontakt waren, reinigen, bevor sie für Speisen ohne dieses Allergen benutzt werden. Das ist seit 2021 ausdrücklich Pflicht.',
            en: 'Clean equipment that has been in contact with an allergen before using it for food without that allergen. This has been an explicit obligation since 2021.',
          },
          {
            de: 'Kochkurse: Frag Allergien und Unverträglichkeiten bei der Buchung ab, und Schwangerschaft oder kleine Kinder, wenn Rohes auf dem Plan steht. Allergie-Angaben sind Gesundheitsdaten: nur für den Kurs verwenden, danach löschen.',
            en: 'Cooking classes: ask about allergies and intolerances when people book, and about pregnancy or young children if raw food is on the plan. Allergy details are health data: use them only for the class, then delete them.',
          },
          {
            de: 'Die Stadt München stellt ausfüllbare Excel-Vorlagen für Allergene und Zusatzstoffe bereit, die in Nürnberg genauso funktionieren.',
            en: 'The city of Munich provides fillable Excel templates for allergens and additives that work just as well in Nuremberg.',
          },
        ],
        contacts: [LEBENSMITTELUEBERWACHUNG],
        links: [
          {
            label: { de: 'Lebensmittelüberwachung München: Vorlagen', en: 'Munich food inspection: templates (German)' },
            url: 'https://stadt.muenchen.de/infos/lebensmittelueberwachung.html',
          },
        ],
      },
      {
        id: 'kontrolle',
        weight: 'pflicht',
        title: { de: 'Wenn es klingelt: die Lebensmittelkontrolle', en: 'When the doorbell rings: the food inspection' },
        summary: {
          de: 'Die Kontrolle kommt ohne Ankündigung, während der Öffnungszeiten, und du musst sie hereinlassen. Mit einem Kontroll-Ordner zeigst du in zehn Minuten, dass deine Küche im Griff ist.',
          en: 'The inspection comes unannounced during opening hours, and you have to let it in. With an inspection folder you show within ten minutes that your kitchen is under control.',
        },
        details: [
          {
            de: 'Wie oft: Ein Restaurant wird nach Risiko eingestuft und regulär alle sechs Monate bis alle drei Jahre kontrolliert, je nachdem, wie gut es abschneidet. Die erste Kontrolle nach der Eröffnung legt die Einstufung fest. Dazu kommen Kontrollen nach Beschwerden von Gästen.',
            en: 'How often: a restaurant is graded by risk and inspected routinely every six months to every three years, depending on how well it scores. The first inspection after opening sets the grade. On top come inspections after guest complaints.',
          },
          {
            de: 'Was angesehen wird: alle Räume, Kühlung, Messer und Flächen, Lager, Toiletten, Abfall, Schädlingsbekämpfung, die Unterlagen aus dem HACCP-Schritt, Belehrungen und die Kennzeichnung auf der Karte. Die Kontrolle darf Proben nehmen und in deine Unterlagen schauen.',
            en: 'What is looked at: every room, refrigeration, knives and surfaces, storage, toilets, waste, pest control, the records from the HACCP step, instructions and the labelling on the menu. The inspectors may take samples and look at your documents.',
          },
          {
            de: 'Der Kontroll-Ordner: HACCP-Konzept, Reinigungsplan mit Nachweisen, Temperaturlisten, Lieferscheine, Schädlingsmonitoring, Belehrungen und Schulungen, Allergen- und Zusatzstoffliste, Tagebuch des Fettabscheiders mit Entsorgungsbelegen. Alles an einem Ort, alles aktuell.',
            en: 'The inspection folder: HACCP plan, cleaning plan with records, temperature lists, delivery notes, pest monitoring, instructions and training, allergen and additive list, grease-separator log with disposal receipts. All in one place, all up to date.',
          },
          {
            de: 'Was es kostet: Eine Kontrolle ohne oder mit nur geringen Mängeln (etwa einer gesprungenen Fliese) ist kostenlos. Bei echten Mängeln kostet schon diese Kontrolle, dazu die Nachkontrolle, in Bayern 15 bis 35 € je angefangene Viertelstunde und Person, Anordnungen extra. Bußgelder gehen bis 50.000 €, im Extremfall wird der Betrieb geschlossen.',
            en: 'What it costs: an inspection with no or only minor defects (say, a cracked tile) is free. With real defects that inspection is charged, then the follow-up, in Bavaria 15 to 35 € per started quarter hour and inspector, orders extra. Fines go up to 50,000 €, and in extreme cases the business is closed.',
          },
          {
            de: 'Öffentlich: Verstöße, bei denen ein Bußgeld ab 350 € zu erwarten ist, stehen sechs Monate lang mit Name und Adresse auf der Website des Landesamts LGL. Du wirst vorher angehört. Im September 2026 kamen dort 32 von 165 Einträgen aus Nürnberg, mehr als aus jeder anderen Stadt und jedem Landkreis in Bayern.',
            en: 'Public: violations where a fine of 350 € or more is expected are listed for six months with name and address on the website of the state authority LGL. You are heard beforehand. In September 2026, 32 of the 165 entries there came from Nuremberg, more than from any other city or district in Bavaria.',
          },
          {
            de: 'Topf Secret: Jede Person kann über die Plattform von foodwatch und FragDenStaat kostenlos deine Kontrollergebnisse anfordern. Bis September 2026 gab es allein für Nürnberg 869 Anfragen. Du wirst vor der Herausgabe beteiligt, bei festgestellten Verstößen lässt sie sich aber kaum verhindern.',
            en: 'Topf Secret: anyone can request your inspection results free of charge through the foodwatch and FragDenStaat platform. By September 2026 there had been 869 requests for Nuremberg alone. You are involved before anything is released, but for established violations it can hardly be stopped.',
          },
          {
            de: 'Tipp: Die bayerischen Gebührenregeln nennen ausdrücklich den Fall, dass ein neu eröffnetes Restaurant die Kontrolle selbst anfragt. Findet sie nichts, bleibt sie eine kostenlose Regelkontrolle. Lieber eingeladen als überrascht.',
            en: 'Tip: the Bavarian fee rules explicitly mention a newly opened restaurant requesting the inspection itself. If nothing is found, it stays a free routine inspection. Better invited than surprised.',
          },
        ],
        contacts: [LEBENSMITTELUEBERWACHUNG],
        links: [
          {
            label: { de: 'LGL: veröffentlichte Hygieneverstöße in Bayern', en: 'LGL: published hygiene violations in Bavaria (German)' },
            url: 'https://www.lgl.bayern.de/lebensmittel/ueberwachung/informationen_40_1a/verstoss.php',
          },
          {
            label: { de: 'Topf Secret', en: 'Topf Secret (German)' },
            url: 'https://fragdenstaat.de/kampagnen/lebensmittelkontrolle/',
          },
          {
            label: { de: 'Stadt Nürnberg: Lebensmittelkontrollen', en: 'City of Nuremberg: food inspections (German)' },
            url: 'https://www.nuernberg.de/internet/ordnungsamt/kontrollen.html',
          },
        ],
      },
      {
        id: 'teilnehmende',
        weight: 'pflicht',
        professions: KOCHKURSE,
        title: { de: 'Hygieneregeln für Kursteilnehmende', en: 'Hygiene rules for class participants' },
        summary: {
          de: 'Teilnehmende brauchen keine Belehrung vom Gesundheitsamt, aber eine von dir, vor dem ersten Schnitt. Und wer krank ist, kocht nicht mit.',
          en: 'Participants need no instruction from the health office, but they do need one from you, before the first cut. And anyone who is ill does not cook.',
        },
        details: [
          {
            de: 'Gesundheit: Wer Durchfall, Bauchschmerzen, Halsschmerzen oder eine entzündete Wunde hat, macht nicht mit. Kleine Wunden bekommen ein frisches wasserfestes Pflaster und einen Handschuh. Schreib das in die Buchungsbestätigung, dann ist eine Absage keine Überraschung.',
            en: 'Health: anyone with diarrhoea, stomach ache, a sore throat or an inflamed wound does not take part. Small cuts get a fresh waterproof plaster and a glove. Put this in the booking confirmation so a cancellation is no surprise.',
          },
          {
            de: 'Kleidung: saubere Schürze, lange Haare zusammen, Ringe und Armbänder ab, kurze, saubere Nägel.',
            en: 'Clothing: clean apron, long hair tied back, rings and bracelets off, short, clean nails.',
          },
          {
            de: 'Hände waschen: zu Beginn, nach Pausen, nach der Toilette, nach dem Abfall und nach rohem Ei, Fleisch, Geflügel, Fisch oder Mehl. Flüssigseife und Einmalhandtücher. Probieren mit eigenem Löffel, nicht mit dem Finger.',
            en: 'Hand washing: at the start, after breaks, after the toilet, after handling waste and after raw egg, meat, poultry, fish or flour. Liquid soap and single-use towels. Taste with your own spoon, not your finger.',
          },
          {
            de: 'Rohes: roher Teig und rohes Mehl, TK-Beeren und Speisen mit rohem Ei sind die Klassiker. Erhitzen oder pasteurisiertes Ei verwenden. Mitnehmen lassen nur, was nicht leicht verdirbt.',
            en: 'Raw food: raw dough and raw flour, frozen berries and dishes with raw egg are the classics. Heat them or use pasteurised egg. Only let people take home what does not spoil easily.',
          },
          {
            de: 'In einer gemieteten Küche schriftlich regeln: in welchem Zustand du sie übernimmst und übergibst, welchen Kühlschrank du nutzt (mit eigener Temperaturliste), wer die Schädlingskontrolle macht und wessen HACCP-Konzept was abdeckt.',
            en: 'In a rented kitchen, agree in writing: the condition in which you take it over and hand it back, which fridge you use (with your own temperature list), who handles pest control and whose HACCP plan covers what.',
          },
          {
            de: 'Eine gute Vorlage für diese Regeln ist das Hygiene-Merkblatt der Sarah Wiener Stiftung. Es ist für Kochen mit Kindern geschrieben und von allen Bundesländern anerkannt, die Regeln lassen sich gut übertragen.',
            en: 'A good model for these rules is the Sarah Wiener Foundation\'s hygiene leaflet. It is written for cooking with children and recognised by all federal states, and the rules transfer well.',
          },
        ],
        links: [
          {
            label: { de: 'Hygiene-Merkblatt der Sarah Wiener Stiftung (PDF)', en: 'Sarah Wiener Foundation hygiene leaflet (PDF, German)' },
            url: 'https://sw-stiftung.de/fileadmin/user_upload/03_Mitmachen/Materialien/SWS_Hygienemerkblatt_A4_Online.pdf',
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: 'aemter',
    index: '03',
    tag: { de: 'Ämter', en: 'Offices' },
    title: { de: 'Räume, Ämter, Genehmigungen', en: 'Premises, offices, permits' },
    lead: {
      de: 'Der Papierteil, in der Reihenfolge, in der eine Stelle auf die andere wartet: erst die Räume und die Baugenehmigung, dann die Gaststättenerlaubnis, dann die Anmeldungen.',
      en: 'The paperwork, in the order in which one office waits for the next: first the premises and the building permit, then the restaurant licence, then the registrations.',
    },
    steps: [
      {
        id: 'mietvertrag',
        weight: 'pflicht',
        title: { de: 'Räume prüfen, Mietvertrag nur mit Ausstieg', en: 'Check the premises, sign a lease only with a way out' },
        summary: {
          de: '„Hier war vorher auch ein Restaurant" heißt nicht, dass du einfach weitermachen darfst. Prüf die genehmigte Nutzung, bevor du unterschreibst, und unterschreib nur mit einer Bedingung.',
          en: '"There used to be a restaurant here" does not mean you can simply carry on. Check the approved use before you sign, and only sign with a condition.',
        },
        details: [
          {
            de: 'Vorher prüfen: die genehmigte Nutzung (Akteneinsicht im Bauarchiv, 35 €), ob das Haus unter Denkmalschutz steht (die ganze Altstadt ist ein Ensemble), Stellplätze, Abluft, Fettabscheider, Toiletten, Nachbarn und Lärm. Einzelfragen beantwortet die Bauordnung auch verbindlich, als Vorbescheid, der vier Jahre gilt.',
            en: 'Check beforehand: the approved use (file inspection at the building archive, 35 €), whether the building is listed (the whole old town is a protected ensemble), parking, extraction, grease separator, toilets, neighbours and noise. The building authority also answers individual questions bindingly, as a preliminary ruling valid for four years.',
          },
          {
            de: 'Den Vertrag unter die Bedingung stellen, dass Baugenehmigung und Gaststättenerlaubnis erteilt werden, mit Rücktrittsrecht und mietfreier Zeit bis dahin. Die IHK nennt das eine aufschiebende Bedingung. Ein Gewerbemietvertrag über mehr als ein Jahr braucht Textform, sonst gilt er als unbefristet.',
            en: 'Make the contract conditional on the building permit and the restaurant licence being granted, with a right to withdraw and rent-free time until then. The chamber of commerce calls this a suspensive condition. A commercial lease for more than one year needs text form, otherwise it counts as indefinite.',
          },
          {
            de: 'Inventar und Ablöse vom Vormieter: Klär, wem was gehört. Leihinventar der Brauerei, geleaste Geräte und sicherungsübereignete Möbel gehören nicht dem Vormieter. Übernimmst du einen laufenden Betrieb, gehen die Angestellten mit über, und für Steuern und alte Schulden kannst du haften.',
            en: 'Inventory and key money from the previous tenant: find out who owns what. Brewery loan inventory, leased equipment and furniture pledged to a lender do not belong to the previous tenant. If you take over a running business, the staff transfer with it, and you can be liable for taxes and old debts.',
          },
          {
            de: 'Kochkurse in einem eigenen Studio, etwa in einem ehemaligen Laden: Auch das ist eine neue Nutzung, frag die Bauordnung vorher. Kochkurse zu Hause: Der Vermieter muss zustimmen, sobald Kundschaft kommt, und der Bundesgerichtshof ist dabei streng. Schon Gitarrenunterricht für rund zwölf Schüler:innen an drei Tagen pro Woche musste ein Vermieter nicht dulden.',
            en: 'Cooking classes in a studio of your own, say in a former shop: that is a new use too, ask the building authority first. Cooking classes at home: the landlord has to agree as soon as customers come, and the Federal Court of Justice is strict about it. A landlord did not even have to tolerate guitar lessons for about twelve pupils on three days a week.',
          },
          {
            de: 'Zu Hause gilt außerdem Nürnbergs Satzung gegen die Zweckentfremdung von Wohnraum, sobald mehr als die Hälfte der Wohnung gewerblich genutzt wird. Einfacher ist eine Mietküche: Die Stadt vermietet zum Beispiel die Küche im Kulturladen Gartenstadt, auch für Kochkurse.',
            en: 'At home, Nuremberg\'s bylaw against misusing housing also applies once more than half of the flat is used commercially. A rented kitchen is simpler: the city, for example, rents out the kitchen at the Kulturladen Gartenstadt, also for cooking classes.',
          },
          {
            de: 'Miet- und Lieferverträge vor der Unterschrift prüfen lassen. DEHOGA-Mitglieder haben dafür eine Rechtsschutzversicherung, die IHK berät zum Mietrecht.',
            en: 'Have lease and supply contracts checked before signing. DEHOGA members have legal-expenses insurance for this, and the chamber of commerce advises on tenancy law.',
          },
        ],
        contacts: [BAUORDNUNG, STAB_WOHNEN],
        links: [
          {
            label: { de: 'Kulturladen Gartenstadt: Räume und Küche mieten', en: 'Kulturladen Gartenstadt: rent rooms and the kitchen (German)' },
            url: 'https://www.nuernberg.de/internet/kuf_kultur/gartenstadt_vermietungen.html',
          },
        ],
      },
      {
        id: 'baugenehmigung',
        weight: 'pflicht',
        professions: RESTAURANT,
        title: { de: 'Nutzungsänderung und Baugenehmigung', en: 'Change of use and building permit' },
        summary: {
          de: 'Aus einem Laden oder Büro wird ein Restaurant fast nie ohne Bauantrag: Brandschutz, Stellplätze, Lärm und Abluft ändern sich. Plan zwei bis sechs Monate ein.',
          en: 'A shop or office almost never becomes a restaurant without a building application: fire protection, parking, noise and extraction all change. Plan for two to six months.',
        },
        details: [
          {
            de: 'Den Antrag stellt ein:e bauvorlageberechtigte:r Entwurfsverfasser:in, digital über das BayernPortal oder per Post. Die Bauordnung prüft in drei Wochen die Vollständigkeit. Wer fehlende Unterlagen nicht rechtzeitig nachreicht, dessen Antrag gilt als zurückgenommen. Eine Genehmigung durch Fristablauf gibt es für Restaurants nicht.',
            en: 'The application is submitted by an authorised designer, digitally via the BayernPortal or by post. The building authority checks completeness within three weeks. If missing documents are not supplied in time, the application counts as withdrawn. There is no approval by lapse of time for restaurants.',
          },
          {
            de: 'Stellplätze: in Nürnberg ein Autostellplatz je 40 m² Gastraum, innerhalb des Rings nur 80 % davon, und nur für den Mehrbedarf gegenüber der alten Nutzung. Wer sie nicht bauen kann, löst sie ab: 15.000 € je Platz innerhalb des Rings, 11.500 € außerhalb.',
            en: 'Parking: in Nuremberg one car space per 40 m² of guest area, inside the ring road only 80 % of that, and only for the extra demand compared with the previous use. If you cannot build them, you pay instead: 15,000 € per space inside the ring road, 11,500 € outside.',
          },
          {
            de: 'Größe zählt: Mit mehr als 60 Gastplätzen, die nicht nur im Erdgeschoss liegen, oder mehr als 100 im Erdgeschoss wird dein Restaurant ein Sonderbau, mit geprüftem Brandschutz und längerem Verfahren. Wer darunter bleibt, spart Zeit und Geld.',
            en: 'Size matters: with more than 60 guest seats not only on the ground floor, or more than 100 on the ground floor, your restaurant becomes a special building, with checked fire protection and a longer procedure. Staying below saves time and money.',
          },
          {
            de: 'Toiletten: Eine feste Zahl gibt es nicht mehr, das entscheidet die Stadt im Einzelfall. Gästetoiletten müssen in der erforderlichen Zahl barrierefrei sein, bei Umbauten gibt es Ausnahmen, wenn der Aufwand unverhältnismäßig wäre.',
            en: 'Toilets: there is no fixed number any more, the city decides case by case. The required number of guest toilets must be barrier-free; for conversions there are exceptions if the effort would be disproportionate.',
          },
          {
            de: 'Nach der Genehmigung: Baubeginn mindestens eine Woche vorher anzeigen, nach dem Umbau die Abnahme durch die Baukontrolle. Brauchst du eine Gaststättenerlaubnis, gehören Genehmigung und Abnahme zu ihren Unterlagen.',
            en: 'After the permit: announce the start of works at least one week in advance, and after the conversion have the building inspection sign it off. If you need a restaurant licence, permit and sign-off are part of its documents.',
          },
        ],
        contacts: [BAUORDNUNG],
        links: [
          { label: { de: 'Stellplatzsatzung Nürnberg', en: 'Nuremberg parking bylaw (German)' }, url: 'https://www.nuernberg.de/internet/bauordnung/sts.html' },
        ],
      },
      {
        id: 'gewerbe',
        weight: 'pflicht',
        title: { de: 'Gewerbe anmelden', en: 'Register the trade' },
        summary: {
          de: 'Beim Ordnungsamt, 45 €, spätestens mit dem Start. Wer eine Gaststättenerlaubnis braucht, meldet nur dort an, nicht im Bürgeramt, und bringt die Erlaubnis mit.',
          en: 'At the Ordnungsamt, 45 €, at the latest when you start. If you need a restaurant licence, you register only there, not at a citizens\' office, and bring the licence with you.',
        },
        details: [
          {
            de: 'Online über das BayernPortal oder vor Ort. Danach bekommen Finanzamt, IHK und Berufsgenossenschaft deine Daten, und du bekommst von jedem Post.',
            en: 'Online via the BayernPortal or in person. Afterwards the tax office, the chamber of commerce and the accident insurer receive your details, and you get mail from each of them.',
          },
          {
            de: 'Als Tätigkeit reicht eine klare Beschreibung, zum Beispiel „Betrieb einer Speisegaststätte" oder „Kochkurse und Kochevents".',
            en: 'A clear description of the activity is enough, for example "running a restaurant" or "cooking classes and cooking events".',
          },
          {
            de: 'Noch keine Räume? Du kannst mit der Privatadresse anmelden und dazuschreiben, dass dort nur die Verwaltung stattfindet. Für ein Restaurant mit Alkohol hilft das nicht, die Erlaubnis hängt an den Räumen.',
            en: 'No premises yet? You can register with your private address and add that only administration happens there. For a restaurant serving alcohol that does not help: the licence is tied to the premises.',
          },
          {
            de: 'Kochkurse als freier Beruf: keine Gewerbeanmeldung. Dann informierst du Lebensmittelüberwachung, Berufsgenossenschaft und Finanzamt selbst, denn es leitet dich niemand weiter.',
            en: 'Cooking classes as a liberal profession: no trade registration. Then you inform the food inspectors, the accident insurer and the tax office yourself, because nobody forwards your details.',
          },
        ],
        joe: {
          de: 'Die Sache mit der Adresse habe ich am Telefon gelernt: Ich hatte den Salon noch nicht und wollte mein Nebengewerbe trotzdem anmelden. „Nur Verwaltung" dazuschreiben, fertig.',
          en: 'The address thing I learned on the phone: I did not have the salon yet and still wanted to register my side business. Add "administration only", done.',
        },
        contacts: [GEWERBEAMT],
      },
      {
        id: 'gaststaettenerlaubnis',
        weight: 'pflicht',
        title: { de: 'Gaststättenerlaubnis, wenn Alkohol ausgeschenkt wird', en: 'Restaurant licence if you serve alcohol' },
        summary: {
          de: 'Ohne Alkohol keine Erlaubnis, nur die Gewerbeanmeldung. Mit Alkohol brauchst du sie vor dem ersten Glas, beantragt etwa vier Wochen vor der Eröffnung. Wein im Kochkurs zählt sehr wahrscheinlich mit.',
          en: 'Without alcohol no licence, just the trade registration. With alcohol you need it before the first glass, applied for about four weeks before opening. Wine at a cooking class very probably counts too.',
        },
        details: [
          {
            de: 'Unterlagen: Ausweis, behördliches Führungszeugnis und Auszug aus dem Gewerbezentralregister (je 13 €, direkt ans Ordnungsamt, Verwendungszweck Gaststättenerlaubnis), Unbedenklichkeitsbescheinigungen von Finanzamt und städtischem Steueramt (10 €), unterschriebener Mietvertrag, Grundrisse von Gast- und Personalräumen, IHK-Unterrichtungsnachweis und bei einem Umbau die Baugenehmigung mit Abnahme.',
            en: 'Documents: ID, official certificate of good conduct and trade register extract (13 € each, sent directly to the Ordnungsamt, purpose "Gaststättenerlaubnis"), tax clearance certificates from the tax office and the city tax office (10 €), signed lease, floor plans of guest and staff rooms, the IHK instruction certificate and, after a conversion, the building permit with sign-off.',
          },
          {
            de: 'Gebühr je nach Betriebsart und Nettomiete, höchstens 6.000 €. Online-Antrag möglich, dann alle Unterlagen vollständig hochladen. Alkohol ohne Erlaubnis auszuschenken kostet bis zu 5.000 € Bußgeld.',
            en: 'Fee depending on the type of business and net rent, at most 6,000 €. Online application possible, then upload all documents completely. Serving alcohol without a licence costs up to 5,000 € in fines.',
          },
          {
            de: 'IHK-Unterrichtung: ein Nachmittag (12:30 bis etwa 18 Uhr) an der IHK-Akademie, 105 €, mit Dolmetscher 165 €. Einmal im Monat außer August, Anmeldung schriftlich bis drei Wochen vorher, die Plätze sind begrenzt. Wer eine Ausbildung als Koch oder Köchin oder in Hotel und Gastronomie hat, kann sich befreien lassen (40 €).',
            en: 'IHK instruction: one afternoon (12:30 to about 6 pm) at the IHK academy, 105 €, with an interpreter 165 €. Once a month except August, register in writing up to three weeks ahead, places are limited. Anyone trained as a cook or in hotels and gastronomy can get an exemption (40 €).',
          },
          {
            de: 'Buch die Unterrichtung früh. Sie hängt nicht an den Räumen, und wer einen Termin verpasst, wartet einen Monat, im Sommer zwei.',
            en: 'Book the instruction early. It does not depend on the premises, and missing a date means waiting a month, two in summer.',
          },
          {
            de: 'Die Erlaubnis gilt nur für dich, diese Räume und diese Betriebsart. Wer den Betrieb für dich leitet, braucht eine Stellvertretungserlaubnis, und Alkohol draußen muss in der Erlaubnis stehen. Außerdem darf mindestens ein alkoholfreies Getränk nicht teurer sein als das billigste alkoholische, gerechnet pro Liter.',
            en: 'The licence applies only to you, these premises and this type of business. Anyone managing the business for you needs a deputy licence, and alcohol outside must be covered by the licence. Also, at least one non-alcoholic drink must not cost more than the cheapest alcoholic one, calculated per litre.',
          },
          {
            de: 'Kochkurse mit Wein: Ausgenommen sind nur kostenlose Kostproben, Wein im Kurspreis ist das sehr wahrscheinlich nicht. Frag das Ordnungsamt schriftlich, biete alkoholfreie Begleitung an, oder lass einen Partner mit Erlaubnis die Getränke im eigenen Namen verkaufen. Für einzelne Feste gibt es die Gestattung, zwei Wochen vorher beantragt.',
            en: 'Cooking classes with wine: only free tastings are exempt, and wine included in the class price very probably is not. Ask the Ordnungsamt in writing, offer non-alcoholic pairings, or let a partner with a licence sell the drinks in their own name. For one-off events there is the temporary permit, applied for two weeks ahead.',
          },
        ],
        contacts: [GASTSTAETTEN, IHK_UNTERRICHTUNG],
        links: [
          {
            label: { de: 'Stadt Nürnberg: Gaststättenerlaubnis', en: 'City of Nuremberg: restaurant licence (German)' },
            url: 'https://www.nuernberg.de/internet/stadtportal/behoerdenwegweiser/dienstleistung/gaststaettenerlaubnis.html',
          },
          {
            label: { de: 'Stadt Nürnberg: Gestattung für Veranstaltungen', en: 'City of Nuremberg: temporary permit for events (German)' },
            url: 'https://www.nuernberg.de/internet/stadtportal/behoerdenwegweiser/dienstleistung/bewirtung_veranstaltung.html',
          },
        ],
      },
      {
        id: 'aussengastro',
        weight: 'optional',
        professions: RESTAURANT,
        title: { de: 'Tische draußen: Freischankfläche beantragen', en: 'Tables outside: apply for outdoor seating' },
        summary: {
          de: 'Für Tische auf dem Gehweg brauchst du eine Sondernutzungserlaubnis vom Liegenschaftsamt, nicht vom Ordnungsamt. Rechne mit vier bis sechs Wochen.',
          en: 'For tables on the pavement you need a special-use permit from the Liegenschaftsamt (city property office), not from the Ordnungsamt. Allow four to six weeks.',
        },
        details: [
          {
            de: 'Antrag mit Lageplan und Skizze, online, per Post oder vor Ort. Die Saison läuft vom 1. Februar bis 15. November, Heizstrahler, Zelte und Planen sind verboten.',
            en: 'Application with a site plan and sketch, online, by post or in person. The season runs from 1 February to 15 November; patio heaters, tents and tarps are banned.',
          },
          {
            de: 'Gebühr pro Saison 17,70 bis 33,10 € je Quadratmeter, je nach Lage. In Teilen der Altstadt kommt die Hälfte oder das Doppelte obendrauf.',
            en: 'Fee per season 17.70 to 33.10 € per square metre, depending on location. In parts of the old town another half or double that is added.',
          },
          {
            de: 'Draußen beginnt in Nürnberg die Sperrzeit um 23 Uhr. Die Innenstadt hat Gestaltungsregeln: Möbel aus Metall, Holz oder Rattan, keine Bierbänke, Schirme einfarbig hell und Werbung nur am Volant.',
            en: 'Outside, closing time in Nuremberg starts at 11 pm. The city centre has design rules: furniture of metal, wood or rattan, no beer benches, umbrellas in one light colour and advertising only on the valance.',
          },
          {
            de: 'Mehr als 100 m² draußen brauchen zusätzlich eine Baugenehmigung und Stellplätze. Schenkst du draußen Alkohol aus, muss die Fläche in der Gaststättenerlaubnis stehen.',
            en: 'More than 100 m² outside additionally needs a building permit and parking spaces. If you serve alcohol outside, the area must be covered by the restaurant licence.',
          },
        ],
        contacts: [LIEGENSCHAFTSAMT],
        links: [
          {
            label: { de: 'Gestaltungsleitlinien für die Innenstadt (PDF)', en: 'Design guidelines for the city centre (PDF, German)' },
            url: 'https://www.nuernberg.de/imperia/md/liegenschaftsamt/dokumente/la_4/gestaltungsleitlinieinnenstadt.pdf',
          },
        ],
      },
      {
        id: 'finanzamt',
        weight: 'pflicht',
        title: { de: 'Finanzamt: Fragebogen, zwei Steuersätze, Kasse', en: 'Tax office: questionnaire, two VAT rates, till' },
        summary: {
          de: 'Innerhalb eines Monats nach Start, elektronisch über ELSTER. Daraus kommt deine Steuernummer. In der Gastronomie gehören zwei Dinge gleich dazu: welcher Steuersatz wofür gilt, und die Meldung deiner Kasse.',
          en: 'Within one month of starting, electronically via ELSTER. It produces your tax number. In gastronomy two more things belong with it: which VAT rate applies to what, and registering your till.',
        },
        details: [
          {
            de: 'ELSTER-Zertifikat früh beantragen, der Freischaltcode kommt per Brief. Dann den Fragebogen zur steuerlichen Erfassung ausfüllen und die IBAN hinterlegen.',
            en: 'Apply for the ELSTER certificate early, the activation code comes by post. Then fill in the tax registration questionnaire and store your IBAN.',
          },
          {
            de: 'Umsatzsteuer: Speisen 7 %, im Lokal wie zum Mitnehmen, seit 1.1.2026 dauerhaft. Getränke 19 %. Bei Pauschalpreisen wie Buffet oder Brunch mit Getränken darfst du 30 % des Preises als Getränkeanteil ansetzen. Kochkurse sind in der Regel 19 %, auch wenn das Essen im Preis steckt.',
            en: 'VAT: food 7 %, eaten in or taken away, permanently since 1 January 2026. Drinks 19 %. For flat prices such as a buffet or brunch with drinks you may count 30 % of the price as the drinks share. Cooking classes are usually 19 %, even if the food is included in the price.',
          },
          {
            de: 'Kleinunternehmerregelung (keine Umsatzsteuer bis 25.000 € im Vorjahr und 100.000 € im laufenden Jahr, im Gründungsjahr gilt 25.000 €): kann für Kochkurse im Nebenerwerb passen, für ein Restaurant fast nie. Die Grenze ist schnell erreicht, und du bekommst die Umsatzsteuer auf Küche und Einrichtung nicht zurück. Restaurant und Kurse derselben Person zählen zusammen.',
            en: 'Small-business rule (no VAT up to 25,000 € last year and 100,000 € this year, in the founding year 25,000 €): can suit cooking classes as a side business, almost never a restaurant. The limit comes quickly, and you do not get back the VAT on kitchen and furniture. A restaurant and classes run by the same person count together.',
          },
          {
            de: 'Jede elektronische Kasse innerhalb eines Monats nach Anschaffung über Mein ELSTER melden, mehr dazu im Schritt Kasse. Kochkurse, die online oder per Überweisung bezahlt werden, brauchen keine Kasse.',
            en: 'Register every electronic till via Mein ELSTER within one month of purchase, more on this in the till step. Cooking classes paid online or by bank transfer need no till.',
          },
          {
            de: 'Seit 1.1.2026 gibt es ein gemeinsames Finanzamt Nürnberg (vorher Nord, Süd und Zentralfinanzamt). Die Servicezentren arbeiten seit September 2026 in der Regel mit Termin.',
            en: 'Since 1 January 2026 there is one joint Nuremberg tax office (previously North, South and the central office). Since September 2026 its service centres usually work by appointment.',
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
          de: 'Brauchst du, sobald du im Ausland einkaufst, zum Beispiel Küchengeräte aus Italien oder ein Software-Abo aus den USA.',
          en: 'Needed as soon as you buy abroad, for example kitchen equipment from Italy or a software subscription from the US.',
        },
        details: [
          {
            de: 'Online beim Bundeszentralamt für Steuern beantragen, mit deiner Steuernummer. Kommt per Post, ein bis zwei Wochen.',
            en: 'Apply online at the Federal Central Tax Office with your tax number. Arrives by post, one to two weeks.',
          },
          {
            de: 'Bei ausländischen Anbietern die Nummer im Konto hinterlegen. Dann rechnen sie ohne Mehrwertsteuer ab (Reverse Charge) und du meldest sie in der Voranmeldung. Das gilt auch als Kleinunternehmer:in, etwa für Provisionen von Buchungsplattformen aus dem EU-Ausland.',
            en: 'Store the number in your account with foreign providers. They then invoice without VAT (reverse charge) and you declare it in your advance return. That applies under the small-business rule too, for example to commissions from booking platforms based elsewhere in the EU.',
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
        title: { de: 'IHK und DEHOGA: Pflicht und Kür', en: 'Chamber of commerce and DEHOGA: must and may' },
        summary: {
          de: 'Mit der Gewerbeanmeldung bist du automatisch IHK-Mitglied, als Gründer:in meist zwei Jahre beitragsfrei. Der Gastroverband DEHOGA ist freiwillig und für ein Restaurant oft sein Geld wert.',
          en: 'With the trade registration you automatically become a chamber of commerce member, usually free of fees for two years as a founder. The DEHOGA hospitality association is voluntary and often worth its money for a restaurant.',
        },
        details: [
          {
            de: 'IHK-Beitrag: Gründer:innen zahlen in den ersten zwei Jahren nichts, solange der Gewinn nicht über 25.000 € liegt. Danach sind kleine Betriebe ohne Handelsregistereintrag bis 5.200 € Gewinn frei.',
            en: 'Chamber fee: founders pay nothing in the first two years as long as profit stays at or below 25,000 €. After that, small businesses not in the commercial register are exempt up to 5,200 € of profit.',
          },
          {
            de: 'Die IHK kann mehr, als man denkt: Gründungsberatung, Mietrechtsberatung, Finanzierungssprechtage, die Gaststättenunterrichtung und Merkblätter zu Verpackung und Mehrweg.',
            en: 'The chamber offers more than people think: start-up advice, tenancy-law advice, financing consultation days, the restaurant instruction and leaflets on packaging and reusables.',
          },
          {
            de: 'DEHOGA Bayern ist freiwillig. Mitglieder bekommen Rechtsberatung, Musterverträge, 20 % Rabatt auf alle GEMA-Tarife und eine Rechtsschutzversicherung, die auch Pacht- und Bierlieferverträge abdeckt. Für Gründer:innen gibt es eine günstige Einstiegsmitgliedschaft.',
            en: 'DEHOGA Bayern is voluntary. Members get legal advice, template contracts, 20 % off all GEMA music-licence tariffs and legal-expenses insurance that also covers lease and beer-supply contracts. There is a cheap starter membership for founders.',
          },
          {
            de: 'Kochkurse als freier Beruf: keine Kammer, keine IHK-Beiträge.',
            en: 'Cooking classes as a liberal profession: no chamber, no chamber fees.',
          },
        ],
        contacts: [IHK, DEHOGA_MFR],
      },
      {
        id: 'berufsgenossenschaft',
        weight: 'pflicht',
        title: { de: 'Berufsgenossenschaft BGN anmelden', en: 'Register with the BGN accident insurer' },
        summary: {
          de: 'Innerhalb einer Woche nach Start, und als Start zählen schon die Umbauarbeiten. Für die Gastronomie ist die BGN zuständig. Deine Angestellten sind dort automatisch versichert, du selbst nicht.',
          en: 'Within one week of starting, and the conversion works already count as the start. For gastronomy the BGN is responsible. Your employees are insured there automatically, you yourself are not.',
        },
        details: [
          {
            de: 'Eine Gewerbeanmeldung in dieser Woche zählt auch als Meldung, die BGN will trotzdem ihre eigene Anmeldung, online. Wer freiberuflich startet, meldet sich immer selbst an.',
            en: 'A trade registration within that week also counts as notification, but the BGN still wants its own registration, online. Anyone starting as a liberal profession always registers directly.',
          },
          {
            de: 'Unternehmer:innen sind bei der BGN nicht automatisch versichert. Eine freiwillige Versicherung kostet 2026 je nach Versicherungssumme etwa 370 bis 930 € im Jahr und gilt ab dem Tag nach dem Antrag. Ein Arbeitsunfall ohne sie kann das Geschäft kosten.',
            en: 'Business owners are not automatically insured at the BGN. Voluntary cover costs about 370 to 930 € a year in 2026, depending on the insured sum, and applies from the day after the application. A work accident without it can cost you the business.',
          },
          {
            de: 'Kochschule: Die BGN führt Koch, Eventkoch und Catering in ihrem Verzeichnis, ein reiner Unterrichtsbetrieb kann auch zur VBG gehören. Aussuchen kannst du es nicht. Im Zweifel klärt es die kostenlose Infoline der Unfallversicherung, 0800 6050404.',
            en: 'Cooking school: the BGN lists cook, event cook and catering in its register; a pure teaching business may belong to the VBG instead. You cannot choose. When in doubt the statutory accident insurance\'s free infoline settles it, 0800 6050404.',
          },
          {
            de: 'Ab der ersten angestellten Person: Gefährdungsbeurteilung, Ersthelfer:in (die BGN zahlt den Kurs) und regelmäßige Unterweisungen. Für Betriebe bis 20 Beschäftigte ist die Betreuung durch die BGN kostenlos.',
            en: 'From the first employee on: risk assessment, a first aider (the BGN pays for the course) and regular safety briefings. For businesses with up to 20 employees the BGN\'s safety support is free.',
          },
          {
            de: 'Küche: ein Fettbrand-Feuerlöscher der Brandklasse F für die Fritteuse, rutschhemmender Boden, Fettfilter der Abzugshaube mindestens alle 14 Tage reinigen, Gasgeräte nach Vorschrift.',
            en: 'Kitchen: a class F fat-fire extinguisher for the fryer, slip-resistant flooring, extractor-hood grease filters cleaned at least every 14 days, gas appliances installed to regulations.',
          },
        ],
        joe: {
          de: 'Mein Anruf bei der BGW war kurz: „Muss ich noch etwas machen?" Antwort: nein, aber die Schulung wäre gut. Ich habe sie gebucht.',
          en: 'My call to the BGW was short: "Do I need to do anything else?" Answer: no, but the training would be good. I booked it.',
        },
        contacts: [BGN, BGN_PRAEVENTION],
        links: [
          { label: { de: 'BGN: Gründungsseite mit Checklisten', en: 'BGN: founders\' page with checklists (German)' }, url: 'https://www.bgn.de/gruendung' },
        ],
      },
      {
        id: 'sozialversicherung',
        weight: 'pflicht',
        title: { de: 'Kranken- und Rentenversicherung klären', en: 'Settle health and pension insurance' },
        summary: {
          de: 'Der teuerste Posten im ersten Jahr. Wer Kochkurse gibt, ist als selbständige Lehrkraft fast immer rentenversicherungspflichtig, wer ein Restaurant führt, nicht.',
          en: 'The most expensive item in year one. Anyone teaching cooking classes is almost always subject to mandatory pension insurance as a self-employed teacher; anyone running a restaurant is not.',
        },
        details: [
          {
            de: 'Gesetzlich freiwillig versichert: Beitrag nach Einkommen, am Anfang oft der Mindestbeitrag. Privat: günstiger in jungen Jahren, dafür kaum ein Weg zurück. Entscheide es nicht nach dem ersten Monat.',
            en: 'Voluntary statutory cover: contribution based on income, often the minimum at first. Private: cheaper when young, but almost no way back. Do not decide it based on your first month.',
          },
          {
            de: 'Kochkurse: Selbständige Lehrer:innen ohne versicherungspflichtige Angestellte sind rentenversicherungspflichtig, die Rentenversicherung zählt auch Kurse wie Golf oder Aerobic dazu. Melden innerhalb von drei Monaten nach Start, sonst drohen Nachzahlungen für bis zu vier Jahre.',
            en: 'Cooking classes: self-employed teachers without employees subject to insurance must pay into the pension scheme, and the pension insurance counts classes like golf or aerobics among them. Report within three months of starting, otherwise back payments for up to four years may follow.',
          },
          {
            de: 'Beitrag 2026: Regelbeitrag 735,63 € im Monat. Als Gründer:in zahlst du im Startjahr und den drei folgenden Kalenderjahren den halben, 367,82 €. Oder einkommensgerecht 18,6 % vom Gewinn, mindestens 112,16 €.',
            en: 'Contribution 2026: the standard rate is 735.63 € a month. As a founder you pay half, 367.82 €, in the starting year and the three calendar years after it. Or income-based, 18.6 % of profit, at least 112.16 €.',
          },
          {
            de: 'Frei bleibst du, wenn der Gewinn aus den Kursen regelmäßig höchstens 603 € im Monat beträgt (2026), oder wenn du Angestellte hast, die zusammen mehr als 603 € im Monat verdienen.',
            en: 'You stay exempt if profit from the classes is regularly no more than 603 € a month (2026), or if you employ staff who together earn more than 603 € a month.',
          },
          {
            de: 'Das kostenlose Servicetelefon der Rentenversicherung beantwortet die Frage „bin ich pflichtig?" verbindlich, wenn du deine Tätigkeit genau beschreibst.',
            en: 'The pension insurance\'s free service line answers "am I liable?" reliably if you describe your activity precisely.',
          },
        ],
        contacts: [DRV],
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: 'absichern',
    index: '04',
    tag: { de: 'Sicherheit', en: 'Safety' },
    title: { de: 'Absichern: Versicherung, Kasse, Personal', en: 'Secure yourself: insurance, till, staff' },
    lead: {
      de: 'Nichts davon bringt Gäste. Alles davon entscheidet, ob ein schlechter Abend, eine Kassenprüfung oder eine Zollkontrolle dich das Geschäft kostet.',
      en: 'None of this brings guests. All of it decides whether one bad evening, a cash inspection or a customs check costs you the business.',
    },
    steps: [
      {
        id: 'versicherungen',
        weight: 'pflicht',
        title: { de: 'Versicherungen: Haftpflicht zuerst', en: 'Insurance: liability first' },
        summary: {
          de: 'Vor dem ersten Gast. Eine Betriebshaftpflicht mit Produkthaftpflicht deckt, was in der Gastronomie am teuersten wird: eine Lebensmittelvergiftung, ein Allergieschock, ein Sturz.',
          en: 'Before the first guest. Business liability insurance with product liability covers what gets most expensive in gastronomy: food poisoning, an allergic shock, a fall.',
        },
        details: [
          {
            de: 'Betriebshaftpflicht mit erweiterter Produkthaftpflicht (Lebensmittelvergiftung, Allergenfehler) und Garderobe. Bei Kochkursen die Kurse und Teilnehmenden ausdrücklich nennen lassen, dazu Mietsachschäden, wenn du in fremden Küchen arbeitest.',
            en: 'Business liability with extended product liability (food poisoning, allergen mistakes) and cloakroom. For cooking classes have the classes and participants named explicitly, plus damage to rented property if you work in other people\'s kitchens.',
          },
          {
            de: 'Kursteilnehmende sind nicht gesetzlich unfallversichert. Schneidet sich jemand oder verbrennt sich, zahlt deine Haftpflicht, nicht die Berufsgenossenschaft. Und die Haftung für fahrlässige Verletzungen kannst du in AGB nicht ausschließen.',
            en: 'Class participants have no statutory accident insurance. If someone cuts or burns themselves, your liability insurance pays, not the accident insurer. And you cannot exclude liability for negligent injuries in your terms.',
          },
          {
            de: 'Stark empfohlen: Inhaltsversicherung (Feuer, Einbruch, Wasser) und Betriebsunterbrechung. Optional: Glas, Elektronik, Kühlgut.',
            en: 'Strongly recommended: contents insurance (fire, burglary, water) and business interruption. Optional: glass, electronics, refrigerated goods.',
          },
          {
            de: 'Eine Betriebsschließungsversicherung zahlt, wenn eine Behörde dich wegen Infektionsgefahr schließt. Lies die Krankheitsliste im Vertrag: Nach Corona hat der Bundesgerichtshof Policen mit fester Liste nicht zahlen lassen.',
            en: 'Business closure insurance pays if an authority closes you because of an infection risk. Read the list of diseases in the policy: after Covid, the Federal Court of Justice let policies with a fixed list off paying.',
          },
          {
            de: 'Rechtsschutz ist optional, DEHOGA-Bayern-Mitglieder haben ihn automatisch.',
            en: 'Legal expenses insurance is optional; DEHOGA Bayern members have it automatically.',
          },
        ],
        joe: {
          de: 'Ehrlich: Mein Vergleich zwischen Betriebshaftpflicht und Vermögensschadenhaftpflicht hat länger gedauert, als er sollte. Frag mich, wo ich gelandet bin und wen ich dafür angerufen habe.',
          en: 'Honestly: my comparison between business liability and financial loss liability took longer than it should have. Ask me where I ended up and who I called for it.',
        },
      },
      {
        id: 'kasse',
        weight: 'pflicht',
        professions: RESTAURANT,
        title: { de: 'Kasse mit TSE, Belege, Kassen-Nachschau', en: 'Till with TSE, receipts, surprise cash inspections' },
        summary: {
          de: 'Das Finanzamt kommt genauso unangekündigt wie die Lebensmittelkontrolle, zur Kassen-Nachschau. Eine elektronische Kasse mit zertifizierter TSE ist der sichere Weg.',
          en: 'The tax office comes just as unannounced as the food inspectors, for a surprise cash inspection. An electronic till with a certified TSE is the safe way.',
        },
        details: [
          {
            de: 'Eine elektronische Kasse braucht eine zertifizierte technische Sicherheitseinrichtung (TSE), die jede Buchung signiert. Jeder Gast bekommt einen Beleg, auf Papier oder mit Zustimmung elektronisch.',
            en: 'An electronic till needs a certified technical security device (TSE) that signs every transaction. Every guest gets a receipt, on paper or, with their consent, electronically.',
          },
          {
            de: 'Melden: jede elektronische Kasse innerhalb eines Monats nach Anschaffung über Mein ELSTER, genauso wenn du sie abschaffst. Eine Meldung pro Betriebsstätte, mit allen Kassen darin.',
            en: 'Report: every electronic till within one month of purchase via Mein ELSTER, and likewise when you retire it. One report per business location, listing all tills there.',
          },
          {
            de: 'Eine offene Ladenkasse ohne Kassensystem ist erlaubt. Mit Kartenzahlung und zwei Steuersätzen musst du dann aber jeden Verkauf einzeln von Hand aufschreiben, für ein Restaurant praktisch nicht machbar.',
            en: 'An open cash drawer without a till system is allowed. With card payments and two VAT rates, though, you then have to record every single sale by hand, practically impossible for a restaurant.',
          },
          {
            de: 'Kassen-Nachschau: Das Finanzamt darf während der Öffnungszeiten ohne Ankündigung kommen, Kassendaten verlangen und einen Kassensturz machen. Fehler kosten bis zu 25.000 € Bußgeld und führen zu Hinzuschätzungen.',
            en: 'Surprise cash inspection: the tax office may come unannounced during opening hours, demand till data and count the cash. Errors cost up to 25,000 € in fines and lead to estimated additions to your revenue.',
          },
          {
            de: 'Trinkgeld für deine Angestellten ist für sie steuerfrei. Trinkgeld, das du als Inhaber:in bekommst, ist Umsatz und gehört in die Kasse.',
            en: 'Tips for your employees are tax-free for them. Tips you receive as the owner are revenue and belong in the till.',
          },
          {
            de: 'In Planung (Stand September 2026, noch nicht beschlossen): Kassenpflicht ab 2028 für Betriebe mit mehr als 100.000 € Umsatz, der digitale Beleg als Standard, und ab 2027 die Pflicht, mindestens eine digitale Zahlungsart anzunehmen.',
            en: 'Planned (as of September 2026, not yet passed): a till obligation from 2028 for businesses with more than 100,000 € turnover, digital receipts as the default, and from 2027 a duty to accept at least one digital payment method.',
          },
        ],
        contacts: [FINANZAMT],
        links: [
          {
            label: { de: 'ELSTER: Mitteilung über Kassensysteme', en: 'ELSTER: till registration form (German)' },
            url: 'https://www.elster.de/eportal/formulare-leistungen/alleformulare/aufzeichnung146a',
          },
        ],
      },
      {
        id: 'konto',
        weight: 'empfohlen',
        title: { de: 'Geschäftskonto, Kartenzahlung, Rücklage', en: 'Business account, card payments, reserve' },
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
            de: 'Die Umsatzsteuer gehört dir nie: Schieb sie aus jeder Einnahme gleich auf ein Unterkonto, dazu eine Rücklage für die Einkommensteuer. Die erste Vorauszahlung kommt ohne Vorwarnung.',
            en: 'The VAT is never yours: move it out of every income straight to a sub-account, plus a reserve for income tax. The first advance tax payment comes without warning.',
          },
          {
            de: 'Kartenzahlung erwarten die Gäste. Vergleich die Gebühren pro Zahlung, bei kleinen Beträgen kosten sie mehr, als man denkt.',
            en: 'Guests expect card payment. Compare the fees per payment; with small amounts they cost more than you would think.',
          },
          {
            de: 'Der Kredit für Küche oder Umbau kommt am ehesten von der Hausbank, mit dem Finanzplan aus Etappe 01. Vergleich vorher drei Banken am Telefon.',
            en: 'A loan for the kitchen or the conversion most likely comes from your main bank, with the financial plan from stage 01. Compare three banks by phone first.',
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
        title: { de: 'Buchhaltung, Rechnungen, Bewirtungsbelege', en: 'Bookkeeping, invoices, business-meal receipts' },
        summary: {
          de: 'Belege acht Jahre aufbewahren, Bücher zehn. Und weil Geschäftsleute bei dir essen: Deine Belege müssen so aussehen, dass sie sie absetzen können.',
          en: 'Keep receipts for eight years, books for ten. And because business people eat at your place: your receipts must look the way they need them to deduct the meal.',
        },
        details: [
          {
            de: 'Aufbewahrung: Buchungsbelege seit 2025 acht Jahre, Bücher und Abschlüsse zehn, Kassendaten acht Jahre, unveränderbar und exportierbar.',
            en: 'Retention: accounting vouchers eight years since 2025, books and annual accounts ten, till data eight years, unalterable and exportable.',
          },
          {
            de: 'Bewirtungsbelege: Dein Beleg braucht Name und Adresse des Restaurants, Datum, jede Speise und jedes Getränk einzeln, Betrag und Steuer pro Satz und die TSE-Daten. Handgeschriebene Belege erkennt das Finanzamt bei Betrieben mit elektronischer Kasse nicht an. Über 250 € kommen Steuernummer, Rechnungsnummer und der Name der einladenden Person dazu.',
            en: 'Business-meal receipts: your receipt needs the restaurant\'s name and address, the date, every dish and drink itemised, amount and tax per rate, and the TSE data. The tax office does not accept handwritten receipts from businesses with an electronic till. Above 250 € the tax number, invoice number and the host\'s name are added.',
          },
          {
            de: 'E-Rechnung: Empfangen musst du seit 2025 können, ein E-Mail-Postfach reicht. Ausstellen an Firmen wird spätestens ab 2028 Pflicht, an Privatleute und bis 250 € nie. Das betrifft vor allem Firmenfeiern, Catering und Team-Kochevents.',
            en: 'E-invoices: you have had to be able to receive them since 2025, an email inbox is enough. Issuing them to businesses becomes mandatory by 2028 at the latest, never to private customers or up to 250 €. That mainly affects company parties, catering and team cooking events.',
          },
          {
            de: 'Belege im Original als PDF aufbewahren, nicht als Screenshot. Ordnerlogik: Jahr, Kategorie, Datum im Dateinamen.',
            en: 'Keep receipts as original PDFs, not screenshots. Folder logic: year, category, date in the file name.',
          },
        ],
        joe: {
          de: 'Meine erste Rechnung habe ich mit einem YouTube-Video und einer Vorlage geschrieben, dann auf ein Programm gewechselt. Der Wechsel war der bessere Teil. Die monatliche Belegsuche war vorher der schlechtere.',
          en: 'I wrote my first invoice with a YouTube video and a template, then switched to software. The switch was the better part. The monthly receipt hunt before it was the worse part.',
        },
      },
      {
        id: 'steuerberatung',
        weight: 'empfohlen',
        title: { de: 'Steuerberater:in finden, am besten mit Gastro-Erfahrung', en: 'Find a tax adviser, ideally one who knows gastronomy' },
        summary: {
          de: 'Zwei Steuersätze, Kasse, Trinkgeld, Lohn, Kassen-Nachschau: In der Gastronomie ist Steuerberatung kaum verzichtbar. Eine Kanzlei, die Gastro kennt, spart dir mehr, als sie kostet.',
          en: 'Two VAT rates, the till, tips, payroll, surprise cash inspections: in gastronomy a tax adviser is hard to do without. A firm that knows gastronomy saves you more than it costs.',
        },
        details: [
          {
            de: 'Frag in deinem Netzwerk nach einer Empfehlung, nicht bei Google.',
            en: 'Ask your network for a recommendation, not Google.',
          },
          {
            de: 'Fragen für den ersten Termin: Kleinunternehmer ja oder nein, Voranmeldung monatlich oder vierteljährlich, Pauschalpreise und Menüs richtig aufteilen, Kochkurse freiberuflich oder gewerblich, Lohnabrechnung, Kassensystem und Verfahrensdokumentation.',
            en: 'Questions for the first appointment: small-business rule yes or no, monthly or quarterly advance returns, splitting flat prices and set menus correctly, cooking classes as liberal profession or trade, payroll, till system and process documentation.',
          },
          {
            de: 'Das Finanzamt vergleicht deinen Wareneinsatz mit amtlichen Richtwerten für Gaststätten. Wer stark abweicht, muss es erklären können.',
            en: 'The tax office compares your cost of goods with official benchmark figures for restaurants. If you deviate a lot, you need to be able to explain it.',
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
        title: { de: 'Verträge, AGB, Gutscheine, Datenschutz', en: 'Contracts, terms, vouchers, data protection' },
        summary: {
          de: 'Miet- und Lieferverträge prüfen lassen, für Kochkurse AGB mit klarer Absageregel, und Gutscheine richtig verkaufen. Einmal sauber aufsetzen, dann jahrelang Ruhe.',
          en: 'Have lease and supply contracts checked, give cooking classes terms with a clear cancellation rule, and sell vouchers properly. Set it up cleanly once, then have peace for years.',
        },
        details: [
          {
            de: 'Kochkurse mit festem Termin haben kein 14-tägiges Widerrufsrecht, auch nicht online gebucht. Darauf musst du vor der Buchung aber hinweisen.',
            en: 'Cooking classes on a fixed date have no 14-day right of withdrawal, even when booked online. You do have to point this out before the booking, though.',
          },
          {
            de: 'Absageregel in den AGB: Pauschale Stornogebühren sind erlaubt, wenn sie den üblichen Schaden nicht übersteigen und ausdrücklich zulassen, dass jemand einen geringeren Schaden nachweist. Kulant und klar: eine Ersatzperson erlauben, und bei zu wenig Anmeldungen volle Rückzahlung.',
            en: 'Cancellation rule in your terms: flat cancellation fees are allowed if they do not exceed the usual loss and expressly let people prove a lower loss. Lenient and clear: allow a substitute participant, and a full refund if too few people sign up.',
          },
          {
            de: 'Gutscheine gelten drei Jahre ab Ende des Ausstellungsjahres, kürzere Fristen in AGB sind meist unwirksam. Datum draufdrucken. Online verkaufte Gutscheine haben ein Widerrufsrecht, und seit dem 19. Juni 2026 braucht dein Shop dafür einen Button „Vertrag widerrufen".',
            en: 'Vouchers are valid for three years from the end of the year of issue; shorter periods in terms are usually invalid. Print the date on them. Vouchers sold online come with a right of withdrawal, and since 19 June 2026 your shop needs a "withdraw from contract" button for it.',
          },
          {
            de: 'Gutscheine und Umsatzsteuer: Gutscheine nur für Kochkurse (19 %) sind Einzweck-Gutscheine, die Steuer fällt schon beim Verkauf an. Wertgutscheine, die auch für Essen (7 %) gelten, sind Mehrzweck-Gutscheine, versteuert wird beim Einlösen.',
            en: 'Vouchers and VAT: vouchers only for cooking classes (19 %) are single-purpose vouchers, the tax is due when you sell them. Value vouchers that also work for food (7 %) are multi-purpose vouchers, taxed when redeemed.',
          },
          {
            de: 'Datenschutz: Reservierungen und Buchungen sind personenbezogene Daten, Allergie-Angaben sogar Gesundheitsdaten. Nur so viel fragen, wie du brauchst, und nach dem Termin löschen. Fotos von Gästen oder Teilnehmenden für Social Media nur mit Einwilligung, bei Kindern mit der der Eltern.',
            en: 'Data protection: reservations and bookings are personal data, allergy details even health data. Ask only what you need and delete it after the date. Photos of guests or participants for social media only with consent, for children with the parents\' consent.',
          },
        ],
        joe: {
          de: 'Ich habe alle meine Vorlagen von einer Anwältin prüfen lassen und sie dafür bezahlt, auch wenn sie es umsonst angeboten hätte. Das war die richtige Entscheidung.',
          en: 'I had all my templates checked by a lawyer and paid her for it, even though she offered to do it for free. That was the right call.',
        },
      },
      {
        id: 'personal',
        weight: 'pflicht',
        professions: RESTAURANT,
        title: { de: 'Personal: Anmeldung am ersten Tag, Ausweis, Arbeitszeiten', en: 'Staff: registration on day one, ID, working hours' },
        summary: {
          de: 'Die Gastronomie ist die Branche, die der Zoll am häufigsten auf Schwarzarbeit prüft. Wer die Regeln ab der ersten Probeschicht einhält, hat nichts zu befürchten.',
          en: 'Gastronomy is the sector customs checks most often for undeclared work. If you follow the rules from the first trial shift, you have nothing to fear.',
        },
        details: [
          {
            de: 'Betriebsnummer bei der Bundesagentur für Arbeit beantragen, kostenlos, vor der ersten Anstellung, auch für Minijobs.',
            en: 'Apply for an establishment number from the Federal Employment Agency, free of charge, before the first hire, minijobs included.',
          },
          {
            de: 'Sofortmeldung: In der Gastronomie meldest du jede neue Person spätestens bei Arbeitsbeginn, auch Minijobs und Probeschichten. Die BGN warnt ausdrücklich: Unangemeldete Kennenlern-Schichten werden als Schwarzarbeit geprüft.',
            en: 'Immediate registration: in gastronomy you report every new person at the latest when they start work, minijobs and trial shifts included. The BGN warns explicitly: unregistered get-to-know-you shifts are checked as undeclared work.',
          },
          {
            de: 'Ausweispflicht: Alle Beschäftigten müssen einen Ausweis dabeihaben. Du musst sie vorher nachweislich schriftlich darauf hinweisen und den Hinweis aufbewahren.',
            en: 'ID duty: every employee must carry an ID. You must inform them of this in writing beforehand, in a way you can prove, and keep that note.',
          },
          {
            de: 'Arbeitszeit: Beginn, Ende und Dauer spätestens am siebten Tag danach aufschreiben, zwei Jahre aufbewahren. Mindestlohn 13,90 € (2026) und 14,60 € (2027). Minijob bis 603 € im Monat (2026), 633 € (2027).',
            en: 'Working time: record start, end and duration by the seventh day afterwards at the latest, keep for two years. Minimum wage 13.90 € (2026) and 14.60 € (2027). Minijob up to 603 € a month (2026), 633 € (2027).',
          },
          {
            de: 'Die Ruhezeit darf in der Gastronomie auf zehn Stunden sinken, wenn du es innerhalb eines Monats ausgleichst. Sonntagsarbeit ist erlaubt, aber mindestens 15 Sonntage im Jahr bleiben frei.',
            en: 'In gastronomy the rest period may drop to ten hours if you make up for it within a month. Sunday work is allowed, but at least 15 Sundays a year stay free.',
          },
          {
            de: 'Hygiene fürs Team: Belehrung nach § 43 IfSG vor dem ersten Arbeitstag, Hygieneschulung, Unterweisung zur Arbeitssicherheit. Einzelheiten stehen in Etappe 02.',
            en: 'Hygiene for the team: instruction under Section 43 IfSG before the first working day, hygiene training, occupational safety briefing. Details are in stage 02.',
          },
          {
            de: 'Zur Einordnung: 2025 fanden 22 % aller Arbeitgeberprüfungen des Zolls in Gaststätten und Hotels statt, mehr als auf dem Bau.',
            en: 'For context: in 2025, 22 % of all customs inspections of employers took place in restaurants and hotels, more than in construction.',
          },
        ],
        contacts: [BETRIEBSNUMMERN, MINIJOB],
      },
    ],
  },

  // ------------------------------------------------------------------ 5
  {
    id: 'eroeffnen',
    index: '05',
    tag: { de: 'Start', en: 'Launch' },
    title: { de: 'Eröffnen und sichtbar werden', en: 'Open and become visible' },
    lead: {
      de: 'Die letzten Pflichten vor dem ersten Gast und die ersten Schritte, damit überhaupt jemand kommt.',
      en: 'The last obligations before the first guest, and the first steps so that anyone comes at all.',
    },
    steps: [
      {
        id: 'angebot-preise',
        weight: 'pflicht',
        title: { de: 'Speisekarte oder Kursprogramm, und die Preise', en: 'Menu or class programme, and the prices' },
        summary: {
          de: 'Eine kurze Karte ist leichter zu kalkulieren, zu kontrollieren und sauber zu halten. Rechne jeden Preis vom Wareneinsatz her, nicht aus dem Bauch.',
          en: 'A short menu is easier to cost, to control and to keep clean. Work out every price from the cost of goods, not from gut feeling.',
        },
        details: [
          {
            de: 'Kalkulation: Wareneinsatz pro Gericht mal Aufschlag. Das Finanzamt rechnet für Gaststätten im Mittel mit einem Wareneinsatz um 28 % vom Nettoumsatz, damit vergleicht es deine Zahlen.',
            en: 'Costing: cost of goods per dish times a markup. For restaurants the tax office works with an average cost of goods of about 28 % of net revenue, and compares your figures with it.',
          },
          {
            de: 'Preise sind Endpreise inklusive Umsatzsteuer. Neben dem Eingang hängt ein Preisverzeichnis mit den wichtigsten Speisen und Getränken, auf den Tischen liegen Karten, bevor bestellt wird. Bei Getränken steht die Menge dabei, und nur in erlaubten Ausschankmaßen wie 0,2, 0,3 oder 0,5 Liter.',
            en: 'Prices are final prices including VAT. A price list with the main dishes and drinks hangs next to the entrance, and menus are on the tables before people order. Drinks show the quantity, and only in permitted serving sizes such as 0.2, 0.3 or 0.5 litres.',
          },
          {
            de: 'Kochkurse: Preis pro Person inklusive Zutaten und Getränken, Gruppengröße, Dauer. Für Firmen den Preis pro Kopf ausweisen: Bis 110 € pro Person bleibt eine Firmenveranstaltung für die Mitarbeitenden lohnsteuerfrei, danach fragen Firmen zuerst.',
            en: 'Cooking classes: price per person including ingredients and drinks, group size, duration. For companies show the price per head: up to 110 € per person a company event stays free of wage tax for the employees, and that is what companies ask first.',
          },
          {
            de: 'Allergene und Zusatzstoffe gehören auf die Karte oder in die Mappe, siehe Etappe 02.',
            en: 'Allergens and additives belong on the menu or in the folder, see stage 02.',
          },
          {
            de: 'Konkurrenzcheck: drei Mitbewerber:innen als Gast besuchen oder anrufen und auf Preis, Portionsgröße und den nächsten freien Termin achten. Was sie nicht gut machen, ist deine Lücke.',
            en: 'Competitor check: visit or call three competitors as a guest and note price, portion size and the next free slot. What they do badly is your gap.',
          },
        ],
        joe: {
          de: 'Mein Konkurrenzcheck war ein Nachmittag am Telefon. Keiner konnte sagen, was eine Behandlung kostet oder wie lange sie dauert. Daraus ist der Zeit- und Preisrechner auf unserer Website geworden.',
          en: 'My competitor check was one afternoon on the phone. Nobody could say what a treatment costs or how long it takes. That turned into the time and price calculator on our website.',
        },
      },
      {
        id: 'pflichtaushaenge',
        weight: 'pflicht',
        professions: RESTAURANT,
        title: { de: 'Aushänge, Rauchverbot, GEMA, Rundfunkbeitrag', en: 'Notices, smoking ban, music licence, broadcasting fee' },
        summary: {
          de: 'Vor dem ersten Gast hängen: Preisverzeichnis am Eingang und Jugendschutzgesetz. Vor dem ersten Lied: der GEMA-Vertrag.',
          en: 'Up before the first guest: the price list at the entrance and the youth protection rules. Before the first song: the GEMA music licence.',
        },
        details: [
          {
            de: 'Jugendschutz: gut sichtbar aushängen, ein digitaler Hinweis reicht nicht. Bier und Wein ab 16, Spirituosen ab 18, unter 16 nur mit Eltern oder zum Essen zwischen 5 und 23 Uhr. Ein fehlender Aushang kann ein Bußgeld kosten.',
            en: 'Youth protection: post it clearly visible, a digital notice is not enough. Beer and wine from 16, spirits from 18, under-16s only with parents or for a meal between 5 am and 11 pm. A missing notice can cost a fine.',
          },
          {
            de: 'Rauchverbot: In bayerischen Gaststätten wird drinnen nicht geraucht, auch kein Cannabis, und Raucherräume sind nicht erlaubt. Cannabis ist auch draußen verboten. Du musst Verstöße unterbinden.',
            en: 'Smoking ban: no smoking indoors in Bavarian restaurants, no cannabis either, and smoking rooms are not allowed. Cannabis is banned outside too. You have to stop violations.',
          },
          {
            de: 'GEMA: Hintergrundmusik braucht einen Vertrag vor dem ersten Lied, für einen Gastraum bis 100 m² etwa 246 € im Jahr plus Steuer. Live-Musik und DJs laufen extra, DEHOGA-Mitglieder zahlen 20 % weniger.',
            en: 'GEMA: background music needs a contract before the first song, for a guest room up to 100 m² about 246 € a year plus VAT. Live music and DJs are separate; DEHOGA members pay 20 % less.',
          },
          {
            de: 'Rundfunkbeitrag: pro Betriebsstätte, bis acht Beschäftigte 6,12 € im Monat, ab dem Monat, in dem du die Räume übernimmst. Minijobs zählen nicht mit.',
            en: 'Broadcasting fee: per business location, up to eight employees 6.12 € a month, from the month you take over the premises. Minijobs do not count.',
          },
          {
            de: 'Sperrzeit: in Bayern von 5 bis 6 Uhr, draußen in Nürnberg ab 23 Uhr. An stillen Feiertagen wie Karfreitag ist Unterhaltung verboten, auch Musik.',
            en: 'Closing time: in Bavaria from 5 to 6 am, outside in Nuremberg from 11 pm. On quiet holidays such as Good Friday entertainment is banned, music included.',
          },
          {
            de: 'Für Angestellte: Arbeitszeitgesetz und die Unfallverhütungsvorschriften zugänglich machen, digital reicht dafür.',
            en: 'For employees: make the Working Hours Act and the accident prevention rules available; digital access is enough for these.',
          },
        ],
        links: [
          { label: { de: 'GEMA für die Gastronomie', en: 'GEMA for gastronomy (German)' }, url: 'https://www.gema.de/de/musiknutzer/branchen/gastronomie' },
          {
            label: { de: 'Rundfunkbeitrag für Unternehmen', en: 'Broadcasting fee for businesses (German)' },
            url: 'https://www.rundfunkbeitrag.de/unternehmen_und_institutionen/index_ger.html',
          },
        ],
      },
      {
        id: 'verpackung',
        weight: 'pflicht',
        professions: RESTAURANT,
        title: { de: 'Zum Mitnehmen: Mehrweg und Verpackungsregister', en: 'Takeaway: reusable option and packaging register' },
        summary: {
          de: 'Nur, wenn du etwas zum Mitnehmen verkaufst. Seit August 2026 gilt das neue Verpackungsrecht: Wer in Einweg-Plastik oder Einwegbecher abfüllt, muss auch Mehrweg anbieten, zum selben Preis.',
          en: 'Only if you sell anything to take away. Since August 2026 the new packaging law applies: if you fill single-use plastic or single-use cups, you must also offer a reusable option at the same price.',
        },
        details: [
          {
            de: 'Kleine Betriebe mit höchstens fünf Beschäftigten und 80 m² Verkaufsfläche dürfen stattdessen mitgebrachte Behälter befüllen. Beides musst du gut sichtbar anzeigen.',
            en: 'Small businesses with no more than five employees and 80 m² of sales area may fill customers\' own containers instead. Either way you have to display it clearly.',
          },
          {
            de: 'Neutrale Verpackungen von einem deutschen Händler: Der Händler ist Hersteller, du prüfst nur, ob er registriert ist. Verpackungen mit deinem Logo oder Folie von der Rolle können dich selbst zum Hersteller machen, mit kostenloser Registrierung im Verpackungsregister LUCID und einem Vertrag mit einem Entsorgungssystem. Frag bei der IHK, bevor du Tüten mit Logo bestellst.',
            en: 'Neutral packaging from a German supplier: the supplier is the producer, you only check that they are registered. Packaging with your logo, or film off the roll, can make you a producer yourself, with free registration in the LUCID packaging register and a contract with a take-back system. Ask the chamber of commerce before you order bags with your logo.',
          },
          {
            de: 'Verboten sind Einweg-Plastikbesteck, -teller und -strohhalme und Behälter aus Styropor.',
            en: 'Single-use plastic cutlery, plates and straws and polystyrene containers are banned.',
          },
          {
            de: 'Wer Essen in Plastiktüten oder Folien zum direkten Verzehr abgibt, kann zusätzlich unter den Einwegkunststofffonds fallen, mit Registrierung auf der Plattform DIVID. Das Merkblatt der IHK erklärt, wann das greift.',
            en: 'If you hand out food in plastic bags or wrappers for eating straight away, you may also fall under the single-use plastics fund, with registration on the DIVID platform. The chamber of commerce\'s leaflet explains when this applies.',
          },
        ],
        links: [
          {
            label: { de: 'IHK Nürnberg: Mehrwegpflicht in der Gastronomie', en: 'IHK Nürnberg: reusable duty in gastronomy (German)' },
            url: 'https://www.ihk-nuernberg.de/ihk-themen/umwelt-ressourcen-oekologische-nachhaltigkeit/umweltrecht-umweltpolitik/mehrweg-pflicht-in-der-gastronomie',
          },
          {
            label: { de: 'Verpackungsregister: Serviceverpackungen', en: 'Packaging register: service packaging (German)' },
            url: 'https://www.verpackungsregister.org/themen/serviceverpackungen',
          },
        ],
      },
      {
        id: 'google-profil',
        weight: 'pflicht',
        title: { de: 'Dein Google-Unternehmensprofil', en: 'Your Google Business Profile' },
        summary: {
          de: 'Für ein Restaurant das wichtigste Schaufenster überhaupt: Die meisten Gäste sehen dich zuerst in Google Maps. Für eine Kochschule genauso.',
          en: 'For a restaurant the most important shop window there is: most guests see you on Google Maps first. The same goes for a cooking school.',
        },
        details: [
          {
            de: 'Mit deinem eigenen Google-Konto anlegen. Kategorie genau wählen (zum Beispiel italienisches Restaurant, Café oder Kochschule), Öffnungszeiten, Speisekarte oder Kurse, Fotos von Gerichten und Raum.',
            en: 'Create it with your own Google account. Choose the category precisely (for example Italian restaurant, café or cooking school), opening hours, menu or classes, photos of dishes and the room.',
          },
          {
            de: 'Verifizierung per Video oder Postkarte an die Betriebsadresse. Rechne mit ein paar Tagen.',
            en: 'Verification by video or a postcard to the business address. Allow a few days.',
          },
          {
            de: 'Nach jedem guten Abend um eine Bewertung bitten, mit QR-Code am Tisch oder auf dem Beleg. Bewertungen nie mit Rabatten erkaufen: Google löscht sie, und es kann wettbewerbswidrig sein.',
            en: 'Ask for a review after every good evening, with a QR code on the table or the receipt. Never buy reviews with discounts: Google deletes them, and it can breach competition law.',
          },
        ],
        links: [{ label: { de: 'Google Unternehmensprofil', en: 'Google Business Profile' }, url: 'https://www.google.com/business/' }],
      },
      {
        id: 'website',
        weight: 'pflicht',
        title: { de: 'Website mit Reservierung oder Kursbuchung', en: 'Website with reservations or class booking' },
        summary: {
          de: 'Speisekarte oder Kursprogramm, Öffnungszeiten, Anfahrt und ein einfacher Weg zu reservieren oder zu buchen. Dazu Impressum und Datenschutz, sonst drohen Abmahnungen.',
          en: 'Menu or class programme, opening hours, directions and an easy way to reserve or book. Plus an imprint and a privacy policy, otherwise you risk legal warning letters.',
        },
        details: [
          {
            de: 'Die Speisekarte als Text, nicht nur als Foto: Suchmaschinen und Screenreader können Fotos nicht lesen.',
            en: 'The menu as text, not just a photo: search engines and screen readers cannot read photos.',
          },
          {
            de: 'Impressum, Datenschutzerklärung, Preise als Endpreise inklusive Umsatzsteuer. Links auf die alte EU-Streitschlichtungsplattform entfernen, sie wurde im Juli 2025 abgeschaltet.',
            en: 'Imprint, privacy policy, prices as final prices including VAT. Remove links to the old EU online dispute resolution platform, it was shut down in July 2025.',
          },
          {
            de: 'Kochkurse online verkaufen: vor der Buchung der Hinweis, dass kein Widerrufsrecht besteht, eine klare Stornoregel und für Gutscheine der Widerrufs-Button.',
            en: 'Selling cooking classes online: before booking, the note that there is no right of withdrawal, a clear cancellation rule, and the withdrawal button for vouchers.',
          },
          {
            de: 'Plattformen: Airbnb Erlebnisse nimmt etwa 20 % Provision, Eventbrite um 5,5 % plus Gebühr, Erlebnisportale deutlich mehr. Rechne die Provision in den Preis ein, bevor du zusagst.',
            en: 'Platforms: Airbnb Experiences takes about 20 % commission, Eventbrite around 5.5 % plus a fee, experience-gift portals considerably more. Build the commission into the price before you sign up.',
          },
        ],
      },
      {
        id: 'social-media',
        weight: 'empfohlen',
        title: { de: 'Social Media: Essen ist das dankbarste Motiv', en: 'Social media: food is the most rewarding subject' },
        summary: {
          de: 'Instagram und TikTok leben von Essen und von Menschen am Herd. Konten früh anlegen, auch wenn sie noch leer sind, alle mit demselben Namen und im Google-Profil verlinkt.',
          en: 'Instagram and TikTok thrive on food and people at the stove. Create the accounts early, even while they are empty, all with the same name and linked in your Google profile.',
        },
        details: [
          {
            de: 'Ein gutes Profilbild, drei Sätze Bio, Link zur Reservierung oder Buchung. Mehr braucht es am Anfang nicht.',
            en: 'One good profile picture, a three-sentence bio, the link to reservations or booking. Nothing more is needed at first.',
          },
          {
            de: 'Das Meta-Business-Konto brauchst du für Anzeigen, auch wenn du noch keine schaltest. Die Freigabe dauert Tage, deshalb früh.',
            en: 'You need the Meta Business account for ads, even before you run any. Approval takes days, hence early.',
          },
          {
            de: 'Video funktioniert: Handgriffe in der Küche, ein Gericht in 20 Sekunden, der Aufbau vor dem Kurs. Vor der Kamera stehst du, die Gäste wollen sehen, wer für sie kocht.',
            en: 'Video works: moves in the kitchen, a dish in 20 seconds, the set-up before a class. You are the one in front of the camera; guests want to see who cooks for them.',
          },
          {
            de: 'Fotos von Gästen oder Teilnehmenden nur mit Einwilligung. Rezepte darfst du nachkochen, aber keine Texte oder Fotos aus Kochbüchern übernehmen.',
            en: 'Photos of guests or participants only with consent. You may cook other people\'s recipes, but do not copy texts or photos from cookbooks.',
          },
        ],
      },
      {
        id: 'probelauf',
        weight: 'empfohlen',
        title: { de: 'Probelauf vor der Eröffnung', en: 'Trial run before opening' },
        summary: {
          de: 'Ein oder zwei Abende für Freund:innen und Nachbarschaft, oder ein Probekurs zum halben Preis. Dabei findest du die Fehler, bevor zahlende Gäste sie finden.',
          en: 'One or two evenings for friends and neighbours, or a trial class at half price. That is where you find the mistakes before paying guests do.',
        },
        details: [
          {
            de: 'Mach dabei deine eigene Kontrolle: Temperaturliste, Reinigungsplan, Allergenliste, Belehrungen. Geh durch die Küche, als wärst du die Lebensmittelkontrolle.',
            en: 'Run your own inspection while you are at it: temperature list, cleaning plan, allergen list, instructions. Walk through the kitchen as if you were the food inspector.',
          },
          {
            de: 'Kasse testen: Speisen 7 %, Getränke 19 %, Beleg mit TSE-Daten, Trinkgeld, Kartenzahlung.',
            en: 'Test the till: food 7 %, drinks 19 %, receipt with TSE data, tips, card payment.',
          },
          {
            de: 'Wer beim Probelauf in Küche oder Service mitarbeitet, braucht die Belehrung nach § 43 IfSG, und bezahlte Helfer:innen die Sofortmeldung.',
            en: 'Anyone working in the kitchen or service during the trial run needs the Section 43 IfSG instruction, and paid helpers need the immediate registration.',
          },
        ],
      },
      {
        id: 'erste-gaeste',
        weight: 'empfohlen',
        title: { de: 'Die ersten Gäste und Teilnehmenden', en: 'The first guests and participants' },
        summary: {
          de: 'Sie kommen nicht aus Anzeigen. Sie kommen aus deinem Umfeld, aus der Nachbarschaft und von Leuten, die du persönlich einlädst.',
          en: 'They do not come from ads. They come from your circle, from the neighbourhood and from people you invite personally.',
        },
        details: [
          {
            de: 'Eine Liste mit fünfzig Namen aus deinem Telefon. Jede:r bekommt eine persönliche Nachricht, keinen Sammelpost.',
            en: 'A list of fifty names from your phone. Each gets a personal message, not a group post.',
          },
          {
            de: 'Nachbarschaft: Läden und Büros in der Umgebung persönlich besuchen, mit Karte und einem Angebot nur für sie. Ein Mittagstisch für Büros ist oft der Weg zu den ersten Stammgästen.',
            en: 'The neighbourhood: visit nearby shops and offices in person, with a card and an offer just for them. A lunch menu for offices is often the way to the first regulars.',
          },
          {
            de: 'Kochkurse: Firmen suchen Teamevents, Gutscheine verkaufen sich vor Weihnachten und Muttertag. Früh anbieten.',
            en: 'Cooking classes: companies look for team events, and vouchers sell before Christmas and Mother\'s Day. Offer them early.',
          },
          {
            de: 'Werbemails an Firmen, die nicht eingewilligt haben, sind nach dem Wettbewerbsrecht nicht erlaubt. Persönlich vorbeigehen schon.',
            en: 'Advertising emails to companies that have not agreed to them are not allowed under competition law. Dropping by in person is.',
          },
          {
            de: 'Empfehlungsbonus: Wer jemanden bringt, bekommt etwas. In Euro formuliert, nicht in Prozent.',
            en: 'Referral bonus: whoever brings someone gets something. Phrased in euros, not percent.',
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 6
  {
    id: 'laufen',
    index: '06',
    tag: { de: 'Routine', en: 'Routine' },
    title: { de: 'Laufen lassen und wachsen', en: 'Keep it running and grow' },
    lead: {
      de: 'Was jeden Tag, jeden Monat und alle zwei Jahre wiederkommt. In der Gastronomie ist die Routine die halbe Hygiene.',
      en: 'What comes back every day, every month and every two years. In gastronomy, routine is half of hygiene.',
    },
    steps: [
      {
        id: 'hygiene-routine',
        weight: 'pflicht',
        title: { de: 'Die Hygiene-Routine: täglich, monatlich, jährlich', en: 'The hygiene routine: daily, monthly, yearly' },
        summary: {
          de: 'Die Kontrolle bewertet nicht den Tag, an dem sie kommt, sondern die Listen der Wochen davor. Wer sie täglich führt, hat bei der Kontrolle nichts mehr zu tun.',
          en: 'The inspection does not judge the day it comes but the lists of the weeks before. Keep them daily and there is nothing left to do when the inspectors arrive.',
        },
        details: [
          {
            de: 'Täglich: Temperaturen messen und eintragen, Reinigungsplan abzeichnen, Wareneingang stichprobenartig prüfen, Frittierfett kontrollieren.',
            en: 'Daily: measure and log temperatures, sign off the cleaning plan, spot-check deliveries, check the frying fat.',
          },
          {
            de: 'Monatlich: Schädlingsmonitoring prüfen und dokumentieren, Temperaturlisten und Reinigungsnachweise abzeichnen, die Allergenliste mit neuen Produkten abgleichen.',
            en: 'Monthly: check and document pest monitoring, sign off temperature lists and cleaning records, compare the allergen list with new products.',
          },
          {
            de: 'Jährlich: Hygieneschulung für alle, Wartung des Fettabscheiders durch eine sachkundige Person, HACCP-Konzept durchsehen. Alle zwei Jahre die Folgebelehrung nach § 43 IfSG, auch für dich selbst. Alle fünf Jahre die Generalinspektion des Fettabscheiders.',
            en: 'Yearly: hygiene training for everyone, grease-separator maintenance by a qualified person, review the HACCP plan. Every two years the Section 43 IfSG follow-up instruction, yourself included. Every five years the grease separator\'s general inspection.',
          },
          {
            de: 'Den Fettabscheider von einer Fachfirma leeren lassen, spätestens wenn der zulässige Füllstand erreicht ist, und die Entsorgungsbelege drei Jahre aufheben. Die Fettfilter der Abzugshaube mindestens alle zwei Wochen reinigen.',
            en: 'Have a specialist firm empty the grease separator, at the latest when the permitted level is reached, and keep the disposal receipts for three years. Clean the extractor-hood grease filters at least every two weeks.',
          },
          {
            de: 'Neues Gericht, neuer Lieferant, Umbau: HACCP-Konzept und Allergenliste anpassen und wesentliche Änderungen der Lebensmittelüberwachung melden.',
            en: 'New dish, new supplier, conversion: update the HACCP plan and the allergen list, and report significant changes to the food inspectors.',
          },
        ],
        contacts: [LEBENSMITTELUEBERWACHUNG, SUN],
      },
      {
        id: 'monatsroutine',
        weight: 'pflicht',
        title: { de: 'Die Monatsroutine', en: 'The monthly routine' },
        summary: {
          de: 'Eine feste Stunde am Monatsende: Belege, Umsatzsteuer-Voranmeldung, Kassenabschluss, Lohn, und ein Blick auf Wareneinsatz und Personalkosten.',
          en: 'One fixed hour at the end of the month: receipts, VAT advance return, till closing, payroll, and a look at the cost of goods and staff costs.',
        },
        details: [
          {
            de: 'Umsatzsteuer-Voranmeldung bis zum 10. des Folgemonats, monatlich oder vierteljährlich, das legt das Finanzamt fest. Mit Dauerfristverlängerung einen Monat später.',
            en: 'VAT advance return by the 10th of the following month, monthly or quarterly as the tax office decides. One month later with a permanent extension.',
          },
          {
            de: 'Wareneinsatz und Personalkosten in Prozent vom Nettoumsatz. Läuft eine der beiden Zahlen weg, merkst du es hier zuerst.',
            en: 'Cost of goods and staff costs as a share of net revenue. If either figure runs away, this is where you notice it first.',
          },
          {
            de: 'Arbeitszeiten, Minijob-Grenzen und Sofortmeldungen prüfen, bevor der Zoll es tut.',
            en: 'Check working hours, minijob limits and immediate registrations before customs does.',
          },
          {
            de: 'Betriebsurlaub früh festlegen und im Reservierungs- oder Buchungssystem sperren.',
            en: 'Set your holiday closure early and block it in the reservation or booking system.',
          },
        ],
        joe: {
          de: 'Ich habe mir eine Monats-Checkliste geschrieben, nachdem ich zweimal die Voranmeldung zu spät gemacht habe. Sie hängt jetzt neben dem Kalender.',
          en: 'I wrote myself a monthly checklist after filing the advance return late twice. It now hangs next to the calendar.',
        },
      },
      {
        id: 'wachsen',
        weight: 'optional',
        title: { de: 'Wachsen: Catering, Events, Personal', en: 'Growing: catering, events, staff' },
        summary: {
          de: 'Wenn es läuft. Catering, Kochkurse im Restaurant oder ein Mittagstisch für Firmen bringen Umsatz in ruhige Stunden. Jeder dieser Wege hat eigene Regeln.',
          en: 'When it is running. Catering, cooking classes in the restaurant or a lunch menu for companies bring revenue into quiet hours. Each of these paths has its own rules.',
        },
        details: [
          {
            de: 'Catering: Kühlkette und Warmhalten mit mindestens 65 °C auch beim Transport. Rückstellproben sind für ein Restaurant freiwillig, für Catering und Veranstaltungen empfohlen: mindestens 100 g pro Komponente, sieben Tage tiefgekühlt.',
            en: 'Catering: cold chain and hot-holding at 65 °C or more during transport too. Retained samples are voluntary for a restaurant and recommended for catering and events: at least 100 g per component, frozen for seven days.',
          },
          {
            de: 'Kochkurse im Restaurant außerhalb der Öffnungszeiten: Die Kurse haben in der Regel 19 % statt 7 % Umsatzsteuer, die Versicherung muss sie abdecken, und im HACCP-Konzept steht, wie Kurs und Küche getrennt bleiben.',
            en: 'Cooking classes in the restaurant outside opening hours: the classes usually carry 19 % VAT instead of 7 %, the insurance must cover them, and the HACCP plan sets out how class and kitchen stay separate.',
          },
          {
            de: 'Veranstaltungen außerhalb deiner Räume, etwa ein Stand auf einem Fest: Gestattung beim Ordnungsamt, zwei Wochen vorher. Musik bei Veranstaltungen ist nicht im GEMA-Vertrag für Hintergrundmusik enthalten.',
            en: 'Events outside your premises, say a stand at a festival: a temporary permit from the Ordnungsamt, two weeks ahead. Music at events is not included in the GEMA contract for background music.',
          },
          {
            de: 'Kochkurse mit Assistenz: Auch eine Aushilfe im Minijob muss angemeldet, belehrt und geschult sein. Mit Angestellten, die zusammen mehr als 603 € im Monat verdienen, endet deine Rentenversicherungspflicht als Lehrkraft.',
            en: 'Cooking classes with an assistant: even a minijob helper must be registered, instructed and trained. Once your employees together earn more than 603 € a month, your mandatory pension insurance as a teacher ends.',
          },
        ],
        joe: {
          de: 'Meine erste Stellenanzeige lief über die Agentur für Arbeit, die mich an die Kosmetik-Fachschulen und die Innung verwiesen hat. Der Markt ist eng, mehr Arbeitgeber als Bewerber:innen. Früh anfangen.',
          en: 'My first job ad ran through the employment agency, which pointed me to the cosmetics schools and the guild. The market is tight, more employers than applicants. Start early.',
        },
      },
    ],
  },
];

export const GASTRO_ROAD: RoadDefinition<GastroId> = {
  slug: 'gastro-road',
  name: 'Gastro Road',
  storageKey: 'fw_gastro_road_v1',
  professions: GASTRO_PROFESSIONS,
  phases: GASTRO_PHASES,
  copy: {
    choiceId: 'vorhaben',
    choiceHeading: { de: 'Restaurant oder Kochkurse?', en: 'Restaurant or cooking classes?' },
    choiceLead: {
      de: 'Ein Restaurant braucht andere Genehmigungen als eine Kochschule. Wähl, was du planst, dann verschwinden die Schritte, die nicht für dich gelten. Planst du beides, wähl nichts: Dann siehst du alles, mit Hinweis, wofür es gilt.',
      en: 'A restaurant needs different permits from a cooking school. Pick what you are planning and the steps that do not apply to you disappear. Planning both? Pick nothing: then you see everything, with a note on what it applies to.',
    },
    choiceGroupLabel: { de: 'Vorhaben wählen', en: 'Choose your plan' },
    hiddenCount: {
      de: '{n} Schritte ausgeblendet, die für dein Vorhaben nicht gelten.',
      en: '{n} steps hidden that do not apply to your plan.',
    },
    emptyPhase: {
      de: 'In dieser Etappe gibt es für dein Vorhaben nichts zu tun.',
      en: 'Nothing to do in this stage for your plan.',
    },
    storageNote: {
      de: 'Häkchen, Notizen und deine Auswahl werden nur auf diesem Gerät gespeichert, im lokalen Speicher deines Browsers, technisch wie ein Cookie. Nichts davon wird an FareWell oder Dritte übertragen oder für irgendetwas anderes verwendet. Deshalb gilt aber auch: Wenn du deine Cookies und Website-Daten löschst, den Browser wechselst oder im privaten Modus surfst, ist dein ganzer Stand auf dieser Seite weg. Exportiere ihn regelmäßig als Datei.',
      en: 'Ticks, notes and your choice are stored only on this device, in your browser\'s local storage, technically like a cookie. None of it is sent to FareWell or third parties or used for anything else. That also means: if you clear your cookies and site data, switch browsers or browse in private mode, your entire progress on this page is gone. Export it as a file regularly.',
    },
    resetConfirm: {
      de: 'Alle Häkchen, Notizen und deine Auswahl auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen. Exportiere vorher, wenn du unsicher bist.',
      en: 'Delete all ticks, notes and your choice on this device? This cannot be undone. Export first if you are unsure.',
    },
  },
};
