import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageBlockComponent } from 'src/components/molecules/image-block/image-block.component';
import { FarewellToggleComponent } from "src/components/atoms/farewell-toggle/farewell-toggle.component";

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, ImageHeroComponent, ImageBlockComponent, FarewellToggleComponent],
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

 gender = signal<'female' | 'male'>('female');

  priceImageSrc = computed(() =>
    this.gender() === 'female'
      ? '/assets/images/prices/price-women.svg'
      : '/assets/images/prices/price-men.svg'
  );

  priceAlt = computed(() =>
    this.gender() === 'female'
      ? 'Preisliste Frauen – FareWell Nürnberg'
      : 'Preisliste Männer – FareWell Nürnberg'
  );

  setGender(g: 'female' | 'male') {
    this.gender.set(g);
  }
  constructor() { }

  ngOnInit(): void {}

  paragraphText: string = `
    Sind Sie noch unsicher welche Behandlung die richtige für Sie ist? 
    Keine Sorge die erste Beratung ist kostenlos. Gemeinsam finden wir heraus was am besten zu Ihnen passt.

    Bei FareWell setzen wir auf Vertrauen und langfristige Beziehungen. Darum belohnen wir unsere treuen Kundinnen und Kunden mit 50 % Rabatt auf alle Folgebehandlungen. 

    Ganz unkompliziert, als kleines Dankeschön für Ihre Loyalität.
  `;

  isFullscreen = false;

  onFsChange(open: boolean) {
    this.isFullscreen = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
}
