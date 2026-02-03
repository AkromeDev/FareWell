import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-nadelepilation',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './nadelepilation.component.html',
  styleUrl: './nadelepilation.component.scss'
})
export class NadelepilationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  paragraphText: string = `
    Die Elektrolyse (Nadelepilation) ist eine medizinisch anerkannte Methode zur permanenten Haarentfernung.
    Sie ist für alle Hauttypen und Haarfarben geeignet und bietet eine sichere, effektive Lösung für unerwünschte Haare.

    Alle wichtigen Infos zur Elektrolyse findest du weiter unten.
  `;
}
