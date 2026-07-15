import { Component, Input } from '@angular/core';

/**
 * Einzelne FAQ-Frage als natives <details>/<summary>-Akkordeon: barrierefrei,
 * ohne JavaScript nutzbar und die Antwort bleibt für Suchmaschinen im DOM.
 * Die Antwort wird projiziert (beliebiges HTML).
 */
@Component({
  selector: 'app-faq-item',
  standalone: true,
  template: `
    <details class="gd-faq" [open]="open">
      <summary>
        <span>{{ question }}</span>
        <span class="gd-faq__marker" aria-hidden="true">+</span>
      </summary>
      <div class="gd-faq__body">
        <ng-content />
      </div>
    </details>
  `,
})
export class FaqItemComponent {
  @Input({ required: true }) question!: string;
  /** Aufgeklappt starten (z. B. erste Gruppe einer Akkordeon-Liste). */
  @Input() open = false;
}
