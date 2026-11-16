# AI chat & SEO strategy: what binds this repository

farewell.salon is one of three coordinated websites. This file lists the rules from the shared plan that reach into this code, so that the sites add up instead of competing. It is a reference, not a task list.

The full plan (research, the audit of this site, reasons, roadmap) is kept outside this repository:

- Living document: https://claude.ai/artifact/LBBmnNW5NULQVyqCjAaJw5 (private link)
- Markdown export of 10.11.2026: `domains/marketing/seo/2026-11-10_AI-Chat-SEO-Strategy.md` in the FareWell project folder

If this file and the plan differ, the plan wins. State on 11.11.2026: eleven of the twelve fixes from the plan's audit of this site are live, through pull request 3 (merged on 11.11.2026). Two of them are partial: four descriptions keep Joé's own longer wording (finding 5), and the laser page still lacks device model, NiSV line and terms (finding 8). Open is finding 11, the Google tag that loads before consent, which Joé decides. Open tasks live in the plan's roadmap, not here.

## The three sites

| Site | Role | Primary for |
| --- | --- | --- |
| farewell.salon (this repository) | The place | Everything that happens at Frauentorgraben 5, with prices and booking: hair removal, skin and body treatments, aesthetic medicine with place and price, 9D Breathwork in Nürnberg with dates |
| Dr. med. Andrea Leo's site, drleoaesthetic.de | The doctor | His name and brand, each medical treatment in depth, English and Italian |
| Breathwork site (later, only once it can stand alone) | The method | The LEVEL 44 brand, what 9D is, online sessions. Until then `/behandlungen/level-44` here is its home |

- One primary page per search across all sites. The other site supports with a link and its own, different text.
- No text is copied between the sites. This site stays short: place, price, booking. The doctor's site goes deep.
- No canonical ever points from one domain to another.
- Salonkee is the truth for prices.

## Shared ids for structured data

Every real thing has one id. It is described fully on one site and only referenced by the others. Each page carries one JSON-LD block with one `@graph`.

| Thing | Type | Id | Described on |
| --- | --- | --- | --- |
| FareWell, the studio and the place | BeautySalon | `https://farewell.salon/#organization` | This site, one block on every page |
| Dr. Andrea Leo, the person | Person | `https://drleoaesthetic.de/#dr-andrea-leo` | His site |
| His practice | Physician | `https://drleoaesthetic.de/#practice` | His site |
| A medical treatment | Service here, MedicalProcedure on his site | The page address plus `#service` or `#procedure` | Each on its own page; here `provider` points to his practice |
| Franziska Preusche | Person | `https://farewell.salon/behandlungen/level-44#franziska-preusche` | This site until she has a domain |
| LEVEL 44 | Brand | `https://farewell.salon/behandlungen/level-44#brand` | This site until she has a domain |
| A breathwork session | Event | The page address plus `#event-` and the date | This site |
| A page | WebPage | The page address plus `#webpage` | Every page |

- The domain drleoaesthetic.de was decided on 10.11.2026, so these ids are final. An id is a name, not a link that has to open, so it can be used before his site is live.
- Exactly one BeautySalon block per page.
- Dr. Leo is an independent cooperation doctor, not an employee. The data says so through `provider` and `containedInPlace`.
- Qualifications are written exactly as held and come from one source.
- No ratings or reviews about ourselves in the data.
- Breathwork never gets a medical type.
- FAQPage only holds questions that are visible on the page.

## Page pattern

Every page that should bring bookings follows this order.

1. Heading with service and city.
2. An answer block of 40 to 60 words: who treats, where, from what price, how to book.
3. A facts table: duration, when the effect shows, how long it lasts, downtime, price from, who performs it.
4. One sub section per area or variant. Each answers one search.
5. Procedure in steps, aftercare, risks and who should not have it.
6. Prices as text with "ab", and the fee schedule note on medical pages.
7. The person: name, qualification in exact words, photo, link to their own page.
8. An FAQ built from questions people type.
9. The booking button to Salonkee and the date of the last review.

## Cross-links

- A footer block "Unter einem Dach" names the three sites with one plain line each. It is the same on every page and carries no keyword text.
- In the text a link stands where a reader would want it. The aesthetic medicine page links to the matching treatment page on the doctor's site. Breathwork is linked without any medical promise.
- Every site books through the same Salonkee account, `salonkee.de/salon/farewell`. The link names the site and the page it came from, and the click is counted.
- No link exchanges and no bought links.

## Build standard

- One source file holds name, address, phone, hours, people, qualifications and prices. Pages, structured data, sitemap, `llms.txt` and the assistant's knowledge are generated from it.
- One language per HTML file, each with a canonical on itself and hreflang for every language plus x-default.
- Every page is prerendered to static HTML. Nothing important needs JavaScript.
- Addresses: no www, no trailing slash, lower case, path words in the page's language.
- Title up to 60 characters, description 120 to 155, one main heading.
- A real not found page with status 404.
- A sitemap generated at build time, and a `robots.txt` that names it.
- A `_headers` file: HSTS, Content Security Policy, Permissions Policy, Referrer Policy, nosniff, cache rules for images and hashed files.
- `security.txt` and `SECURITY.md`.
- Fonts hosted on the site. No request to a third party before consent.
- Images in AVIF or WebP in three widths with `srcset`, width and height set, the main image under 150 KB, lazy loading below the first screen.
- Budget: under 200 KB of compressed JavaScript, largest paint under 2,5 seconds on a phone, layout shift under 0,1.
- Accessible to WCAG 2.1 AA.
- The booking button in the first screen, and fixed at the bottom on phones.
- A visible date of the last review. On medical pages the doctor is named as reviewer.

## Shared analytics events

All three sites use the same names.

| Event | Fires when | Carries |
| --- | --- | --- |
| `booking_click` | A visitor follows a link to Salonkee | Site, page, service group, position on the page |
| `phone_click`, `whatsapp_click` | A visitor taps the number or WhatsApp | Site, page |
| `crosslink_click` | A visitor follows a link to one of the other two sites | From which site and page, to which site |
| `chat_open`, `chat_handover` | The assistant is opened, or ends in a booking or contact link | Site, page, topic |
| `map_click` | A visitor opens the map or directions | Site, page |

## Chat assistant (planned, not built)

- It answers only from this site's own facts: treatments, prices, duration, preparation and aftercare as on the pages, the guides, hours, arrival, the free consultation.
- It hands over to Salonkee, WhatsApp or phone. It does not book.
- It refers to the doctor's site for anything a doctor does, and to LEVEL 44 for breathwork.
- It never promises results, never judges someone's skin or hair, never gives medical advice and says nothing about named competitors.
- It says at the first contact that it is an AI assistant. By default nothing a visitor types is stored.
- Build: a small Rust service on Cloudflare Workers under `/api/chat`, one knowledge file generated at build time, a plain TypeScript widget in this code, no new npm dependency, no third party script.
