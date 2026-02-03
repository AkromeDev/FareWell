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
    Sind Sie noch unsicher, welche Behandlung die richtige für Sie ist  
    Keine Sorge, die erste Beratung bei FareWell ist kostenlos. Gemeinsam finden wir heraus, was am besten zu Ihnen passt.

    Im Februar bedanken wir uns besonders bei neuen Kundinnen und Kunden.  
    Mit dem Code FOREVER erhalten Sie 40 % Rabatt auf alle Folgebehandlungen.

    Der Rabatt gilt lebenslang und ist unser Versprechen für Vertrauen, Qualität und eine langfristige Zusammenarbeit.  
    Ganz unkompliziert, als Dankeschön für Ihre Entscheidung für FareWell.
  `;


  isFullscreen = false;

  onFsChange(open: boolean) {
    this.isFullscreen = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
}
