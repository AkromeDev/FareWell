import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { EpilationHistoryComponent } from "src/components/atoms/epilation-history/epilation-history.component";
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/historie';
const PAGE_TITLE_DE = 'Die Geschichte der Elektrolyse | FareWell Nürnberg';
const PAGE_TITLE_EN = 'The History of Electrolysis | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Die Elektrolyse entfernt Haare seit über einem Jahrhundert permanent. Entdecke die Geschichte der einzigen wirklich permanenten Haarentfernungsmethode.';
const PAGE_DESCRIPTION_EN =
  'Electrolysis has been removing hair permanently for over a century. Discover the history of the only truly permanent hair removal method.';

@Component({
    selector: 'app-historie',
    standalone: true,
    imports: [CommonModule, ImageHeroComponent, EpilationHistoryComponent],
    templateUrl: './historie.component.html',
    styleUrls: ['./historie.component.scss']
})
export class HistorieComponent implements OnInit {

  readonly lang = inject(LanguageService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(PAGE_TITLE_DE, PAGE_TITLE_EN),
      description: this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN),
      path: PAGE_PATH,
    });
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  /** Interner Link in der aktiven Sprache (auf /en/-Seiten das englische Gegenstück). */
  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      'Viele denken, dauerhafte Haarentfernung sei neu, doch die Elektrolyse gibt es schon seit über einem Jahrhundert. Ihre beeindruckende Geschichte zeigt, wie bewährt und wirkungsvoll sie wirklich ist.',
      'Many people think lasting hair removal is new, yet electrolysis has been around for over a century. Its remarkable history shows just how proven and effective it really is.'
    );
  }

}
