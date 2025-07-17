import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { EpilationHistoryComponent } from "src/components/atoms/epilation-history/epilation-history.component";

@Component({
    selector: 'app-historie',
    standalone: true,
    imports: [CommonModule, ImageHeroComponent, EpilationHistoryComponent],
    templateUrl: './historie.component.html',
    styleUrls: ['./historie.component.scss']
})
export class HistorieComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  paragraphText = 'Viele denken, dauerhafte Haarentfernung sei neu, doch die Elektrolyse gibt es schon seit über einem Jahrhundert. Ihre beeindruckende Geschichte zeigt, wie bewährt und wirkungsvoll sie wirklich ist.';

}
