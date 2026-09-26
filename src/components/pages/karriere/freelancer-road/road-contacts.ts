/**
 * Öffentliche Anlaufstellen der Roads (Nürnberg, Bayern, Bund), an einer
 * Stelle, damit eine geänderte Nummer nur einmal gepflegt wird. Nur Ämter,
 * Kammern und Verbände mit ihren offiziellen Kontaktdaten, keine
 * Privatpersonen („frag Joé nach dem Kontakt").
 *
 * Nummern und Zeiten mit „Stand" sind so oft veraltet wie Öffnungszeiten
 * eben sind: bei Änderungen hier anpassen und den Stand der Road erhöhen.
 */

import type { Contact } from './road.model';

// ------------------------------------------------------------ Freelancer Road
// Aus Joés Gründungsnotizen 2025.

export const GEWERBEAMT: Contact = {
  name: 'Gewerbeamt Nürnberg (Ordnungsamt, Sachgebiet Gewerbewesen)',
  phone: '0911 231-0',
  email: 'gewerbeanzeigen@stadt.nuernberg.de',
  address: 'Innerer Laufer Platz 3, 90403 Nürnberg',
  hours: {
    de: 'Mo, Di, Do 08:00–15:30 · Mi, Fr 08:00–12:30 (Stand 2026)',
    en: 'Mon, Tue, Thu 08:00–15:30 · Wed, Fri 08:00–12:30 (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/ordnungsamt/gewerbe.html',
};

export const GESUNDHEITSAMT: Contact = {
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

export const HWK: Contact = {
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

export const HWK_BERATUNG: Contact = {
  name: 'HWK Mittelfranken, Unternehmensberatung',
  phone: '0911 5309-498',
  email: 'unternehmensberatung@hwk-mittelfranken.de',
};

export const IHK: Contact = {
  name: 'IHK Nürnberg für Mittelfranken, Gründungsberatung',
  phone: '0911 1335-1516',
  address: 'Hauptmarkt 25/27, 90403 Nürnberg',
  url: 'https://www.ihk.de/nuernberg/',
};

export const LFA: Contact = {
  name: 'LfA Förderbank Bayern, Repräsentanz Nürnberg',
  phone: '0911 81008-00',
  email: 'nuernberg@lfa.de',
  address: 'Am Tullnaupark 8, 90402 Nürnberg',
  url: 'https://www.lfa.de/',
};

export const BAYERN_INNOVATIV: Contact = {
  name: 'Bayern Innovativ',
  phone: '0911 20671-0',
  address: 'Am Tullnaupark 8, 90402 Nürnberg',
  url: 'https://www.bayern-innovativ.de/',
};

export const AFA: Contact = {
  name: 'Agentur für Arbeit Nürnberg',
  phone: '0800 4 5555 00',
  address: 'Richard-Wagner-Platz 5, 90443 Nürnberg',
  url: 'https://www.arbeitsagentur.de/vor-ort/nuernberg/startseite',
};

// Seit 1.1.2026 ein gemeinsames Finanzamt Nürnberg (vorher Nord, Süd und
// Zentralfinanzamt). Die Durchwahlen der alten Standorte gelten laut Amt
// vorerst weiter, Servicezentren seit 1.9.2026 in der Regel nur mit Termin.
export const FINANZAMT: Contact = {
  name: 'Finanzamt Nürnberg (Neuaufnahme, Umsatzsteuer)',
  phone: '0911 3998-250',
  url: 'https://www.finanzamt-nuernberg.de/',
};

export const DRV: Contact = {
  name: 'Deutsche Rentenversicherung, kostenloses Servicetelefon',
  phone: '0800 1000 4800',
  url: 'https://www.deutsche-rentenversicherung.de/',
};

export const BGW: Contact = {
  name: 'BGW, Berufsgenossenschaft für Gesundheitsdienst und Wohlfahrtspflege',
  url: 'https://www.bgw-online.de/',
};

export const VBG: Contact = {
  name: 'VBG, Verwaltungs-Berufsgenossenschaft (Sport, Unterricht)',
  url: 'https://www.vbg.de/',
};

export const GAA: Contact = {
  name: 'Gewerbeaufsichtsamt bei der Regierung von Mittelfranken (NiSV-Anzeige)',
  url: 'https://www.regierung.mittelfranken.bayern.de/',
};

// ------------------------------------------------------------ Gastro Road
// Im September 2026 auf den Seiten der Ämter geprüft. Nürnberg zeigt auf
// seinen Seiten kein Stand-Datum, deshalb hier „Stand 2026".

export const LEBENSMITTELUEBERWACHUNG: Contact = {
  name: 'Lebensmittelüberwachung Nürnberg (Ordnungsamt)',
  phone: '0911 231-2524',
  address: 'Innerer Laufer Platz 3, 90403 Nürnberg',
  hours: {
    de: 'Mo, Di, Do 08:00–15:30 · Mi, Fr 08:00–12:30, vor Ort nur mit Termin (Stand 2026)',
    en: 'Mon, Tue, Thu 08:00–15:30 · Wed, Fri 08:00–12:30, in person by appointment only (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/ordnungsamt/lebensmittelrecht.html',
};

export const GESUNDHEITSAMT_BELEHRUNG: Contact = {
  name: 'Gesundheitsamt Nürnberg, Belehrungen nach dem Infektionsschutzgesetz',
  phone: '0911 231-3142',
  address: 'Burgstraße 4, 1. Stock, Zimmer 102, 90403 Nürnberg',
  hours: {
    de: 'Mo–Fr 08:00–11:00 ohne Termin, 28 €, Ausweis mitbringen (Stand 2026)',
    en: 'Mon–Fri 08:00–11:00, no appointment, 28 €, bring photo ID (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/gesundheit_nbg/lebensmittel.html',
};

export const GASTSTAETTEN: Contact = {
  name: 'Ordnungsamt Nürnberg, Gaststätten (Erlaubnis und Bewirtung)',
  phone: '0911 231-2526',
  address: 'Innerer Laufer Platz 3, 90403 Nürnberg',
  hours: {
    de: 'Mo, Di, Do 08:00–15:30 · Mi, Fr 08:00–12:30, auch 0911 231-5325 und 231-7089 (Stand 2026)',
    en: 'Mon, Tue, Thu 08:00–15:30 · Wed, Fri 08:00–12:30, also 0911 231-5325 and 231-7089 (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/stadtportal/behoerdenwegweiser/dienstleistung/gaststaettenerlaubnis.html',
};

export const BAUORDNUNG: Contact = {
  name: 'Bauordnungsbehörde Nürnberg',
  phone: '0911 231-3000',
  address: 'Bauhof 5, 90402 Nürnberg (Post: Johannesgasse 3)',
  hours: {
    de: 'Telefon Mo 09:00–15:30 · Mi, Fr 09:00–12:30, Gespräche nur mit Termin (Stand 2026)',
    en: 'Phone Mon 09:00–15:30 · Wed, Fri 09:00–12:30, meetings by appointment only (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/bauordnung/',
};

export const SUN: Contact = {
  name: 'SUN Stadtentwässerung Nürnberg, Grundstücksentwässerung (Fettabscheider)',
  phone: '0911 231-3009',
  email: 'sun-s3@stadt.nuernberg.de',
  address: 'Peuntgasse 12, 90402 Nürnberg',
  hours: {
    de: 'Mo, Di, Do 08:30–15:30 · Mi, Fr 08:30–12:30, vorher anrufen (Stand 2026)',
    en: 'Mon, Tue, Thu 08:30–15:30 · Wed, Fri 08:30–12:30, call ahead (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/sun/grundstuecksentwaesserung_abscheider.html',
};

export const LIEGENSCHAFTSAMT: Contact = {
  name: 'Liegenschaftsamt Nürnberg, Sondernutzungen (Tische und Stühle im Freien)',
  phone: '0911 231-7500',
  address: 'Hallplatz 2, 90402 Nürnberg',
  hours: {
    de: 'Mo, Mi, Do, Fr 08:30–12:00 · Di 08:30–15:30 (Stand 2026)',
    en: 'Mon, Wed, Thu, Fri 08:30–12:00 · Tue 08:30–15:30 (as of 2026)',
  },
  url: 'https://www.nuernberg.de/internet/liegenschaftsamt/tischundstuhl.html',
};

export const STAB_WOHNEN: Contact = {
  name: 'Stadt Nürnberg, Stab Wohnen (Zweckentfremdung von Wohnraum)',
  phone: '0911 231-3035',
  address: 'Marienstraße 6, 90402 Nürnberg',
  url: 'https://www.nuernberg.de/internet/wohnen/zweckentfremdung.html',
};

export const WIRTSCHAFTSFOERDERUNG: Contact = {
  name: 'Wirtschaftsförderung Nürnberg, Gründung und Nachfolge',
  phone: '0911 231-6251',
  url: 'https://www.nuernberg.de/internet/wirtschaft_nbg/gruendung_nachfolge.html',
};

export const IHK_UNTERRICHTUNG: Contact = {
  name: 'IHK Nürnberg für Mittelfranken, Gaststättenunterrichtung',
  phone: '0911 1335-1335',
  email: 'gastro@nuernberg.ihk.de',
  address: 'Kursort: IHK-Akademie Mittelfranken, Walter-Braun-Straße 15, 90425 Nürnberg',
  url: 'https://www.ihk-nuernberg.de/weiterbildung/sach-und-fachkundepruefungen/gaststaettenunterrichtung',
};

export const DEHOGA_MFR: Contact = {
  name: 'DEHOGA Bayern, Bezirksgeschäftsstelle Mittelfranken',
  phone: '0911 262611',
  email: 'mittelfranken@dehoga-bayern.de',
  address: 'Am Plärrer 10, 90429 Nürnberg',
  url: 'https://www.dehoga-bayern.de/',
};

export const BGN: Contact = {
  name: 'BGN, Berufsgenossenschaft Nahrungsmittel und Gastgewerbe (Anmeldung, Beitrag)',
  phone: '0621 4456-1581',
  email: 'beitrag@bgn.de',
  url: 'https://www.bgn.de/mitgliedschaft-beitrag/mitgliedschaft/betriebsanmeldung',
};

export const BGN_PRAEVENTION: Contact = {
  name: 'BGN, Prävention Nürnberg (Arbeitsschutz, Seminare)',
  phone: '0911 40079-0',
  email: 'praevention-nuernberg@bgn.de',
  address: 'Passauer Straße 7, 90480 Nürnberg',
  url: 'https://www.bgn.de/gruendung',
};

export const KFW: Contact = {
  name: 'KfW, Infocenter für Förderkredite',
  phone: '0800 539-9001',
  url: 'https://www.kfw.de/',
};

export const BETRIEBSNUMMERN: Contact = {
  name: 'Betriebsnummern-Service der Bundesagentur für Arbeit',
  phone: '0800 4 5555 20',
  email: 'betriebsnummernservice@arbeitsagentur.de',
  url: 'https://www.arbeitsagentur.de/unternehmen/betriebsnummern-service',
};

export const MINIJOB: Contact = {
  name: 'Minijob-Zentrale',
  phone: '0355 2902-70799',
  url: 'https://www.minijob-zentrale.de/',
};
