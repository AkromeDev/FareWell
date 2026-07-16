import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcComponent } from "src/components/timeProjection/bc/bc.component";
import { ImageTextBlockComponent } from "src/components/molecules/image-text-block/image-text-block.component";
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/zeit';
const PAGE_TITLE_DE = 'Behandlungsdauer | FareWell Nürnberg';
const PAGE_TITLE_EN = 'Electrolysis Treatment Time Calculator | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Informationen zur Dauer unserer Beauty Behandlungen bei FareWell Nürnberg.';
const PAGE_DESCRIPTION_EN =
  'How long does permanent hair removal take? Calculate your personal electrolysis treatment time per body area at FareWell Nuremberg.';

@Component({
    selector: 'app-zeit',
    standalone: true,
    imports: [CommonModule, BcComponent, ImageTextBlockComponent],
    templateUrl: './zeit.component.html',
    styleUrls: ['./zeit.component.scss']
})
export class ZeitComponent implements OnInit {

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
}
