import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { StatsScrollComponent, StatsScrollItem } from 'src/components/molecules/stats-scroll/stats-scroll.component';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';

type PageLang = 'de' | 'en';

const ORIGIN = 'https://farewell.salon';
const PAGE_PATH = '/mojoclipboard-support';
const PAGE_TITLE_DE =
  'MojoClipboard: Support & Anleitung | Zwischenablage-Verlauf für den Mac';
const PAGE_TITLE_EN = 'MojoClipboard: Support & Guide | Clipboard History for Mac';
const PAGE_DESCRIPTION_DE =
  'Support für MojoClipboard, die kostenlose macOS-Menüleisten-App für den Zwischenablage-Verlauf (macOS 14 Sonoma+). Drück ⌃⌘V, um den Verlauf zu öffnen. Datenschutz-first: keine Daten, nichts verlässt dein Gerät.';
const PAGE_DESCRIPTION_EN =
  'Support for MojoClipboard, the free macOS menu-bar clipboard-history app (macOS 14 Sonoma+). Press ⌃⌘V to open your history. Privacy-first: no data collected, nothing leaves your device.';

interface Stat {
  value_de: string;
  value_en: string;
  label_de: string;
  label_en: string;
}

interface Feature {
  icon: string;
  de: string;
  en: string;
}

interface Faq {
  id: string;
  q_de: string;
  q_en: string;
  a_de: string;
  a_en: string;
}

@Component({
  standalone: true,
  selector: 'app-mojoclipboard-support',
  imports: [RevealOnScrollDirective, ScrollToDirective, StatsScrollComponent],
  templateUrl: './mojoclipboard-support.component.html',
  styleUrl: './mojoclipboard-support.component.scss',
})
export class MojoClipboardSupportComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'mojoclipboard-support-schema';

  get lang(): PageLang {
    return this.language.lang() === 'en' ? 'en' : 'de';
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  readonly stats: Stat[] = [
    { value_de: 'Gratis', value_en: 'Free', label_de: 'Preis, für immer', label_en: 'Price, forever' },
    { value_de: '0', value_en: '0', label_de: 'gesammelte Daten', label_en: 'data collected' },
    { value_de: 'macOS 14+', value_en: 'macOS 14+', label_de: 'Sonoma oder neuer', label_en: 'Sonoma or later' },
  ];

  /** Farbverlauf des Hover-Rasters in der Statistik-Sektion (Seitenpalette). */
  readonly statsGridColors = ['#7d6bff', '#4f9bff', '#4ad6a0', '#7d6bff'];

  get statsScrollItems(): StatsScrollItem[] {
    return [
      {
        value: this.t('Gratis', 'Free'),
        caption: this.t(
          'für immer, ohne Abo und ohne In-App-Käufe',
          'forever, no subscription, no in-app purchases'
        ),
        color: 'violet',
      },
      {
        value: this.t('0 Daten', '0 data'),
        caption: this.t(
          'gesammelt, nichts verlässt jemals dein Gerät',
          'collected, and nothing ever leaves your device'
        ),
        color: 'sky',
      },
      {
        value: '⌃⌘V',
        caption: this.t(
          'ein Kürzel für deinen ganzen Zwischenablage-Verlauf',
          'one shortcut for your whole clipboard history'
        ),
        color: 'mint',
      },
    ];
  }

  readonly features: Feature[] = [
    { icon: '📋', de: 'Verlauf für Text, Bilder und Dateien', en: 'History for text, images and files' },
    { icon: '⌨️', de: 'Vollständige Tastaturnavigation, ganz ohne Maus', en: 'Full keyboard navigation, no mouse needed' },
    { icon: '⚡', de: 'Globales Kürzel ⌃⌘V, überall verfügbar', en: 'Global ⌃⌘V shortcut, available everywhere' },
    { icon: '📏', de: 'Einstellbare Verlaufslänge und Größenlimit pro Eintrag', en: 'Adjustable history length and per-item size limit' },
    { icon: '🚀', de: 'Optional „Beim Anmelden starten“', en: 'Optional “Launch at Login”' },
    { icon: '🛡️', de: 'Überspringt automatisch Passwort-Manager- und flüchtige Kopien', en: 'Automatically skips password-manager and transient copies' },
    { icon: '🪶', de: 'Leichtgewichtig und unaufdringlich in der Menüleiste', en: 'Lightweight and unobtrusive in the menu bar' },
    { icon: '🆓', de: 'Kostenlos', en: 'Free' },
  ];

  // Drives both the visible FAQ accordion and the FAQPage JSON-LD below —
  // keep the two in sync by editing here only.
  readonly faqs: Faq[] = [
    {
      id: 'passwords',
      q_de: 'Warum tauchen meine Passwörter nicht im Verlauf auf?',
      q_en: "Why don't my passwords show up in history?",
      a_de: 'Das ist Absicht. MojoClipboard überspringt automatisch Kopien aus Passwort-Managern und als flüchtig markierte Inhalte. Solche Einträge landen gar nicht erst im Verlauf.',
      a_en: 'That is by design. MojoClipboard automatically skips copies from password managers and items marked as transient. Such entries never enter the history in the first place.',
    },
    {
      id: 'images-files',
      q_de: 'Funktioniert es mit Bildern und Dateien?',
      q_en: 'Does it work with images and files?',
      a_de: 'Ja. Neben Text merkt sich MojoClipboard auch Bilder und Dateien. Du wählst sie genauso im Verlauf aus und fügst sie mit ⌘V wieder ein.',
      a_en: 'Yes. Alongside text, MojoClipboard also remembers images and files. You pick them from the history the same way and paste them back with ⌘V.',
    },
    {
      id: 'storage',
      q_de: 'Wo wird mein Verlauf gespeichert?',
      q_en: 'Where is my history stored?',
      a_de: 'Nur im Arbeitsspeicher. Nichts wird auf die Festplatte geschrieben, und der Verlauf wird gelöscht, sobald du die App beendest.',
      a_en: 'In memory only. Nothing is written to disk, and the history clears as soon as you quit the app.',
    },
    {
      id: 'settings',
      q_de: 'Wie ändere ich das Tastenkürzel oder die Verlaufslänge?',
      q_en: 'How do I change the shortcut or history length?',
      a_de: 'Klick auf das MojoClipboard-Symbol in der Menüleiste und öffne die Einstellungen. Dort passt du das Tastenkürzel, die Verlaufslänge und das Größenlimit pro Eintrag an und aktivierst bei Bedarf „Beim Anmelden starten“.',
      a_en: 'Click the MojoClipboard icon in the menu bar and open the settings. There you can change the shortcut, the history length and the per-item size limit, and turn on “Launch at Login” if you like.',
    },
    {
      id: 'requirements',
      q_de: 'Welche macOS-Version brauche ich?',
      q_en: 'Which macOS version do I need?',
      a_de: 'macOS 14 (Sonoma) oder neuer.',
      a_en: 'macOS 14 (Sonoma) or later.',
    },
    {
      id: 'price',
      q_de: 'Was kostet MojoClipboard?',
      q_en: 'How much does MojoClipboard cost?',
      a_de: 'Nichts. MojoClipboard ist kostenlos.',
      a_en: 'Nothing. MojoClipboard is free.',
    },
  ];

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const base = isEn ? `${ORIGIN}/en` : ORIGIN;
    const pageUrl = `${base}${PAGE_PATH}`;
    const pageTitle = this.t(PAGE_TITLE_DE, PAGE_TITLE_EN);
    const pageDescription = this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN);

    this.seo.setPageSeo({
      title: pageTitle,
      description: pageDescription,
      path: PAGE_PATH,
      type: 'article',
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': `${pageUrl}#app`,
          name: 'MojoClipboard',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'macOS 14 Sonoma or later',
          description: pageDescription,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          publisher: { '@id': 'https://farewell.salon/#organization' },
          url: pageUrl,
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          inLanguage: isEn ? 'en' : 'de',
          mainEntity: this.faqs.map(f => ({
            '@type': 'Question',
            name: this.t(f.q_de, f.q_en),
            acceptedAnswer: { '@type': 'Answer', text: this.t(f.a_de, f.a_en) },
          })),
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description: pageDescription,
          inLanguage: isEn ? 'en' : 'de',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: base },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('MojoClipboard Support', 'MojoClipboard support'),
              item: pageUrl,
            },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
