import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { pagePath } from 'src/app/domain/ad-pages';
import { LanguageService } from 'src/services/language.service';

/**
 * Die Kopfzeile einer eigenständigen Anzeigenseite (src/app/domain/ad-pages.ts):
 * nur der Schriftzug und ein gewöhnlicher Link zur anderen Sprachfassung.
 * Kein Menü und kein Link in die übrige Website, denn die Seite läuft ohne das
 * Skript der Website und führt zu keiner Seite, die einen Wirkstoff nennt.
 */
@Component({
  selector: 'app-ad-header',
  standalone: true,
  templateUrl: './ad-header.component.html',
  styleUrl: './ad-header.component.scss',
})
export class AdHeaderComponent {
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);

  private get english(): boolean {
    return this.language.lang() === 'en';
  }

  /** Dieselbe Seite in der anderen Sprache. */
  get twinHref(): string {
    const path = pagePath(this.router.url);
    return this.english ? path : `/en${path}`;
  }

  get twinLang(): string {
    return this.english ? 'de' : 'en';
  }

  get twinLabel(): string {
    return this.english ? 'Deutsch' : 'English';
  }
}
