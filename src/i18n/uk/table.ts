import { isUkDictRegistered, registerUkDict } from './catalog';
import type { UkDict } from './catalog';

/**
 * Lade-Tabelle der ukrainischen Wörterbücher, je Seite ein eigener Chunk.
 * `common` (Header, Footer, Cookie-Banner, geteilte Bausteine) lädt beim
 * Start jeder /uk/-Seite, die Seitenwörterbücher parallel zum
 * Komponenten-Chunk ihrer Route. Welche Quelldatei in welches Wörterbuch
 * gehört, regelt tools/i18n-uk.mjs.
 *
 * Wird selbst erst auf /uk/-Seiten geladen (siehe dictionaries.ts).
 */
const DICTS = {
  common: () => import('./dict/common.json'),
  home: () => import('./dict/home.json'),
  nadelepilation: () => import('./dict/nadelepilation.json'),
  diodenlaser: () => import('./dict/diodenlaser.json'),
  microneedling: () => import('./dict/microneedling.json'),
  narbenbehandlung: () => import('./dict/narbenbehandlung.json'),
  kavitation: () => import('./dict/kavitation.json'),
  massage: () => import('./dict/massage.json'),
  'therapeutische-massage': () => import('./dict/therapeutische-massage.json'),
  price: () => import('./dict/price.json'),
  zeit: () => import('./dict/zeit.json'),
  historie: () => import('./dict/historie.json'),
  faq: () => import('./dict/faq.json'),
  'ratgeber-hub': () => import('./dict/ratgeber-hub.json'),
  'elektrolyse-laser': () => import('./dict/elektrolyse-laser.json'),
  koerperbehandlungen: () => import('./dict/koerperbehandlungen.json'),
  'krankenkasse-epilation': () => import('./dict/krankenkasse-epilation.json'),
  'krankenkasse-hormonell': () => import('./dict/krankenkasse-hormonell.json'),
  kostenvoranschlag: () => import('./dict/kostenvoranschlag.json'),
  'steuer-absetzen': () => import('./dict/steuer-absetzen.json'),
  'mojoclipboard-support': () => import('./dict/mojoclipboard-support.json'),
  karriere: () => import('./dict/karriere.json'),
  'karriere-hub': () => import('./dict/karriere-hub.json'),
  'kosmetik-karriere': () => import('./dict/kosmetik-karriere.json'),
  'masseur-karriere': () => import('./dict/masseur-karriere.json'),
  'masseur-onboarding': () => import('./dict/masseur-onboarding.json'),
  'physio-karriere': () => import('./dict/physio-karriere.json'),
  'yoga-karriere': () => import('./dict/yoga-karriere.json'),
  'tanz-karriere': () => import('./dict/tanz-karriere.json'),
  'botox-karriere': () => import('./dict/botox-karriere.json'),
  road: () => import('./dict/road.json'),
  'freelancer-road': () => import('./dict/freelancer-road.json'),
  'gastro-road': () => import('./dict/gastro-road.json'),
  'laser-promotion': () => import('./dict/laser-promotion.json'),
  'ipl-promotion': () => import('./dict/ipl-promotion.json'),
  'electrolysis-promotion': () => import('./dict/electrolysis-promotion.json'),
  'microneedling-promotion': () => import('./dict/microneedling-promotion.json'),
  'nadelepilation-promotion': () => import('./dict/nadelepilation-promotion.json'),
} satisfies Record<string, () => Promise<{ default: UkDict }>>;

type UkDictName = keyof typeof DICTS;

/** Route (Pfad ohne /uk/) → Wörterbücher dieser Seite. */
const ROUTE_DICTS: Record<string, UkDictName[]> = {
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
  'karriere/freelancer-road': ['karriere', 'road', 'freelancer-road'],
  'karriere/freelancer-road/schritte': ['karriere', 'road', 'freelancer-road'],
  'karriere/freelancer-road/gastro': ['karriere', 'road', 'gastro-road'],
  'laser-haarentfernung-aktion-nuernberg': ['laser-promotion'],
  'ipl-dauerhafte-haarentfernung-aktion-nuernberg': ['ipl-promotion'],
  'elektrolyse-permanente-haarentfernung-aktion-nuernberg': ['electrolysis-promotion'],
  'microneedling-aktion-nuernberg': ['microneedling-promotion'],
  'nadelepilation-angebot-nuernberg': ['nadelepilation-promotion'],
};

export async function loadUkDicts(names: readonly UkDictName[]): Promise<void> {
  await Promise.all(
    names
      .filter((name) => !isUkDictRegistered(name))
      .map((name) => DICTS[name]().then((m) => registerUkDict(name, m.default))),
  );
}

/** Wörterbücher einer Route (Pfad ohne /uk/, z. B. 'ratgeber/' für den Hub). */
export function loadUkDictsForRoute(path: string): Promise<void> {
  return loadUkDicts(ROUTE_DICTS[path] ?? []);
}
