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

  @Input() parallax: boolean = true;

  @Input() backgroundColor: string = 'transparent';

  get sectionStyleVars(): Record<string, string> {
    return {
      '--bg-image': this.backgroundImage ? `url('${this.backgroundImage}')` : 'none',
      '--bg-size': this.backgroundFit,
      '--bg-pos': this.backgroundPosition,
      '--bg-color': this.backgroundColor,
      '--bg-attach': this.parallax ? 'fixed' : 'scroll',
    };
  }
}
