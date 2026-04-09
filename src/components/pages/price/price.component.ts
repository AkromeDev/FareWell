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

    Aktuell bieten wir Ihnen ein exklusives Angebot:
    60 % Rabatt auf die Laser Haarentfernung für die Achseln.

    Sobald Sie dieses Angebot einmal nutzen, erhalten Sie den Rabatt von 60 % für die gesamte Behandlungsserie in diesem Bereich.

    Dieses Angebot ist nur bis zum 15. Mai gültig.

    Nutzen Sie diese Gelegenheit, um unsere Behandlung kennenzulernen und sich selbst von den Ergebnissen zu überzeugen.
  `;


  isFullscreen = false;

  onFsChange(open: boolean) {
    this.isFullscreen = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
}
