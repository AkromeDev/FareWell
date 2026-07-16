import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from 'src/services/seo.service';

@Component({
  standalone: true,
  selector: 'app-impressum',
  imports: [],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
export class ImpressumComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: 'Impressum | FareWell Nürnberg',
      description: 'Impressum von FareWell, Beauty Studio in Nürnberg.',
      path: '/impressum',
    });
  }
}
