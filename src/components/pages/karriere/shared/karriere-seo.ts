import {
  KarriereDealItem,
  KarriereFaqEntry,
  Translate,
  karriereWeExpect,
  karriereWeGive,
} from './karriere-content';

/**
 * Baut den JSON-LD-Graph einer Karriere-Detailseite: JobPosting (für Google
 * for Jobs), FAQPage (für die Fragenblöcke), WebPage und BreadcrumbList.
 *
 * Die „Wir bieten“- und „Was wir erwarten“-Listen der Stellenbeschreibung
 * kommen aus karriere-content.ts — genau derselben Quelle, aus der auch
 * <app-karriere-deal> rendert. Sichtbarer Text und strukturierte Daten können
 * so nicht auseinanderlaufen (Googles Anforderung: das Markup muss den
 * sichtbaren Inhalt der Seite abbilden).
 */

const ORIGIN = 'https://farewell.salon';
const LOGO_URL = `${ORIGIN}/assets/images/logo/android-chrome-512x512.png`;

export interface KarriereJobConfig {
  /** Deutscher Pfad der Seite, z. B. '/karriere/kosmetik-nuernberg'. */
  path: string;
  /** Vollständiger Dokumenttitel (identisch mit dem <title>). */
  title: string;
  description: string;
  /** JobPosting.title — der Stellentitel, nicht der Seitentitel. */
  jobTitle: string;
  /** ISO-Datum der Veröffentlichung. */
  datePosted: string;
  /** Berufsfeld im Klartext, z. B. 'Kosmetik und Ästhetik'. */
  occupationalCategory: string;
  industry: string;
  /** Formale Voraussetzungen als Fließtext (JobPosting.qualifications). */
  qualifications: string;
  /** Zweiter Breadcrumb-Eintrag, z. B. 'Karriere: Kosmetiker:in'. */
  breadcrumbName: string;
  /** Einleitender Absatz der Stellenbeschreibung. */
  intro: string;
  responsibilities: string[];
  profile: string[];
  faq: KarriereFaqEntry[];
  /** Betreff der Bewerbungs-Mail, unkodiert. */
  applySubject: string;
  /**
   * JobPosting.workHours. Standard sind vollständig flexible Zeiten; Kurse mit
   * festem Zeitfenster (Yoga, Tanz) setzen hier ihre Abend-/Wochenendzeiten.
   */
  workHours?: string;
}

/** Minimales HTML-Escaping für die eingebettete Stellenbeschreibung. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function list(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

function dealList(items: KarriereDealItem[]): string {
  return `<ul>${items
    .map((item) => `<li><strong>${esc(item.title)}</strong>: ${esc(item.text)}</li>`)
    .join('')}</ul>`;
}

/** Stellenbeschreibung als HTML — Aufgaben und Profil je Beruf, Deal geteilt. */
function jobDescriptionHtml(t: Translate, cfg: KarriereJobConfig): string {
  return (
    `<p>${esc(cfg.intro)}</p>` +
    `<p><strong>${esc(t('Deine Aufgaben', 'Your responsibilities'))}</strong></p>` +
    list(cfg.responsibilities) +
    `<p><strong>${esc(t('Dein Profil', 'Your profile'))}</strong></p>` +
    list(cfg.profile) +
    `<p><strong>${esc(t('Was wir geben', 'What we provide'))}</strong></p>` +
    dealList(karriereWeGive(t)) +
    `<p><strong>${esc(t('Was wir erwarten', 'What we expect'))}</strong></p>` +
    dealList(karriereWeExpect(t))
  );
}

export function buildKarriereJsonLd(
  t: Translate,
  isEn: boolean,
  cfg: KarriereJobConfig
): object {
  const pageUrl = `${ORIGIN}${isEn ? '/en' : ''}${cfg.path}`;
  const homeUrl = isEn ? `${ORIGIN}/en` : ORIGIN;
  const inLanguage = isEn ? 'en' : 'de';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'JobPosting',
        '@id': `${pageUrl}#jobposting`,
        title: cfg.jobTitle,
        description: jobDescriptionHtml(t, cfg),
        inLanguage,
        datePosted: cfg.datePosted,
        employmentType: 'CONTRACTOR',
        directApply: true,
        industry: cfg.industry,
        occupationalCategory: cfg.occupationalCategory,
        qualifications: cfg.qualifications,
        workHours:
          cfg.workHours ??
          t(
            'Vollständig flexible Arbeitszeiten, keine Anwesenheitspflicht ohne gebuchte Termine',
            'Fully flexible working hours, no obligation to be present without booked appointments'
          ),
        hiringOrganization: {
          '@type': 'BeautySalon',
          '@id': `${ORIGIN}/#organization`,
          name: 'FareWell – Kosmetikstudio & dauerhafte Haarentfernung',
          alternateName: 'FareWell',
          url: ORIGIN,
          logo: LOGO_URL,
          sameAs: ['https://www.instagram.com/farewell.salon/'],
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Frauentorgraben 5',
            postalCode: '90443',
            addressLocality: 'Nürnberg',
            addressRegion: 'Bayern',
            addressCountry: 'DE',
          },
        },
        applicationContact: {
          '@type': 'ContactPoint',
          email: 'info@farewell.salon',
          contactType: t('Bewerbung', 'Application'),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage,
        mainEntity: cfg.faq.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: entry.answer,
          },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: cfg.title,
        description: cfg.description,
        inLanguage,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@id': `${pageUrl}#jobposting` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('Karriere', 'Careers'),
            item: `${ORIGIN}${isEn ? '/en' : ''}/karriere`,
          },
          { '@type': 'ListItem', position: 3, name: cfg.breadcrumbName, item: pageUrl },
        ],
      },
    ],
  };
}
