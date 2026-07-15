import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Dunkelgrünes Angebots-Banner („20% LEBENSLANG") mit optionalem Badge für
 * einen Promo-Code oder eine Kurzanweisung.
 */
@Component({
  selector: 'app-guide-offer',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div class="gd-offer" appReveal>
      <div>
        <p class="gd-offer__eyebrow">{{ eyebrow }}</p>
        <p class="gd-offer__headline">{{ headline }}</p>
        @if (sub) {
          <p class="gd-offer__sub">{{ sub }}</p>
        }
      </div>
      @if (badgeValue) {
        <div class="gd-offer__badge">
          <span class="gd-offer__badge-label">{{ badgeLabel }}</span>
          <span class="gd-offer__badge-value">{{ badgeValue }}</span>
        </div>
      }
    </div>
  `,
})
export class GuideOfferComponent {
  @Input({ required: true }) eyebrow!: string;
  @Input({ required: true }) headline!: string;
  @Input() sub = '';
  @Input() badgeLabel = '';
  @Input() badgeValue = '';
}
