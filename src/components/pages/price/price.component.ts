import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { PriceBlockComponent } from "src/components/molecules/price-block/price-block.component";
import { ImageBlockComponent } from "src/components/molecules/image-block/image-block.component";

@Component({
    selector: 'app-price',
    imports: [CommonModule, ImageHeroComponent, ImageBlockComponent],
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  paragraphText: string = `
    Bei FareWell setzen wir auf Vertrauen und langfristige Beziehungen.

    Darum belohnen wir unsere treuen Kundinnen und Kunden mit 30 % Rabatt auf alle Folgebehandlungen. Ganz unkompliziert, als kleines Dankeschön für eure Loyalität.
  `;
  
  
  isFullscreen = false;

   onFsChange(open: boolean) {
    this.isFullscreen = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
}
