import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from 'src/services/consent.service';
import { LanguageService } from 'src/services/language.service';

/**
 * Consent-Banner (Emerald Immersive).
 *
 * Ebene 1 zeigt beide Entscheidungen sofort und gleichwertig: "Alle
 * akzeptieren" und "Alle ablehnen" sind gleich groß, gleich schwer und
 * nebeneinander. Das VG Hannover (19.03.2025, 10 A 5385/22) hat eine
 * zweistufige Gestaltung, die zur Zustimmung lenkt, als unfreiwillig und
 * damit unwirksam bewertet – deshalb liegt "Ablehnen" nicht hinter
 * "Einstellungen".
 *
 * Die Schalter starten bewusst auf "aus": Vorbelegung wäre keine aktive
 * Einwilligung (§ 25 Abs. 1 TDDDG, Art. 4 Nr. 11 DSGVO).
 */
@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  private readonly consent = inject(ConsentService);
  private readonly language = inject(LanguageService);

  /** Sichtbar, solange keine Entscheidung gespeichert ist. */
  readonly visible = this.consent.bannerVisible;

  /** Ebene 2: die einzelnen Kategorien. */
  readonly detailsOpen = signal(false);

  readonly analytics = signal(false);
  readonly ads = signal(false);

  constructor() {
    // Beim Öffnen den gespeicherten Stand spiegeln. Wer über den Footer
    // zurückkommt, sieht seine bisherige Wahl statt zweier leerer Schalter –
    // und landet direkt auf Ebene 2, weil er genau dorthin wollte.
    effect(() => {
      if (!this.visible()) {
        return;
      }
      const stored = this.consent.state();
      this.analytics.set(stored?.an ?? false);
      this.ads.set(stored?.ad ?? false);
      this.detailsOpen.set(stored !== null);
    });
  }

  /** Interner Link in der aktiven Sprache (auf /en/-Seiten mit /en-Präfix). */
  p(path: string): string {
    return this.language.localizePath(path);
  }

  toggleDetails(): void {
    this.detailsOpen.update((open) => !open);
  }

  acceptAll(): void {
    this.consent.acceptAll();
  }

  rejectAll(): void {
    this.consent.rejectAll();
  }

  saveSelection(): void {
    this.consent.save(this.analytics(), this.ads());
  }
}
