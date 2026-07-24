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

const PAGE_PATH = '/ratgeber/kavitation-ultraschall-fettreduktion';
const PAGE_TITLE_DE =
  'Kavitation, Ultraschall-Fettreduktion & Cellulite: der Ratgeber | FareWell Nürnberg';
const PAGE_TITLE_EN =
  'Cavitation, Ultrasound Fat Reduction & Cellulite: the Guide | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Kavitation, Ultraschall-Fettreduktion und Cellulite-Behandlung in Nürnberg: wie sie wirken, der Rhythmus als Kur (alle 2–4 Tage), Vorbereitung, Nachsorge und für wen sie nicht geeignet sind.';
const PAGE_DESCRIPTION_EN =
  'Cavitation, ultrasound fat reduction and cellulite treatment in Nuremberg: how they work, the course rhythm (every 2–4 days), preparation, aftercare and who they are not suitable for.';

@Component({
  standalone: true,
  selector: 'app-koerperbehandlungen',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './koerperbehandlungen.component.html',
})
export class KoerperbehandlungenComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'koerperbehandlungen-schema';

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
      { value: '4–8', label: this.t('Sitzungen als Kur', 'sessions as a course') },
      { value: this.t('2–4 Tage', '2–4 days'), label: this.t('Abstand pro Termin', 'between sessions') },
      {
        value: this.t('ohne OP', 'no surgery'),
        label: this.t('nicht-invasiv, keine Ausfallzeit', 'non-invasive, no downtime'),
      },
      { value: this.t('gratis', 'free'), label: this.t('Erstberatung', 'initial consultation') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'was', label: this.t('Was dahintersteckt', 'What is behind it') },
      { id: 'schwerpunkte', label: this.t('Drei Schwerpunkte', 'Three focuses') },
      { id: 'ablauf', label: this.t('Ablauf & Rhythmus', 'Process & rhythm') },
      { id: 'kontraindikationen', label: this.t('Für wen nicht geeignet', 'Who it is not for') },
      { id: 'nachsorge', label: this.t('Nachsorge', 'Aftercare') },
      { id: 'weiterlesen', label: this.t('Weiterlesen', 'Further reading') },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const title = this.t(PAGE_TITLE_DE, PAGE_TITLE_EN);
    const description = this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN);
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon';

    this.seo.setPageSeo({
      title,
      description,
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
            'Kavitation, Ultraschall-Fettreduktion & Cellulite',
            'Cavitation, ultrasound fat reduction & cellulite',
          ),
          description,
          inLanguage: isEn ? 'en' : 'de',
          datePublished: '2026-07-24',
          dateModified: '2026-07-24',
          image: ['https://farewell.salon/assets/images/treatment/kavitation3.webp'],
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
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Ratgeber', 'Guides'),
              item: `https://farewell.salon${this.p('/ratgeber')}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Körperbehandlungen', 'Body treatments'),
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
