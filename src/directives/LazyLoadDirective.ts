import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[lazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit, OnDestroy {
  @Output() visible = new EventEmitter<boolean>();
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.visible.emit(true);
        this.observer.disconnect();
      }
    }, { rootMargin: '200px' });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
