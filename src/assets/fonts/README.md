# Fonts

Hosted on the site so that no page asks a third party for anything before
consent (SEO audit #10, 10.11.2026). Taken unchanged from Google Fonts as woff2,
Latin and Latin Extended subsets (Cyrillic for Lora and Onest). The name ends
with the first eight characters of the file's SHA-256, because `/assets/fonts/*`
is cached for a year (`src/_headers`): a changed file needs a new name.

| Family | Use | Licence |
| --- | --- | --- |
| Outfit | Body text | SIL Open Font License 1.1 |
| Fraunces | Headings | SIL Open Font License 1.1 |
| Hurricane | Script accents | SIL Open Font License 1.1 |
| Lora, Onest | Cyrillic fallbacks on /uk (`uk-fonts.css`) | SIL Open Font License 1.1 |

The licence text: https://openfontlicense.org/open-font-license-official-text/
The copyright notices are inside each font file.

`@font-face` rules: inline in `src/index.html` for the main families, in
`uk-fonts.css` for the Cyrillic ones (loaded by `LanguageService` on /uk only).
