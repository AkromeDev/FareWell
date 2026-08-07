import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import {
  KARRIERE_EMAIL,
  KARRIERE_INSTAGRAM,
  KARRIERE_PHONE,
} from 'src/components/pages/karriere/shared/karriere-content';

/**
 * Abschluss-Karte aller Karriere-Seiten: Bewerbung per Mail, Kontaktdaten und
 * Instagram. Optik wie der Guide-CTA (.gd-cta), aber mit mailto statt
 * Terminbuchung. Der Betreff wird pro Beruf gesetzt:
 *
 *   <app-karriere-apply [subject]="'Bewerbung als Kosmetiker:in bei FareWell'">
 *     Freitext …
 *   </app-karriere-apply>
 */
@Component({
  selector: 'app-karriere-apply',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div class="gd-cta" [attr.id]="sectionId || null" appReveal>
      <h2>{{ heading }}</h2>
      <p><ng-content /></p>

      <div class="gd-cta__actions">
        <a class="gd-btn" [href]="mailHref">{{ mailLabel }}</a>
        <a
          class="gd-btn gd-btn--ghost"
          [href]="instagram"
          target="_blank"
          rel="noopener noreferrer"
          >Instagram</a
        >
      </div>

      <p class="gd-cta__tagline">Für immer sanft.</p>

      <p class="gd-fine">
        FareWell · Frauentorgraben 5 · 90443 Nürnberg<br />
        {{ email }} · {{ phone }}
      </p>
    </div>
  `,
})
export class KarriereApplyComponent {
  /** Betreff der Bewerbungs-Mail, unkodiert. */
  @Input({ required: true }) subject!: string;
  /** Anker-id, damit Karten von der Hub-Seite hierher springen können. */
  @Input() sectionId = 'bewerben';
  @Input() headingOverride = '';

  readonly email = KARRIERE_EMAIL;
  readonly phone = KARRIERE_PHONE;
  readonly instagram = KARRIERE_INSTAGRAM;

  private readonly language = inject(LanguageService);

  get heading(): string {
    return (
      this.headingOverride ||
      this.language.t('Erzähl uns von deiner Idee', 'Tell us about your idea')
    );
  }

  get mailLabel(): string {
    return this.language.t('Jetzt bewerben', 'Apply now');
  }

  get mailHref(): string {
    return `mailto:${KARRIERE_EMAIL}?subject=${encodeURIComponent(this.subject)}`;
  }
}
