import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from 'src/services/seo.service';

@Component({
  standalone: true,
  selector: 'app-agb',
  imports: [],
  templateUrl: './agb.component.html',
  styleUrl: './agb.component.scss'
})
export class AgbComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: 'AGB | FareWell Nürnberg',
      description: 'Allgemeine Geschäftsbedingungen von FareWell Nürnberg.',
      path: '/agb',
    });
  }
}
