# Türkisch (/tr/)

Türkisch ist, wie Ukrainisch, ein Overlay über den deutschen und englischen
Texten: Wörterbücher in `dict/*.json` (Schlüssel = deutscher Text, Wert =
Türkisch), geladen nur auf `/tr/`-Seiten. Wie das Overlay funktioniert, steht
in `src/i18n/overlay/README.md`; welche Route welches Wörterbuch lädt, in
`table.ts`. Fehlt ein Eintrag, zeigt die türkische Seite den englischen Text
(mit `lang="en"`).

Eingeführt am 18.11.2026 (Joé: „one more option after Ukrainisch“), als
Erstübersetzung durch Claude. Eine Durchsicht durch eine Muttersprachlerin oder
einen Muttersprachler steht noch aus: `node tools/i18n-overlay.mjs tr review`
schreibt die Tabelle DE | EN | TR dafür.

## Arbeitsablauf

```bash
node tools/i18n-overlay.mjs tr extract   # offene Texte → tmp/i18n-tr/todo/<wörterbuch>.json
# übersetzen: { "<id>": "<türkisch>" } → tmp/i18n-tr/done/<beliebig>.json
node tools/i18n-overlay.mjs tr merge     # prüft Platzhalter, trägt in dict/*.json ein
node tools/i18n-overlay.mjs tr check     # prerendert und meldet, was auf /tr/ noch fehlt
node tools/i18n-overlay.mjs tr review    # tmp/i18n-tr/review.csv (DE | EN | TR) zur Durchsicht
```

Platzhalter (`<0>…</0>`, `<1/>`, `{0}`) wie beim Ukrainischen: jeder genau
einmal, Reihenfolge frei. Türkisch stellt Verben ans Satzende und hängt Endungen
an; die Platzhalter wandern mit (`<0>Salonkee</0>’de`, `%{0}`).

## Stil

**Anrede.** Deutsch duzt. Türkisch siezt: **siz**, freundlich und direkt, wie
eine gute Beratung im Studio (*randevunuzu alın*, *cildiniz*). Kurze Sätze,
keine Werbefloskeln. Aufforderungen auf Knöpfen kurz: *Randevu al*,
*Daha fazla bilgi*.

**Leserschaft.** Türkischsprachige Menschen, die in Nürnberg und Umgebung
leben. Modernes Standardtürkisch (TDK), keine Umgangssprache, keine
eingedeutschten Mischformen.

**Hausregeln, die auch auf Türkisch gelten:**

1. **Kein Gedankenstrich als Satztrenner.** Kein „—“ und kein „–“ zwischen
   Satzteilen: umformulieren (Doppelpunkt, Komma, neuer Satz, Klammer).
   Erlaubt bleiben Bereiche (*10–20*, *2–4 gün*) und der Trenner in
   Seitentiteln (*X – Y | FareWell*), so wie im deutschen Original.
2. **„permanent“ nur für die Elektrolyse.** Nur die Elektrolyse
   (Nadelepilation) ist **kalıcı tüy alma**. Laser und IPL sind „dauerhaft“ =
   **uzun süreli tüy azaltma** (oder *uzun süreli tüy alma*), nie *kalıcı*,
   auch wenn man in der Türkei umgangssprachlich „kalıcı lazer epilasyon“ sagt.
3. **Krankenkasse nie versprechen.** Ob eine Kasse zahlt, hängt von der Kasse
   ab: *bu sigortanıza bağlıdır, ama denemeye değer*. Nie stärker formulieren
   als das deutsche Original.
4. **Eine Kosmetikerin pro Behandlung.** Nie mehrere gleichzeitig behaupten.
5. **Groupon und Urban Sports Club:** Auszahlungen bleiben zu 100% bei der
   selbständigen Person, FareWell nimmt davon 0%.
6. **Heilmittelwerberecht:** **botulinum toksini**, nie „Botoks“ oder „Botox“
   (auch wenn das deutsche Original „Botox“ schreibt, etwa in einem
   Seitentitel). Keine Heilversprechen, keine Garantie für Ergebnisse.
   „Behandlung“ ist im kosmetischen Sinn **uygulama**; *tedavi* nur, wo das
   Deutsche selbst von ärztlicher Behandlung oder Therapie spricht, und im
   festen Namen *yara izi tedavisi* (Narbenbehandlung).

**Inklusiv und trans-freundlich.**

- *trans Personen* → **trans bireyler**.
- *Transition* → **geçiş süreci** (*trans geçiş süreci*), nie
  „cinsiyet değiştirme“.
- Diagnosen bleiben Fachbegriffe: *cinsiyet disforisi*,
  *cinsiyet uyumsuzluğu* (Geschlechtsinkongruenz), *F64.0*.
- Türkisch kennt kein grammatisches Geschlecht; Berufe neutral benennen:
  *masaj terapisti* (nicht masör/masöz), *kozmetisyen*, *fizyoterapist*,
  *yoga eğitmeni*, *dans eğitmeni*, *hekim*. *Kunden* → *müşteriler*,
  *danışanlar*.
- Benannte Personen wie im Original (*Anna, ilk masaj terapistimiz*;
  *Dr. med. univ. Noam Degner, FareWell ile iş birliği yapan hekim*).

**Deutsche Behörden und Begriffe.** Die Leser:innen leben in Deutschland und
begegnen den deutschen Wörtern auf Briefen und Formularen. Daher beim ersten
Vorkommen pro Text: türkisch erklären, deutschen Begriff in Klammern:
*sağlık sigortası (Krankenkasse)*, *vergi dairesi (Finanzamt)*,
*maliyet tahmini (Kostenvoranschlag)*. Danach reicht die kurze Form.

**Typografie.** Anführungszeichen “…”, Apostroph vor Endungen an
Eigennamen typografisch: *FareWell’de*, *Nürnberg’de*, *Salonkee’den*.
Dezimalkomma (*4,9*), Betrag vor dem Euro mit Leerzeichen (*250 €*,
*80 €’dan itibaren*). Prozent türkisch vor der Zahl: *%50*, *%{0}*.
Wochentage *Pzt Sal Çar Per Cum Cmt Paz*, *dk* für Minuten, *sa* für Stunden.
Datum wie im Deutschen (*18.11.2026*). Großschreibung: *İ/i* und *I/ı* sind
verschiedene Buchstaben (*İstanbul*, *Işık*); Wörter im Satz klein, nur
Satzanfang, Eigennamen und Titel groß.

**Unverändert lassen:** FareWell, Salonkee, Google, Instagram, WhatsApp,
Groupon, Urban Sports Club, MojoClipboard, Body Forming, Personennamen (Joé,
Anna, Dr. med. univ. Noam Degner), Straßennamen und Adressen
(*Frauentorgraben 5*), Rabattcodes (*ERSTEBEHANDLUNG*), E-Mail-Adressen,
Telefonnummern, URLs, Paragraphen (*§ 27 SGB V*), Tastenkürzel.

**Suchmaschinen.** Seitentitel und Beschreibungen so, wie man auf Türkisch
sucht: *Nürnberg’de Lazer Epilasyon | FareWell*. *Nürnberg* bleibt
*Nürnberg*. „FareWell Nürnberg“ bleibt *FareWell Nürnberg*.

## Glossar

| Deutsch | Türkçe |
| --- | --- |
| Nadelepilation, Elektrolyse | iğneli epilasyon (elektroliz) |
| permanente Haarentfernung | kalıcı tüy alma |
| dauerhafte Haarentfernung (Laser) | uzun süreli tüy azaltma |
| Haarentfernung / Epilation | tüy alma / epilasyon |
| 4 Wellen Diodenlaser | 4 dalga boylu diyot lazer |
| Laser-Haarentfernung | lazer epilasyon |
| IPL | IPL |
| Radiofrequenz Microneedling | radyofrekanslı microneedling (RF microneedling) |
| Narbenbehandlung | yara izi tedavisi |
| Aknenarben / Dehnungsstreifen | akne izleri / çatlaklar (stria) |
| Ultraschall Kavitation | ultrason kavitasyon |
| Body Forming | Body Forming (vücut şekillendirme) |
| Cellulite | selülit |
| Wellness Massage | wellness masajı |
| Therapeutische Massage | terapötik masaj |
| Aromaöl-Massage | aromaterapi yağı ile masaj |
| Behandlung / Sitzung | uygulama / seans |
| erste Behandlung | ilk uygulama |
| Beratung (kostenlos) | (ücretsiz) danışmanlık |
| kostenlose Erstberatung | ücretsiz ön görüşme |
| Termin buchen | randevu al |
| Kosmetikstudio | güzellik stüdyosu |
| Kosmetiker:in | kozmetisyen |
| Masseur:in | masaj terapisti |
| Hauttyp / Haartyp | cilt tipi / kıl tipi |
| Rabatt / Aktion / Gutschein | indirim / kampanya / hediye çeki |
| Botox, Botulinumtoxin | botulinum toksini |
| ästhetische Medizin | estetik tıp |
| Arzt / Ärztin | hekim |
| Krankenkasse | sağlık sigortası (Krankenkasse), kurz: sigorta |
| gesetzliche Krankenversicherung | yasal sağlık sigortası (GKV) |
| Kostenübernahme | masrafların karşılanması (Kostenübernahme) |
| Antrag / Bewilligung / Widerspruch | başvuru / onay / itiraz (Widerspruch) |
| Attest | doktor raporu (Attest) |
| Kostenvoranschlag | maliyet tahmini (Kostenvoranschlag) |
| Ärztevorbehalt | işlemin hekim tarafından yapılması şartı (Arztvorbehalt) |
| kooperierender Arzt (berät, ordnet nicht an, behandelt nicht) | FareWell ile iş birliği yapan hekim |
| Preise für den Kassenantrag | sigorta başvurusu için fiyatlar |
| Medizinischer Dienst (MD) | sigortanın tıbbi hizmeti (Medizinischer Dienst, MD) |
| Hausarzt / Hausärztin | aile hekimi (Hausarzt) |
| Hirsutismus / Hypertrichose | hirsutizm / hipertrikoz |
| PCOS | PKOS (polikistik over sendromu) |
| Wechseljahre | menopoz |
| Finanzamt / Steuererklärung | vergi dairesi (Finanzamt) / vergi beyannamesi (Steuererklärung) |
| außergewöhnliche Belastung | olağanüstü giderler (außergewöhnliche Belastungen) |
| Gewerbeanmeldung | ticari faaliyet kaydı (Gewerbeanmeldung) |
| selbständig / Freelancer:in | serbest çalışan / freelancer |
| Kleinunternehmerregelung | küçük işletme düzenlemesi (Kleinunternehmerregelung) |
| Umsatzsteuer, Mehrwertsteuer | KDV (Umsatzsteuer) |
| Umsatzbeteiligung / Raummiete | ciro payı / oda kirası |
| Gesundheitsamt | sağlık dairesi (Gesundheitsamt) |
| Masseur:in und med. Bademeister:in | masaj terapisti ve tıbbi banyo uzmanı (Masseur und medizinischer Bademeister) |
| Physiotherapeut:in | fizyoterapist |
| Hauptbahnhof | ana tren istasyonu (Hauptbahnhof) |
