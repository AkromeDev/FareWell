# Ukrainisch (/uk/)

Die Website ist auf Deutsch und Englisch gebaut (`t('de', 'en')` und
`<span class="lang de">…</span><span class="lang en">…</span>`). Ukrainisch
liegt **nicht** daneben im Code, sondern als Overlay in diesem Ordner:

- `dict/*.json`: Wörterbücher, Schlüssel = deutscher Text, Wert = Ukrainisch.
  Pro Seite ein Wörterbuch, plus `common.json` für Header, Footer,
  Cookie-Banner und geteilte Bausteine.
- `table.ts`: welche Route welche Wörterbücher lädt (neue Seite → hier
  eintragen, neues Wörterbuch → auch in `tools/i18n-uk.mjs`, `GROUP_RULES`).
- `dictionaries.ts`: hängt das Laden an die /uk/-Routen; welche Seiten keine
  ukrainische Fassung haben (`UK_EXCLUDED_PATHS`).
- `catalog.ts`: Nachschlagen (`ukLookup`) und die DOM-Übersetzung der
  `.lang.de`-Blöcke (`translateTree`).
- `provide.ts`: Laden vor dem ersten Rendern, Feinschliff beim Prerendern.

Die Wörterbücher lädt nur eine `/uk/`-Seite. Deutsche und englische Seiten
werden dadurch nicht schwerer. Fehlt ein Eintrag, zeigt die ukrainische Seite
den englischen Text (mit `lang="en"`).

## Arbeitsablauf

```bash
node tools/i18n-uk.mjs extract   # offene Texte → tmp/i18n-uk/todo/<wörterbuch>.json
# übersetzen: { "<id>": "<ukrainisch>" } → tmp/i18n-uk/done/<beliebig>.json
node tools/i18n-uk.mjs merge     # prüft Platzhalter, trägt in dict/*.json ein
node tools/i18n-uk.mjs check     # prerendert und meldet, was auf /uk/ noch fehlt
node tools/i18n-uk.mjs review    # tmp/i18n-uk/review.csv (DE | EN | UK) zur Durchsicht
```

Ändert sich ein deutscher Text, passt sein alter Schlüssel nicht mehr: die
ukrainische Seite zeigt dort Englisch, bis `extract` → übersetzen → `merge`
gelaufen ist. Veraltete Übersetzungen bleiben so nie unbemerkt stehen.

Indexierung: `UK_PREFIX_INDEXABLE` in `src/services/seo.service.ts`. Solange
`false`, tragen die /uk/-Seiten `noindex,follow` und kein `hreflang="uk"`.
Beim Umstellen auch den /uk/-Block in `src/sitemap.xml` eintragen.

## Schlüssel und Platzhalter

- `<0>…</0>`, `<1/>`: Kindelemente des deutschen Blocks (Links, `<strong>`,
  `<br>`). Jeder Platzhalter kommt in der Übersetzung genau einmal vor, die
  Reihenfolge darf sich ändern. Der Text dazwischen wird übersetzt.
- `{0}`, `{1}`: eingesetzte Werte (Zahlen, Namen, Datum). Genau einmal
  übernehmen, Position frei.
- Leerzeichen um Platzhalter herum zählen beim Schlüssel nicht, in der
  Übersetzung schon: `"див. <0>посібник</0> нижче"`.

## Stil

**Anrede.** Deutsch duzt. Ukrainisch siezt: **ви** (kleingeschrieben), freundlich
und direkt, wie eine gute Beratung im Studio. Kurze Sätze, keine Werbefloskeln.

**Sprache.** Modernes Standard-Ukrainisch (Rechtschreibung 2019), keine
Russismen: *брати участь* (nicht приймати участь), *протягом* (nicht на
протязі), *наступний* (nicht слідуючий), *є* (nicht являється), *збігатися*
(nicht співпадати), *у разі* (nicht в випадку), *вартість* (nicht ціна
питання).

**Hausregeln, die auch auf Ukrainisch gelten:**

1. **Kein Gedankenstrich als Satztrenner.** Kein „—“ und kein „–“ zwischen
   Satzteilen, auch nicht im ukrainischen „X — це Y“: umformulieren
   (*X є…*, *X означає…*, Doppelpunkt, Komma, neuer Satz, Klammer). Erlaubt
   bleiben Bereiche (*10–20*, *2–4 дні*) und der Trenner in Seitentiteln
   (*X – Y | FareWell*), so wie im deutschen Original.
2. **„permanent“ nur für die Elektrolyse.** Laser und IPL sind „dauerhaft“ =
   *тривале* / *довготривале* видалення волосся, nie *назавжди* oder
   *остаточне*.
3. **Krankenkasse nie versprechen.** Ob eine Kasse zahlt, hängt von der Kasse
   ab: *це залежить від вашої каси, але спробувати варто*. Nie stärker
   formulieren als das deutsche Original.
4. **Eine Kosmetikerin pro Behandlung.** Nie mehrere gleichzeitig behaupten.
5. **Groupon und Urban Sports Club:** Auszahlungen bleiben zu 100% bei der
   selbständigen Person, FareWell nimmt davon 0%.
6. **Heilmittelwerberecht:** *ботулотоксин*, nie „ботокс“. Keine
   Heilversprechen, keine Garantie für Ergebnisse.

**Inklusiv und trans-freundlich.**

- *trans Personen* → **трансгендерні люди** (kurz: *транс-люди*).
- *Transition* → **перехід** (*трансгендерний перехід*), nie „зміна статі“.
- Diagnosen bleiben als Fachbegriffe: *гендерна дисфорія*,
  *гендерна неконгруентність*, *F64.0*.
- Personengruppen möglichst neutral (*люди*, *кожен, хто…*, *ті, хто…*), wo
  nötig beide Formen: *клієнти та клієнтки*. Berufsbezeichnungen in
  Stellentexten mit Klammer: *масажист(ка)*, *фізіотерапевт(ка)*,
  *косметолог(иня)*, *викладач(ка) йоги*.
- Benannte Personen behalten das grammatische Geschlecht, das der deutsche
  Text ihnen gibt (*Anna, unsere erste Masseurin* → *масажистка*;
  *Dr. med. univ. Noam Degner, unser medizinischer Berater* → *консультант*).
  Joé spricht in der Ich-Form: wo das Ukrainische ein Geschlecht verlangt
  (Vergangenheit: *я заснував*), männliche Formen, sonst neutral formulieren.

**Deutsche Behörden und Begriffe.** Die Leser:innen leben in Deutschland und
begegnen den deutschen Wörtern auf Briefen und Formularen. Daher beim ersten
Vorkommen pro Text: ukrainisch erklären, deutschen Begriff in Klammern:
*медична страхова каса (Krankenkasse)*, *податкова (Finanzamt)*,
*кошторис (Kostenvoranschlag)*. Danach reicht die kurze Form.

**Typografie.** Anführungszeichen «…», Apostroph ’ (*п’ять*, *з’явитися*),
Dezimalkomma (*4,9*), Betrag vor dem Euro mit Leerzeichen (*250 €*, *від
80 €*), Prozent wie im Original (*50%*). Wochentage *Пн Вт Ср Чт Пт Сб Нд*,
*хв* für Minuten, *год* für Stunden.

**Unverändert lassen:** FareWell, Salonkee, Google, Instagram, WhatsApp,
Groupon, Urban Sports Club, MojoClipboard, Personennamen (Joé, Anna,
Dr. med. univ. Noam Degner), Straßennamen und Adressen (*Frauentorgraben 5*),
Rabattcodes (*ERSTEBEHANDLUNG*), E-Mail-Adressen, Telefonnummern, URLs,
Paragraphen (*§ 27 SGB V*), Tastenkürzel.

**Suchmaschinen.** Seitentitel und Beschreibungen so, wie man auf Ukrainisch
sucht: *Лазерна епіляція в Нюрнберзі | FareWell*. *Nürnberg* → *Нюрнберг*,
Lokativ *у Нюрнберзі*. „FareWell Nürnberg“ → *FareWell Нюрнберг*.

## Glossar

| Deutsch | Українська |
| --- | --- |
| Nadelepilation, Elektrolyse | електроепіляція (голкова) |
| permanente Haarentfernung | остаточне видалення волосся |
| dauerhafte Haarentfernung (Laser) | тривале видалення волосся |
| Haarentfernung / Epilation | видалення волосся / епіляція |
| 4 Wellen Diodenlaser | 4-хвильовий діодний лазер |
| Laser-Haarentfernung | лазерна епіляція |
| IPL | IPL (фотоепіляція) |
| Radiofrequenz Microneedling | RF-мікронідлінг (радіочастотний мікронідлінг) |
| Narbenbehandlung | корекція рубців |
| Aknenarben / Dehnungsstreifen | рубці після акне (постакне) / розтяжки (стрії) |
| Ultraschall Kavitation | ультразвукова кавітація |
| Body Forming | Body Forming (моделювання фігури) |
| Cellulite | целюліт |
| Wellness Massage | Wellness-масаж |
| Therapeutische Massage | терапевтичний масаж |
| Behandlung / Sitzung | процедура / сеанс |
| Beratung (kostenlos) | (безкоштовна) консультація |
| Termin buchen | записатися |
| Kosmetikstudio | косметична студія |
| Kosmetikerin | косметологиня |
| Hauttyp / Haartyp | тип шкіри / тип волосся |
| Krankenkasse | медична страхова каса (Krankenkasse), kurz: каса |
| gesetzliche Krankenversicherung | державне медичне страхування (GKV) |
| Kostenübernahme | покриття витрат |
| Antrag / Bewilligung / Widerspruch | заява / схвалення / заперечення (Widerspruch) |
| Attest | медичний висновок (Attest) |
| Kostenvoranschlag | кошторис (Kostenvoranschlag) |
| Ärztevorbehalt | вимога, щоб процедуру виконував лікар (Arztvorbehalt) |
| ärztliche Delegation | делегування лікарем |
| Medizinischer Dienst (MD) | медична служба каси (MD) |
| Hausarzt / Hausärztin | сімейний лікар (Hausarzt) |
| Hirsutismus / Hypertrichose | гірсутизм / гіпертрихоз |
| PCOS | СПКЯ (синдром полікістозних яєчників) |
| Wechseljahre | менопауза |
| Finanzamt / Steuererklärung | податкова (Finanzamt) / податкова декларація |
| außergewöhnliche Belastung | надзвичайні витрати (außergewöhnliche Belastungen) |
| Gewerbeanmeldung | реєстрація підприємництва (Gewerbeanmeldung) |
| selbständig / Freelancer:in | самозайнятий / фрилансер(ка) |
| Kleinunternehmerregelung | режим малого підприємця (Kleinunternehmerregelung) |
| Umsatzsteuer, Mehrwertsteuer | ПДВ (Umsatzsteuer) |
| Gesundheitsamt | відділ охорони здоров’я (Gesundheitsamt) |
| Masseur:in und med. Bademeister:in | масажист(ка) і медичний банщик (Masseur und medizinischer Bademeister) |
| Physiotherapeut:in | фізіотерапевт(ка) |
| Hauptbahnhof | головний вокзал (Hauptbahnhof) |
