import { Directive, HostListener, Input, PLATFORM_ID, booleanAttribute, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollTo]',
  standalone: true,
})
export class ScrollToDirective {
  @Input('appScrollTo') targetId!: string;

  /**
   * Schreibt das Ziel als #anker in die Adresszeile, damit sich die Stelle
   * per kopiertem Link teilen lässt (Inhaltsverzeichnis). Opt-in, weil
   * Sprünge wie „Zurück nach oben" im Footer keinen Anker hinterlassen sollen.
   */
  @Input({ alias: 'appScrollToHash', transform: booleanAttribute }) updateHash = false;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.isBrowser) {
      return;
    }

    // preventDefault() muss vor dem Element-Lookup bleiben: wegen
    // <base href="/"> würde ein durchgelassenes href="#ziel" auf jeder
    // Unterseite zur Startseite navigieren.
    event.preventDefault();

    const el = document.getElementById(this.targetId);
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    if (this.updateHash) {
      // replaceState statt pushState: kein Verlaufseintrag je Klick, und kein
      // popstate, das der Router als Navigation verarbeiten würde. history.state
      // bleibt erhalten, darin führt der Router seine navigationId.
      const { pathname, search } = window.location;
      history.replaceState(history.state, '', `${pathname}${search}#${this.targetId}`);
    }

    // Ohne Fokuswechsel scrollt nur das Bild: preventDefault() nimmt dem
    // Browser die Sprungmarken-Navigation ab, und damit bliebe der Lesecursor
    // eines Screenreaders am Link stehen — die Zielsektion würde nie
    // vorgelesen. tabindex="-1" macht sie programmatisch fokussierbar, ohne
    // sie in die Tab-Reihenfolge zu hängen. Die zusätzliche tabIndex-Prüfung
    // verhindert, dass ein von Haus aus fokussierbares Ziel (<a>, <button>)
    // aus der Tab-Reihenfolge fällt.
    if (el.tabIndex < 0 && !el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '-1');
    }

    // preventScroll ist Pflicht: sonst überschreibt der Fokus-Scroll das
    // html{scroll-padding-top} und schiebt das Ziel unter die fixe Leiste.
    el.focus({ preventScroll: true });
  }
}
