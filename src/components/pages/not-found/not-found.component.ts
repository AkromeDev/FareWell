import { Component, OnInit, inject } from '@angular/core';
import { ImageHeroComponent } from '../../molecules/image-hero/image-hero.component';
import { LanguageService } from 'src/services/language.service';


@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [ImageHeroComponent],
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {

  readonly lang = inject(LanguageService);

  constructor() { }

  ngOnInit(): void {
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

}
