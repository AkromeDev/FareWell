import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';

export interface GuideTocItem {
  /** id des Ziel-Abschnitts (sectionId der app-guide-section). */
  id: string;
  label: string;
}

/**
 * Klebendes Inhaltsverzeichnis mit führenden Ordnungsnummern. Die Anker-Links
 * tragen den vollen Seitenpfad (wegen <base href="/"> würde ein nacktes
 * "#anker" zur Startseite auflösen — relevant vor der Hydration, ohne JS und
 * beim Öffnen in neuem Tab); appScrollTo übernimmt das sanfte Scrollen.
 */
@Component({
  selector: 'app-guide-toc',
  standalone: true,
  imports: [RevealOnScrollDirective, ScrollToDirective],
  template: `
    <nav class="gd-toc" [attr.aria-label]="label" appReveal="left">
      <div class="gd-toc__label">{{ label }}</div>
      <ol>
        @for (item of items; track item.id) {
          <li>
            <a [href]="pagePath + '#' + item.id" [appScrollTo]="item.id">{{ item.label }}</a>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class GuideTocComponent {
  @Input({ required: true }) items: GuideTocItem[] = [];
  @Input() label = 'Inhalt';

  private readonly router = inject(Router);

  get pagePath(): string {
    return this.router.url.split('#')[0].split('?')[0];
  }
}
