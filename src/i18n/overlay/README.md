# Overlay-Sprachen (/uk/, /tr/)

Die Website ist auf Deutsch und Englisch gebaut (`t('de', 'en')` und
`<span class="lang de">…</span><span class="lang en">…</span>`). Ukrainisch
und Türkisch liegen **nicht** daneben im Code, sondern als Overlay:

- `src/i18n/<sprache>/dict/*.json`: Wörterbücher, Schlüssel = deutscher Text,
  Wert = Übersetzung. Pro Seite ein Wörterbuch, plus `common.json` für Header,
  Footer, Cookie-Banner und geteilte Bausteine.
- `src/i18n/<sprache>/table.ts`: Lade-Tabelle der Sprache, je Wörterbuch ein
  Chunk.
- `src/i18n/<sprache>/README.md`: Stil, Hausregeln und Glossar der Sprache.
- `route-dicts.ts` (hier): welche Route welche Wörterbücher lädt, für alle
  Sprachen gleich (neue Seite → hier eintragen; neues Wörterbuch → auch in
  `DICT_NAMES`, in jeder `table.ts` und in `tools/i18n-overlay.mjs`,
  `GROUP_RULES`).
- `dictionaries.ts`: die Liste der Overlay-Sprachen (`OVERLAY_LANGS`), der
  Resolver an jeder Overlay-Route, der ihre Wörterbücher lädt (und den
  Komponenten-Chunk gleich mit anstößt), und welche Seiten keine
  Overlay-Fassung haben (`OVERLAY_EXCLUDED_PATHS`). Liegt im Hauptbundle und
  bleibt deshalb klein.
- `loader.ts`: lädt die Lade-Tabelle der Sprache und ihre Wörterbücher.
- `catalog.ts`: `OverlayCatalog`, ein Katalog je Seitenaufruf (im Browser)
  bzw. je gerenderter Seite (beim Prerendern laufen viele Seiten im selben
  Prozess), gehalten vom `LanguageService`: Nachschlagen (`lookup`) und die
  DOM-Übersetzung der `.lang.de`-Blöcke (`translateTree`). Kein Zustand im
  Modul, sonst erbt eine Seite die Wörterbücher einer vorher gerenderten
  (bis 18.11.2026 so geschehen: Menüpunkte wechselten je nach
  Renderreihenfolge ihre Übersetzung).

Steht derselbe deutsche Text in mehreren Wörterbüchern, gilt zuerst das der
Seite (in der Reihenfolge von `route-dicts.ts`), dann `common`.
- `provide.ts`, `server.ts`: Laden vor dem ersten Rendern, Feinschliff beim
  Prerendern.

Die Wörterbücher einer Sprache lädt nur eine Seite dieser Sprache. Deutsche
und englische Seiten werden dadurch nicht schwerer, eine türkische Seite lädt
nichts Ukrainisches und umgekehrt. Fehlt ein Eintrag, zeigt die Seite den
englischen Text (mit `lang="en"`). Ein Seitenaufruf hat genau eine Sprache:
der Wechsel in einen Overlay-Baum, aus ihm heraus oder in einen anderen lädt
die Seite neu.

## Arbeitsablauf

```bash
node tools/i18n-overlay.mjs <sprache> extract   # offene Texte → tmp/i18n-<sprache>/todo/<wörterbuch>.json
# übersetzen: { "<id>": "<text>" } → tmp/i18n-<sprache>/done/<beliebig>.json
node tools/i18n-overlay.mjs <sprache> merge     # prüft Platzhalter, trägt in dict/*.json ein
node tools/i18n-overlay.mjs <sprache> check     # prerendert und meldet, was auf /<sprache>/ noch fehlt
node tools/i18n-overlay.mjs <sprache> review    # tmp/i18n-<sprache>/review.csv (DE | EN | Sprache) zur Durchsicht
```

Ändert sich ein deutscher Text, passt sein alter Schlüssel nicht mehr: die
Overlay-Seite zeigt dort Englisch, bis `extract` → übersetzen → `merge`
gelaufen ist, für jede Sprache. Veraltete Übersetzungen bleiben so nie
unbemerkt stehen.

Indexierung: `OVERLAY_INDEXABLE` in `src/services/seo.service.ts`. Solange
eine Sprache dort `false` hat, tragen ihre Seiten `noindex,follow` und kein
`hreflang`; beim Umstellen nimmt `tools/generate-sitemap.mjs` sie von selbst
in die Sitemap auf.

## Schlüssel und Platzhalter

- `<0>…</0>`, `<1/>`: Kindelemente des deutschen Blocks (Links, `<strong>`,
  `<br>`). Jeder Platzhalter kommt in der Übersetzung genau einmal vor, die
  Reihenfolge darf sich ändern. Der Text dazwischen wird übersetzt.
- `{0}`, `{1}`: eingesetzte Werte (Zahlen, Namen, Datum). Genau einmal
  übernehmen, Position frei.
- Leerzeichen um Platzhalter herum zählen beim Schlüssel nicht, in der
  Übersetzung schon: `"див. <0>посібник</0> нижче"`.

## Eine weitere Sprache

1. Code in `OVERLAY_LANGS` (`dictionaries.ts`) und im Sprachmenü
   (`guide-lang-toggle.component.ts`), Präfix in `language.service.ts`
   (`PREFIX`), Locale in `seo.service.ts` (`OG_LOCALE`, `OVERLAY_INDEXABLE`),
   ein Spiegelbaum in `app-routing.module.ts`, die CSS-Regel an den fünf
   Stellen mit `[data-lang='tr']` (index.html, styles.scss, _guide.scss,
   mojoclipboard-support.component.scss, strip-inactive-language.ts).
2. `src/i18n/<sprache>/table.ts` als Kopie einer bestehenden, `dict/` mit den
   Wörterbüchern, `README.md` mit Stil und Glossar; die Sprache in `TABLES`
   (`loader.ts`) und in `LANGS` (`tools/i18n-overlay.mjs`).
3. Schriften prüfen: deckt Outfit und Fraunces die Schrift nicht ab (wie
   Kyrillisch), braucht die Sprache eigene Dateien wie `uk-fonts.css`.
