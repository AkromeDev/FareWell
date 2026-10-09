import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
  type GuideTocItem,
} from 'src/components/molecules/guide';
import { KARRIERE_COMPONENTS } from 'src/components/molecules/karriere';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import { ALL_STEPS, PHASES, ROAD_STAND } from './freelancer-road.data';

const PAGE_PATH = '/karriere/freelancer-road';
const STEPS_PATH = '/karriere/freelancer-road/schritte';
const ORIGIN = 'https://farewell.salon';

/**
 * Freelancer Road, Einstiegsseite: warum es sie gibt, was Selbständige bei
 * FareWell bekommen und behalten, was Joé mitbringt, was FareWell davon hat,
 * und wie die interaktive Schritte-Seite funktioniert (inklusive des
 * Hinweises, dass der Fortschritt nur im Browser liegt).
 *
 * Die Schritte selbst leben in freelancer-road-schritte.component; beide
 * Seiten teilen sich freelancer-road.data.ts.
 */
@Component({
  standalone: true,
  selector: 'app-freelancer-road',
  imports: [...GUIDE_COMPONENTS, ...KARRIERE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './freelancer-road.component.html',
  styleUrls: ['./freelancer-road.shared.scss'],
})
export class FreelancerRoadComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'freelancer-road-schema';

  readonly phases = PHASES;
  readonly stand = ROAD_STAND;
  readonly stepsPath = STEPS_PATH;

  get lang(): Lang {
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
      { value: String(PHASES.length), label: this.t('Etappen', 'stages') },
      { value: String(ALL_STEPS.length), label: this.t('Schritte, jeder erklärt', 'steps, each explained') },
      { value: '100%', label: this.t('gehört dir', 'belongs to you') },
      {
        value: '0',
        label: this.t('Daten, die uns erreichen', 'data that reaches us'),
        srText: this.t(
          'Null Daten erreichen uns: Dein Fortschritt bleibt in deinem Browser.',
          'Zero data reaches us: your progress stays in your browser.',
        ),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'warum', label: this.t('Warum es diese Seite gibt', 'Why this page exists') },
      { id: 'deal', label: this.t('Dein Deal bei FareWell', 'Your deal at FareWell') },
      { id: 'deins', label: this.t('Alles, was entsteht, gehört dir', 'Everything created is yours') },
      { id: 'joe', label: this.t('Was ich mitbringe', 'What I bring') },
      { id: 'farewell', label: this.t('Was FareWell davon hat', 'What FareWell gets out of it') },
      { id: 'road', label: this.t('So funktioniert die Road', 'How the road works') },
      { id: 'bewerben', label: this.t('Loslegen', 'Get started') },
    ];
  }

  ngOnInit(): void {
    const prefix = this.language.prefix();
    const title = this.t(
      'Freelancer Road: der Weg in die Selbständigkeit bei FareWell Nürnberg',
      'Freelancer Road: The Path into Self-Employment at FareWell Nuremberg',
    );
    const description = this.t(
      'Alle Schritte in die Selbständigkeit als Kosmetiker:in, Masseur:in, Physio, Yoga-Lehrer:in oder Ärzt:in bei FareWell Nürnberg, in der richtigen Reihenfolge: Ämter, Nummern, Versicherungen, Website, Google-Profil und Marketing. Aus Joés eigener Gründung, mit abhakbarer Checkliste.',
      'Every step into self-employment as a beautician, massage therapist, physio, yoga teacher or physician at FareWell Nuremberg, in the right order: offices, phone numbers, insurance, website, Google profile and marketing. From Joé\'s own founding, with a checklist you can tick off.',
    );
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const homeUrl = `${ORIGIN}${prefix}`;
    const karriereUrl = `${ORIGIN}${prefix}/karriere`;

    this.seo.setPageSeo({ title, description, path: PAGE_PATH });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: this.language.lang(),
          isPartOf: { '@id': `${ORIGIN}/#website` },
          author: { '@type': 'Person', name: 'Joé Chatelain' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: this.t('Karriere', 'Careers'), item: karriereUrl },
            { '@type': 'ListItem', position: 3, name: 'Freelancer Road', item: pageUrl },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
