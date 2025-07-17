import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';

@Component({
    selector: 'app-price',
    imports: [CommonModule, ImageHeroComponent],
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  paragraphText: string = `
  Wir berechnen 17 € pro 15 Minuten.

  Ganz ohne versteckte Kosten. Damit bieten wir nicht nur volle Transparenz, sondern auch einen besseren Preis als alle Mitbewerber in der Region.
  
  `;

}
