import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScrollTo]',
  standalone: true,
})
export class ScrollToDirective {
  @Input('appScrollTo') targetId!: string;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();

    const el = document.getElementById(this.targetId);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
