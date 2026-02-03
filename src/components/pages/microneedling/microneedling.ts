import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-microneedling',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './microneedling.html',
  styleUrl: './microneedling.scss'
})
export class MicroneedlingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  paragraphText: string = `
    Microneedling mit Radiofrequenz kombiniert feine Mikro-Nadeln mit gezielter Wärme in der Tiefe.
    Das Ergebnis: straffere Haut, ein verfeinertes Hautbild und ein frischer Glow – ganz ohne OP.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `;
}
