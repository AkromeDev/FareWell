import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowOptions, DesignTokens } from 'src/models';

@Component({
  selector: 'app-image-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-section.component.html',
  styleUrls: ['./image-section.component.scss'],
})
export class ImageSectionComponent {
  @Input() backgroundImage: string = '';
  @Input() backgroundAlt: string = '';
  @Input() shadow: ShadowOptions.Type | '' = '';
  @Input() height: DesignTokens.Height = '85';

  @Input() backgroundFit: 'cover' | 'contain' = 'cover';

  @Input() backgroundPosition:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top center'
    | 'bottom center'
    | 'center left'
    | 'center right' = 'center';

  @Input() parallax: boolean = false;
  @Input() backgroundColor: string = 'transparent';
  @Input() imagePriority: 'high' | 'auto' = 'auto';
  @Input() imageLoading: 'eager' | 'lazy' = 'lazy';

  get normalizedBackgroundImage(): string {
    if (!this.backgroundImage) {
      return '';
    }

    if (
      this.backgroundImage.startsWith('http://') ||
      this.backgroundImage.startsWith('https://') ||
      this.backgroundImage.startsWith('/')
    ) {
      return this.backgroundImage;
    }

    return `/${this.backgroundImage}`;
  }

  get backgroundPositionClass(): string {
    return this.backgroundPosition.replace(/\s+/g, '-');
  }

  get sectionStyleVars(): Record<string, string> {
    return {
      '--bg-color': this.backgroundColor,
    };
  }

  get imageDecoding(): 'sync' | 'async' {
    return this.imageLoading === 'eager' ? 'sync' : 'async';
  }
}