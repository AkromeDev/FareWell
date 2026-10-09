import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GUIDE_COMPONENTS,
  type GuideStat,
  type GuideTocItem,
} from 'src/components/molecules/guide';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import { GASTRO_ROAD, GASTRO_STAND } from './gastro-road.data';
import { ROAD, type Bi } from './road.model';
import { RoadStateService } from './road-state.service';
import { RoadChecklistComponent } from './road-checklist.component';

const PAGE_PATH = '/karriere/freelancer-road/gastro';

/**
 * Gastro Road: die Freelancer Road, umgebaut für alle, die ein Restaurant
 * eröffnen oder Kochkurse geben wollen. Kein FareWell-Bezug, deshalb ohne
 * Logo, ohne Deal und ohne „Das übernimmt FareWell"; Joés Erfahrungen stehen
 * nur dort, wo sie aus seiner eigenen Gründung übertragbar sind.
 *
 * Bewusst noindex und nirgends verlinkt: eine Gastro-Checkliste gehört nicht
 * in das Suchprofil eines Kosmetikstudios. Wer sie braucht, bekommt den Link.
 *
 * Inhalt in gastro-road.data.ts, Checkliste und Speicher sind dieselben wie
 * auf der Freelancer Road (RoadChecklistComponent, RoadStateService), nur mit
 * eigenem Speicherschlüssel.
 */
@Component({
  standalone: true,
  selector: 'app-gastro-road',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RoadChecklistComponent],
  providers: [{ provide: ROAD, useValue: GASTRO_ROAD }, RoadStateService],
  templateUrl: './gastro-road.component.html',
  styleUrls: ['./freelancer-road.shared.scss'],
})
export class GastroRoadComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly state = inject(RoadStateService);

  readonly stand = GASTRO_STAND;

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
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
        value: prof ? prof.icon : '🍳',
        label: prof ? this.bi(prof.label) : this.t('beides angezeigt', 'both shown'),
        animate: false,
        srText: prof
          ? this.t(`Gewähltes Vorhaben: ${prof.label.de}`, `Chosen plan: ${prof.label.en}`)
          : this.t(
              'Noch nichts gewählt, Schritte für Restaurant und Kochkurse werden angezeigt.',
              'Nothing chosen yet, steps for both restaurant and cooking classes are shown.',
            ),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: GASTRO_ROAD.copy.choiceId, label: this.bi(GASTRO_ROAD.copy.choiceHeading) },
      ...GASTRO_ROAD.phases.map((phase) => ({ id: phase.id, label: this.bi(phase.title) })),
    ];
  }

  ngOnInit(): void {
    const title = this.t(
      'Gastro Road: Restaurant oder Kochkurse eröffnen, alle Schritte | FareWell Nürnberg',
      'Gastro Road: Opening a Restaurant or Cooking Classes, Every Step | FareWell Nuremberg',
    );
    const description = this.t(
      'Die abhakbare Checkliste für alle, die in Nürnberg ein Restaurant eröffnen oder Kochkurse geben wollen: Hygiene und Lebensmittelkontrolle, Gaststättenerlaubnis, Finanzamt und Kasse, Versicherung. Mit Nummern und Adressen. Dein Stand bleibt in deinem Browser.',
      'The tick-off checklist for anyone opening a restaurant or teaching cooking classes in Nuremberg: hygiene and food inspections, restaurant licence, tax office and till, insurance. With phone numbers and addresses. Your progress stays in your browser.',
    );
    this.seo.setPageSeo({ title, description, path: PAGE_PATH, noindex: true });

    if (this.isBrowser) {
      this.state.load();
    }
  }
}
