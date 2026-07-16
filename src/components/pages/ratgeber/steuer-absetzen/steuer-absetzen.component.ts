import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const ORIGIN = 'https://farewell.salon';
const PAGE_PATH = '/ratgeber/haarentfernung-steuer-absetzen';
const PAGE_TITLE_DE =
  'Haarentfernung von der Steuer absetzen: Leitfaden für trans Personen | FareWell Nürnberg';
const PAGE_TITLE_EN = 'Deducting Hair Removal Costs from German Tax: a Guide | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Laser und Nadelepilation als außergewöhnliche Belastung absetzen: welche Nachweise das Finanzamt verlangt, wie du vorgehst und was FareWell dir dafür ausstellt.';
const PAGE_DESCRIPTION_EN =
  'How to deduct laser and electrolysis costs as an extraordinary burden on your German tax return: required proof, the step-by-step process, and the documents FareWell provides.';

@Component({
  standalone: true,
  selector: 'app-steuer-absetzen',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './steuer-absetzen.component.html',
})
export class SteuerAbsetzenComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'steuer-absetzen-schema';

  get lang(): GuideLang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      { value: '3', label: this.t('Bausteine für den Nachweis', 'Building blocks for your proof') },
      {
        value: '1–7%',
        label: this.t('Zumutbare Belastung vom Einkommen', 'Reasonable burden, share of income'),
        animate: false,
      },
      { value: '2', label: this.t('Methoden, steuerlich gleichgestellt', 'Methods, equal for tax') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'anerkannt', label: this.t('Warum das steuerlich anerkannt ist', 'Why the tax office recognises this') },
      { id: 'verwechselt', label: this.t('Zwei Dinge, die oft verwechselt werden', 'Two things people often confuse') },
      { id: 'nachweise', label: this.t('Welche Nachweise du brauchst', 'Which proof you need') },
      { id: 'vorgehen', label: this.t('So gehst du vor', 'How to go about it') },
      { id: 'rechenbeispiel', label: this.t('Rechenbeispiel', 'Worked example') },
      { id: 'weiterlesen', label: this.t('Weiterlesen', 'Read on') },
    ];
  }

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
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          headline: this.t(
            'Behandlungskosten steuerlich absetzen',
            'Deducting treatment costs from your taxes'
          ),
          description: pageDescription,
          inLanguage: isEn ? 'en' : 'de',
          datePublished: '2026-07-15',
          dateModified: '2026-07-15',
          image: ['https://farewell.salon/assets/images/farewell/studio.webp'],
          author: { '@id': 'https://farewell.salon/#organization' },
          publisher: {
            '@type': 'BeautySalon',
            '@id': 'https://farewell.salon/#organization',
            name: 'FareWell',
            url: 'https://farewell.salon',
          },
          mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
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
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${base}/faq` },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t(
                'Behandlungskosten steuerlich absetzen',
                'Deducting treatment costs from your taxes'
              ),
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
