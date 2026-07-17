import { Component, Input, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Dunkelgrünes Angebots-Banner („20% LEBENSLANG") mit optionalem Badge für
 * einen Promo-Code.
 *
 * Die gesamte Box ist ein Klick-Ziel: ein Klick (oder Enter/Leertaste) kopiert
 * den Promo-Code in die Zwischenablage. Neben dem Code steht ein Kopier-Icon,
 * das nach dem Kopieren kurz zu einem Häkchen wechselt, begleitet von einer
 * dezenten „Kopiert!"-Rückmeldung.
 */
@Component({
  selector: 'app-guide-offer',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div
      class="gd-offer"
      [class.is-copyable]="!!badgeValue"
      [class.is-copied]="copied"
      appReveal
      [attr.role]="badgeValue ? 'button' : null"
      [attr.tabindex]="badgeValue ? 0 : null"
      [attr.aria-label]="badgeValue ? copyLabel + ': ' + badgeValue : null"
      (click)="copy()"
      (keydown.enter)="copy()"
      (keydown.space)="onSpace($event)"
    >
      <div class="gd-offer__body">
        <p class="gd-offer__eyebrow">{{ eyebrow }}</p>
        <p class="gd-offer__headline">{{ headline }}</p>
        @if (sub) {
          <p class="gd-offer__sub">{{ sub }}</p>
        }
      </div>

      @if (badgeValue) {
        <div class="gd-offer__badge">
          <span class="gd-offer__badge-label">{{ badgeLabel }}</span>
          <span class="gd-offer__badge-row">
            <span class="gd-offer__badge-value">{{ badgeValue }}</span>
            <span class="gd-offer__badge-icon" aria-hidden="true">
              <svg
                class="gd-offer__ic gd-offer__ic--copy"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="9" y="9" width="11" height="11" rx="2.5" />
                <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
              </svg>
              <svg
                class="gd-offer__ic gd-offer__ic--check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          </span>
          <span class="gd-offer__hint" aria-hidden="true">
            <span class="gd-offer__hint-default">{{ copyLabel }}</span>
            <span class="gd-offer__hint-copied">{{ copiedLabel }}</span>
          </span>
        </div>
      }

      <span class="gd-visually-hidden" role="status" aria-live="polite">
        {{ copied ? copiedLabel : '' }}
      </span>
    </div>
  `,
})
export class GuideOfferComponent implements OnDestroy {
  @Input({ required: true }) eyebrow!: string;
  @Input({ required: true }) headline!: string;
  @Input() sub = '';
  @Input() badgeLabel = '';
  @Input() badgeValue = '';
  /** Kurzhinweis / Barrierefrei-Label für die Kopier-Aktion. */
  @Input() copyLabel = 'Code kopieren';
  /** Erfolgsmeldung nach dem Kopieren. */
  @Input() copiedLabel = 'Kopiert!';

  copied = false;

  private readonly doc = inject(DOCUMENT);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  onSpace(event: Event): void {
    // Verhindert das Scrollen der Seite beim Kopieren per Leertaste.
    event.preventDefault();
    this.copy();
  }

  copy(): void {
    const code = this.badgeValue?.trim();
    if (!code) {
      return;
    }

    const win = this.doc.defaultView;
    const clipboard = win?.navigator?.clipboard;
    if (clipboard?.writeText) {
      clipboard.writeText(code).then(
        () => this.flagCopied(),
        () => this.fallbackCopy(code),
      );
    } else {
      this.fallbackCopy(code);
    }
  }

  /** Fallback für ältere Browser / nicht sichere Kontexte. */
  private fallbackCopy(code: string): void {
    try {
      const textarea = this.doc.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      this.doc.body.appendChild(textarea);
      textarea.select();
      this.doc.execCommand('copy');
      this.doc.body.removeChild(textarea);
      this.flagCopied();
    } catch {
      // Kopieren nicht möglich – dann bleibt die Rückmeldung einfach aus.
    }
  }

  private flagCopied(): void {
    this.copied = true;
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(() => {
      this.copied = false;
      this.resetTimer = null;
    }, 2200);
  }

  ngOnDestroy(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
  }
}
