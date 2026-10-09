import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Lang, LanguageService } from 'src/services/language.service';

export type GuideLang = Lang;

interface MoreLang {
  code: Exclude<Lang, 'de' | 'en'>;
  /** Name der Sprache in ihr selbst. */
  label: string;
  /** Kürzel auf dem Pfeil-Knopf, solange die Sprache aktiv ist. */
  short: string;
}

/**
 * Sprachumschalter im Header: DE und EN als Knöpfe, dahinter ein Pfeil für
 * weitere Sprachen (zuerst Ukrainisch). Die weiteren Sprachen sind echte
 * Links auf die Gegenstück-URL: sie laden die vorgerenderte Seite neu und
 * sind für Suchmaschinen auffindbar.
 *
 *   <app-guide-lang-toggle [lang]="lang.lang()" (langChange)="lang.setLang($event)" />
 */
@Component({
  selector: 'app-guide-lang-toggle',
  standalone: true,
  template: `
    <div class="lang-switch">
      <div class="gd-lang-switch" role="group" aria-label="Sprache / Language / Мова">
        <button type="button" lang="de" [attr.aria-pressed]="lang === 'de'" (click)="set('de')">DE</button>
        <button type="button" lang="en" [attr.aria-pressed]="lang === 'en'" (click)="set('en')">EN</button>
        <button
          type="button"
          class="lang-more"
          [class.is-active]="!!activeMore"
          [attr.aria-expanded]="open"
          aria-controls="lang-more-menu"
          [attr.aria-label]="moreLabel"
          (click)="toggleMenu()"
        >
          @if (activeMore) {
            <span class="lang-more__code" [attr.lang]="activeMore.code">{{ activeMore.short }}</span>
          }
          <svg class="lang-more__chevron" viewBox="0 0 10 6" aria-hidden="true" focusable="false">
            <path d="M1 1l4 4 4-4" />
          </svg>
        </button>
      </div>
      <ul id="lang-more-menu" class="lang-menu" [hidden]="!open" [style.right.px]="menuRight">
        @for (more of moreLangs; track more.code) {
          <li>
            <a
              [href]="hrefFor(more.code)"
              [attr.hreflang]="more.code"
              [attr.lang]="more.code"
              [attr.aria-current]="lang === more.code ? 'true' : null"
              (click)="closeMenu()"
              >{{ more.label }}</a
            >
          </li>
        }
      </ul>
    </div>
  `,
})
export class GuideLangToggleComponent {
  @Input() lang: GuideLang = 'de';
  @Output() langChange = new EventEmitter<GuideLang>();

  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  readonly moreLangs: readonly MoreLang[] = [{ code: 'uk', label: 'Українська', short: 'УКР' }];

  open = false;
  /** Breite Leiste: Abstand der fixierten Liste zum rechten Rand, bündig mit dem Pfeil. */
  menuRight: number | null = null;

  get activeMore(): MoreLang | undefined {
    return this.moreLangs.find((more) => more.code === this.lang);
  }

  get moreLabel(): string {
    const more = this.language.t('Weitere Sprachen', 'More languages');
    return this.activeMore ? `${this.activeMore.label}, ${more}` : more;
  }

  set(lang: GuideLang): void {
    this.open = false;
    if (lang !== this.lang) {
      this.lang = lang;
      this.langChange.emit(lang);
    }
  }

  toggleMenu(): void {
    this.open = !this.open;
    this.menuRight = this.open ? this.measureMenuRight() : null;
  }

  /**
   * Auf der breiten Leiste hängt die Liste fixed an der .nav-bar (siehe
   * styles.scss) und soll rechtsbündig unter dem Pfeil sitzen. Im Burger-Menü
   * fließt sie normal mit, dort null.
   */
  private measureMenuRight(): number | null {
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view?.matchMedia('(min-width: 1261px)').matches) return null;
    const button = this.host.nativeElement.querySelector('.lang-more');
    if (!button) return null;
    const viewportWidth = view.document.documentElement.clientWidth;
    return Math.max(8, Math.round(viewportWidth - button.getBoundingClientRect().right));
  }

  /** Nicht schließen: mobil feuert resize schon beim Ein- und Ausblenden der Adressleiste. */
  @HostListener('window:resize')
  onResize(): void {
    if (this.open) this.menuRight = this.measureMenuRight();
  }

  /**
   * Als Methode, nicht als (click)="open = false": Angular wertet ein
   * Handler-Ergebnis false als preventDefault(), und der Link führe nirgendwohin.
   */
  closeMenu(): void {
    this.open = false;
  }

  /** Dieselbe Seite in der gewählten Sprache, sonst deren Startseite. */
  hrefFor(lang: Lang): string {
    const current = this.router.url.split('?')[0].split('#')[0] || '/';
    return this.language.counterpartPath(current, lang) ?? `/${lang}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  /** Schließt nur das Sprachmenü, nicht gleich das ganze Burger-Menü. */
  @HostListener('keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!this.open) return;
    event.stopPropagation();
    this.open = false;
    this.host.nativeElement.querySelector<HTMLButtonElement>('.lang-more')?.focus();
  }
}
