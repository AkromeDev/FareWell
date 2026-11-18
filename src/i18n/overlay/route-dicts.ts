/**
 * Welche Route welche Wörterbücher lädt, für alle Overlay-Sprachen gleich.
 * `common` (Header, Footer, Cookie-Banner, geteilte Bausteine) lädt beim
 * Start jeder Overlay-Seite, die Seitenwörterbücher parallel zum
 * Komponenten-Chunk ihrer Route. Welche Quelldatei in welches Wörterbuch
 * gehört, regelt tools/i18n-overlay.mjs (GROUP_RULES).
 *
 * Neue Seite → hier eintragen. Neues Wörterbuch → in DICT_NAMES, in der
 * Lade-Tabelle jeder Sprache (src/i18n/<sprache>/table.ts) und in
 * GROUP_RULES.
 */
export const DICT_NAMES = [
  'common',
  'home',
  'nadelepilation',
  'diodenlaser',
  'microneedling',
  'narbenbehandlung',
  'kavitation',
  'massage',
  'therapeutische-massage',
  'price',
  'zeit',
  'historie',
  'faq',
  'ratgeber-hub',
  'elektrolyse-laser',
  'koerperbehandlungen',
  'krankenkasse-epilation',
  'krankenkasse-hormonell',
  'kostenvoranschlag',
  'steuer-absetzen',
  'mojoclipboard-support',
  'karriere',
  'karriere-hub',
  'kosmetik-karriere',
  'masseur-karriere',
  'masseur-onboarding',
  'physio-karriere',
  'yoga-karriere',
  'tanz-karriere',
  'botox-karriere',
  'raum-mieten',
  'road',
  'freelancer-road',
  'gastro-road',
  'laser-promotion',
  'ipl-promotion',
  'electrolysis-promotion',
  'microneedling-promotion',
  'nadelepilation-promotion',
] as const;

export type DictName = (typeof DICT_NAMES)[number];

/** Route (Pfad ohne Sprachpräfix) → Wörterbücher dieser Seite. */
export const ROUTE_DICTS: Readonly<Record<string, readonly DictName[]>> = {
  '': ['home'],
  'behandlungen/nadelepilation': ['nadelepilation'],
  'behandlungen/diodenlaser-4-wellen': ['diodenlaser'],
  'behandlungen/microneedling-radiofrequenz': ['microneedling'],
  'behandlungen/narbenbehandlung': ['narbenbehandlung'],
  'behandlungen/kavitation': ['kavitation'],
  'behandlungen/wellness-massage': ['massage'],
  'behandlungen/therapeutische-massage': ['therapeutische-massage'],
  price: ['price'],
  zeit: ['zeit'],
  historie: ['historie'],
  faq: ['faq'],
  'ratgeber/': ['ratgeber-hub'],
  'ratgeber/elektrolyse-oder-laser': ['elektrolyse-laser'],
  'ratgeber/kavitation-ultraschall-fettreduktion': ['koerperbehandlungen'],
  'ratgeber/epilation-krankenkasse': ['krankenkasse-epilation', 'kostenvoranschlag'],
  'ratgeber/epilation-krankenkasse-hormonell': ['krankenkasse-hormonell', 'kostenvoranschlag'],
  'ratgeber/haarentfernung-steuer-absetzen': ['steuer-absetzen'],
  'mojoclipboard-support': ['mojoclipboard-support'],
  karriere: ['karriere', 'karriere-hub'],
  'karriere/kosmetik-nuernberg': ['karriere', 'kosmetik-karriere'],
  'karriere/masseur-nuernberg': ['karriere', 'masseur-karriere'],
  'karriere/masseur-nuernberg/onboarding': ['karriere', 'masseur-onboarding'],
  'karriere/physiotherapeut-nuernberg': ['karriere', 'physio-karriere'],
  'karriere/yoga-nuernberg': ['karriere', 'yoga-karriere'],
  'karriere/tanzlehrer-nuernberg': ['karriere', 'tanz-karriere'],
  'karriere/botox-nuernberg': ['karriere', 'botox-karriere'],
  'karriere/raum-mieten-nuernberg': ['karriere', 'raum-mieten'],
  'karriere/freelancer-road': ['karriere', 'road', 'freelancer-road'],
  'karriere/freelancer-road/schritte': ['karriere', 'road', 'freelancer-road'],
  'karriere/freelancer-road/gastro': ['karriere', 'road', 'gastro-road'],
  'laser-haarentfernung-aktion-nuernberg': ['laser-promotion'],
  'ipl-dauerhafte-haarentfernung-aktion-nuernberg': ['ipl-promotion'],
  'elektrolyse-permanente-haarentfernung-aktion-nuernberg': ['electrolysis-promotion'],
  'microneedling-aktion-nuernberg': ['microneedling-promotion'],
  'nadelepilation-angebot-nuernberg': ['nadelepilation-promotion'],
};
