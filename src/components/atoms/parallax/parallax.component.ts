import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from 'src/components/atoms/title/title.component';

@Component({
  selector: 'app-parallax',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.scss']
})
export class ParallaxComponent implements AfterViewInit, OnDestroy {
  @Input() imageSrc: string = '';
  @Input() title: string = '';

  isVisible: boolean = false;
  private observer!: IntersectionObserver;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.observer.disconnect();
        }
      },
      {
        rootMargin: '200px'
      }
    );

    this.observer.observe(this.elRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  getUrl() {
      return "url(" + this.imageSrc + ")";
    }
}
