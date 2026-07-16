import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { EpilationHistoryComponent } from "src/components/atoms/epilation-history/epilation-history.component";
import { LanguageService } from 'src/services/language.service';

@Component({
    selector: 'app-historie',
    standalone: true,
    imports: [CommonModule, ImageHeroComponent, EpilationHistoryComponent],
    templateUrl: './historie.component.html',
    styleUrls: ['./historie.component.scss']
})
export class HistorieComponent implements OnInit {

  readonly lang = inject(LanguageService);

  constructor() { }

  ngOnInit(): void {
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  get paragraphText(): string {
    return this.t(
      'Viele denken, dauerhafte Haarentfernung sei neu, doch die Elektrolyse gibt es schon seit über einem Jahrhundert. Ihre beeindruckende Geschichte zeigt, wie bewährt und wirkungsvoll sie wirklich ist.',
      'Many people think lasting hair removal is new, yet electrolysis has been around for over a century. Its remarkable history shows just how proven and effective it really is.'
    );
  }

}
