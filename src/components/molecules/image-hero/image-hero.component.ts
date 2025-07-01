import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSectionComponent } from 'src/components/atoms/image-section/image-section.component';
import { SeparatorComponent } from 'src/components/atoms/separator/separator.component';

@Component({
  selector: 'app-image-hero',
  standalone: true,
  imports: [CommonModule, ImageSectionComponent, SeparatorComponent],
  templateUrl: './image-hero.component.html',
  styleUrls: ['./image-hero.component.scss']
})
export class ImageHeroComponent implements OnInit {
  @Input() title: string = '';
  @Input() paragraph: string = '';
  @Input() backgroundImage: string = '';
  @Input() shadow: '' | 'light' | 'dark' = 'dark';

get computedShadow(): '' | 'light-shadow' | 'dark-shadow' {
  if (this.shadow === 'dark') return 'dark-shadow';
  if (this.shadow === 'light') return 'light-shadow';
  return '';
}

  constructor() { }

  ngOnInit(): void {
  }

}
