import { Component, inject } from '@angular/core';
import { PHONE_HREF, PHONE_LABEL, SALON_MAIL } from 'src/components/pages/promotions/promotion-page.model';
import { ConsentService } from 'src/services/consent.service';
import { LanguageService } from 'src/services/language.service';

/**
 * Der Footer einer eigenständigen Anzeigenseite (src/app/domain/ad-pages.ts):
 * Adresse, Kontakt, Impressum, Datenschutz und die Cookie-Einstellungen, als
 * gewöhnliche Links. Kein Link in die übrige Website.
 *
 * Auf der ausgelieferten Seite läuft Angular nicht: dort öffnet
 * src/assets/ad/ad-page.js die Cookie-Einstellungen (data-consent="open") und
 * zählt den Klick auf die Telefonnummer (data-ad-click).
 */
@Component({
  selector: 'app-ad-footer',
  standalone: true,
  templateUrl: './ad-footer.component.html',
  styleUrl: './ad-footer.component.scss',
})
export class AdFooterComponent {
  private readonly language = inject(LanguageService);
  private readonly consent = inject(ConsentService);

  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly mailHref = `mailto:${SALON_MAIL}`;
  readonly mailLabel = SALON_MAIL;

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  /** Art. 7 Abs. 3 DSGVO: Widerruf muss so einfach sein wie die Erteilung. */
  openConsentSettings(): void {
    this.consent.reopen();
  }
}
