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
        <a class="gd-btn" [href]="mailHref" [attr.aria-label]="mailAria">{{ mailLabel }}</a>
        <a
          class="gd-btn gd-btn--ghost"
          [href]="instagram"
          target="_blank"
          rel="noopener noreferrer"
          [attr.aria-label]="instagramAria"
          >Instagram</a
        >
      </div>

      <p class="gd-cta__tagline">Für immer sanft.</p>

      <!-- E-Mail und Telefon als echte Links: Wer den mailto-Knopf nicht nutzen
           kann (kein Mailprogramm eingerichtet), braucht einen zweiten Weg, und
           die Rufnummer muss wählbar und Ziffer für Ziffer vorlesbar sein. -->
      <p class="gd-fine ka-contact">
        FareWell · Frauentorgraben 5 · 90443 Nürnberg<br />
        <a [href]="'mailto:' + email" [attr.aria-label]="emailAria">{{ email }}</a> ·
        <a [href]="phoneHref" [attr.aria-label]="phoneAria">{{ phone }}</a>
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

  /** Sagt vorab, dass sich ein Mailprogramm öffnet — sonst ist der Sprung aus
   *  der Seite heraus für Screenreader-Nutzende eine Überraschung. */
  get mailAria(): string {
    return this.language.t(
      `${this.mailLabel}: öffnet dein E-Mail-Programm mit einer Nachricht an ${KARRIERE_EMAIL}, Betreff „${this.subject}“`,
      `${this.mailLabel}: opens your email app with a message to ${KARRIERE_EMAIL}, subject “${this.subject}”`
    );
  }

  get instagramAria(): string {
    return this.language.t(
      'Instagram: FareWell auf Instagram, öffnet in einem neuen Tab',
      'Instagram: FareWell on Instagram, opens in a new tab'
    );
  }

  get emailAria(): string {
    return this.language.t(
      `E-Mail an ${KARRIERE_EMAIL} schreiben`,
      `Write an email to ${KARRIERE_EMAIL}`
    );
  }

  /** tel:-Ziel ohne Leerzeichen — mit Leerzeichen wählt kein Telefon. */
  get phoneHref(): string {
    return `tel:${KARRIERE_PHONE.replace(/\s/g, '')}`;
  }

  /**
   * Der sichtbare Text muss wörtlich im Namen vorkommen, sonst kann eine
   * Sprachsteuerung den Link nicht auslösen (WCAG 2.5.3 Label in Name).
   * Deshalb die Nummer genau wie angezeigt, plus ein Verb als Hinweis —
   * nicht die früher hier stehende Ziffernfolge, die den sichtbaren Text
   * ersetzt hätte.
   */
  get phoneAria(): string {
    return this.language.t(`${KARRIERE_PHONE} anrufen`, `Call ${KARRIERE_PHONE}`);
  }
}
