import { Component, EventEmitter, Input, Output } from '@angular/core';

export type GuideLang = 'de' | 'en';

/**
 * Schwebender DE/EN-Umschalter für zweisprachige Guide-Seiten (fixiert unter
 * dem Site-Header). Die Seite hält den Zustand und bindet:
 *
 *   <app-guide-lang-toggle [(lang)]="lang" />
 */
@Component({
  selector: 'app-guide-lang-toggle',
  standalone: true,
  template: `
    <div class="gd-lang-switch" role="group" aria-label="Sprache / Language">
      <button type="button" [attr.aria-pressed]="lang === 'de'" (click)="set('de')">DE</button>
      <button type="button" [attr.aria-pressed]="lang === 'en'" (click)="set('en')">EN</button>
    </div>
  `,
})
export class GuideLangToggleComponent {
  @Input() lang: GuideLang = 'de';
  @Output() langChange = new EventEmitter<GuideLang>();

  set(lang: GuideLang): void {
    if (lang !== this.lang) {
      this.lang = lang;
      this.langChange.emit(lang);
    }
  }
}
