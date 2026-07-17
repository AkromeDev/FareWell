import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Bild-neben-Text-Block im Guide-Look: ein gerahmtes Foto neben projiziertem
 * Inhalt (Eyebrow, Überschrift, Fließtext, Listen …). Über `side` wird das Bild
 * links oder rechts platziert — für abwechselnde Showcase-Reihen. Am Handy
 * stapelt sich alles, das Bild zuerst.
 *
 *   <app-guide-media image="assets/…" imageAlt="…" side="right"
 *                    eyebrow="45 Min · 78€" heading="Ganzkörpermassage">
 *     <p>…</p>
 *   </app-guide-media>
 */
@Component({
  selector: 'app-guide-media',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div
      class="gd-media"
      [class.gd-media--flip]="side === 'left'"
      [class.gd-media--contain]="contain"
      appReveal
    >
      <figure class="gd-media__fig">
        <img
          [src]="image"
          [alt]="imageAlt"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div class="gd-media__body">
        @if (eyebrow) {
          <p class="gd-media__eyebrow">{{ eyebrow }}</p>
        }
        @if (heading) {
          <h3 class="gd-media__head">{{ heading }}</h3>
        }
        <ng-content />
      </div>
    </div>
  `,
})
export class GuideMediaComponent {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) imageAlt!: string;
  /** Bildseite am Desktop. 'right' (Standard) oder 'left'. */
  @Input() side: 'left' | 'right' = 'right';
  @Input() eyebrow = '';
  @Input() heading = '';
  /**
   * Für Grafiken/Infografiken/Produktfotos auf hellem Hintergrund: zeigt das
   * Bild vollständig (object-fit: contain) auf einem dezenten Panel, statt es
   * wie ein Foto zu beschneiden (Standard object-fit: cover).
   */
  @Input() contain = false;
}
