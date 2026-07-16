import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from 'src/services/seo.service';

@Component({
  standalone: true,
  selector: 'app-datenschutz',
  imports: [],
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss'
})
export class DatenschutzComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: 'Datenschutzerklärung | FareWell Nürnberg',
      description: 'Datenschutzerklärung von FareWell Nürnberg.',
      path: '/datenschutz',
    });
  }
}
