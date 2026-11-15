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
import { PARTY_ROAD, PARTY_STAND } from './party4friends.data';
import { ROAD, type Bi } from '../karriere/freelancer-road/road.model';
import { RoadStateService } from '../karriere/freelancer-road/road-state.service';
import { RoadChecklistComponent } from '../karriere/freelancer-road/road-checklist.component';

const PAGE_PATH = '/party4friends';

/**
 * Party4Friends: die Regeln für Freund:innen, die im Salon feiern wollen,
 * zum Durchklicken wie die Freelancer Road (Joé, 15.11.2026). Beispiele aus
 * den bisherigen Feiern stehen anonym im Kasten „Joés Erfahrung".
 *
 * Bewusst noindex, nicht in der Sitemap und nirgends verlinkt: wer im Salon
 * feiern will, bekommt den Link von Joé.
 *
 * Inhalt in party4friends.data.ts; Checkliste und Speicher sind die der
 * Freelancer Road (RoadChecklistComponent, RoadStateService), mit eigenem
 * Speicherschlüssel.
 */
@Component({
  standalone: true,
  selector: 'app-party4friends',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RoadChecklistComponent],
  providers: [{ provide: ROAD, useValue: PARTY_ROAD }, RoadStateService],
  templateUrl: './party4friends.component.html',
  styleUrls: ['../karriere/freelancer-road/freelancer-road.shared.scss'],
})
export class Party4FriendsComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly state = inject(RoadStateService);

  readonly stand = PARTY_STAND;

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
        value: prof ? prof.icon : '🎉',
        label: prof ? this.bi(prof.label) : this.t('alles angezeigt', 'all shown'),
        animate: false,
        srText: prof
          ? this.t(`Gewählte Art der Feier: ${prof.label.de}`, `Chosen kind of party: ${prof.label.en}`)
          : this.t(
              'Noch nichts gewählt, alle Schritte werden angezeigt.',
              'Nothing chosen yet, all steps are shown.',
            ),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: PARTY_ROAD.copy.choiceId, label: this.bi(PARTY_ROAD.copy.choiceHeading) },
      ...PARTY_ROAD.phases.map((phase) => ({ id: phase.id, label: this.bi(phase.title) })),
    ];
  }

  ngOnInit(): void {
    const title = this.t(
      'Party4Friends: im Salon feiern, die Regeln | FareWell Nürnberg',
      'Party4Friends: Partying at the Salon, the Rules | FareWell Nuremberg',
    );
    const description = this.t(
      'Die Regeln für Freund:innen, die bei FareWell in Nürnberg feiern wollen, Schritt für Schritt: erst reden, Hausregeln, Organisation, Aufräumen und Bezahlung.',
      'The rules for friends who want to party at FareWell in Nuremberg, step by step: talk first, house rules, organising, cleaning up and payment.',
    );
    this.seo.setPageSeo({ title, description, path: PAGE_PATH, noindex: true });

    if (this.isBrowser) {
      this.state.load();
    }
  }
}
