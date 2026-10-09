import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
  type GuideTocItem,
} from 'src/components/molecules/guide';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import { FREELANCER_ROAD, PHASES, ROAD_STAND } from './freelancer-road.data';
import { ROAD, type Bi } from './road.model';
import { RoadStateService } from './road-state.service';
import { RoadChecklistComponent } from './road-checklist.component';

const PAGE_PATH = '/karriere/freelancer-road/schritte';
const LANDING_PATH = '/karriere/freelancer-road';
const ORIGIN = 'https://farewell.salon';

/**
 * Freelancer Road, Schritte-Seite: die interaktive Checkliste. Berufswahl,
 * Häkchen mit Datum und Notizen je Schritt, alles über RoadStateService im
 * Browser gespeichert; Export und Import als JSON-Datei, weil gelöschte
 * Website-Daten den Stand mitnehmen.
 *
 * Die Checkliste selbst ist RoadChecklistComponent (dieselbe wie auf der
 * Gastro Road); diese Seite liefert Hero, Intro und Abschluss und stellt
 * ROAD und RoadStateService für die Freelancer Road bereit.
 */
@Component({
  standalone: true,
  selector: 'app-freelancer-road-schritte',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink, RoadChecklistComponent],
  providers: [{ provide: ROAD, useValue: FREELANCER_ROAD }, RoadStateService],
  templateUrl: './freelancer-road-schritte.component.html',
  styleUrls: ['./freelancer-road.shared.scss'],
})
export class FreelancerRoadSchritteComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'freelancer-road-schritte-schema';
  readonly state = inject(RoadStateService);

  readonly stand = ROAD_STAND;
  readonly landingPath = LANDING_PATH;

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  bi(text: Bi): string {
    return this.language.t(text.de, text.en);
  }

  get stats(): GuideStat[] {
    const total = this.state.visibleSteps().length;
    const done = this.state.visibleDone();
    const prof = this.state.professionInfo();
    return [
      { value: String(total), label: this.t('Schritte für dich', 'steps for you'), animate: false },
      { value: String(done), label: this.t('erledigt', 'done'), animate: false },
      { value: `${this.state.percent()}%`, label: this.t('geschafft', 'complete'), animate: false },
      {
        value: prof ? prof.icon : this.t('alle', 'all'),
        label: prof ? this.bi(prof.label) : this.t('Berufe angezeigt', 'professions shown'),
        animate: false,
        srText: prof
          ? this.t(`Gewählter Beruf: ${prof.label.de}`, `Chosen profession: ${prof.label.en}`)
          : this.t('Noch kein Beruf gewählt, alle Schritte werden angezeigt.', 'No profession chosen yet, all steps are shown.'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: FREELANCER_ROAD.copy.choiceId, label: this.bi(FREELANCER_ROAD.copy.choiceHeading) },
      ...PHASES.map((phase) => ({ id: phase.id, label: this.bi(phase.title) })),
    ];
  }

  ngOnInit(): void {
    const prefix = this.language.prefix();
    const title = this.t(
      'Freelancer Road: alle Schritte als Checkliste | FareWell Nürnberg',
      'Freelancer Road: Every Step as a Checklist | FareWell Nuremberg',
    );
    const description = this.t(
      'Die abhakbare Checkliste in die Selbständigkeit bei FareWell Nürnberg: Gewerbe oder freier Beruf, Finanzamt, Kammer, Berufsgenossenschaft, Versicherung, Google-Profil, Website und Marketing. Mit Nummern, Adressen und Joés Erfahrungen. Dein Stand bleibt in deinem Browser.',
      'The tick-off checklist into self-employment at FareWell Nuremberg: trade or liberal profession, tax office, chamber, accident insurer, insurance, Google profile, website and marketing. With phone numbers, addresses and Joé\'s experience. Your progress stays in your browser.',
    );
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const homeUrl = `${ORIGIN}${prefix}`;

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
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: this.t('Karriere', 'Careers'), item: `${ORIGIN}${prefix}/karriere` },
            { '@type': 'ListItem', position: 3, name: 'Freelancer Road', item: `${ORIGIN}${prefix}${LANDING_PATH}` },
            { '@type': 'ListItem', position: 4, name: this.t('Schritte', 'Steps'), item: pageUrl },
          ],
        },
      ],
    });

    if (this.isBrowser) {
      this.state.load();
    }
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
