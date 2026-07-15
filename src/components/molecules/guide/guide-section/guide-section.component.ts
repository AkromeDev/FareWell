import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Nummerierter Inhaltsabschnitt („01 · Überschrift" mit Trennlinie).
 * Der Abschnittsinhalt wird projiziert; `sectionId` dient als Anker für das
 * Inhaltsverzeichnis.
 */
@Component({
  selector: 'app-guide-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section class="gd-section" [attr.id]="sectionId || null">
      <div class="gd-sec-head" appReveal>
        <span class="gd-sec-ix" aria-hidden="true">{{ index }}</span>
        <h2>{{ heading }}</h2>
      </div>
      <ng-content />
    </section>
  `,
})
export class GuideSectionComponent {
  @Input({ required: true }) index!: string;
  @Input({ required: true }) heading!: string;
  @Input() sectionId = '';
}
