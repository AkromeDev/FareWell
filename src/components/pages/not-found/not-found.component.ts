import { Component, OnInit, inject } from '@angular/core';
import { ImageHeroComponent } from '../../molecules/image-hero/image-hero.component';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';


@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [ImageHeroComponent],
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {

  readonly lang = inject(LanguageService);
  private readonly seo = inject(SeoService);

  constructor() { }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t('Seite nicht gefunden | FareWell Nürnberg', 'Page not found | FareWell Nuremberg'),
      description: this.t(
        'Diese Seite existiert nicht (mehr). Zur Startseite von FareWell Nürnberg.',
        'This page does not exist (anymore). Back to the FareWell Nuremberg home page.'
      ),
      path: '/not-found',
      noindex: true,
      alternates: false,
    });
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

}
