import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-diodenlaser',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './diodenlaser.html',
  styleUrls: ['./diodenlaser.scss']
})
export class Diodenlaser implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  paragraphText: string = `
    Der 4-Wellen-Diodenlaser ist eine moderne Methode zur dauerhaften Haarentfernung.
    Durch mehrere Wellenlängen können verschiedene Haar- und Hauttypen effektiv behandelt werden –
    komfortabel, schnell und mit planbaren Intervallen.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `;
}
