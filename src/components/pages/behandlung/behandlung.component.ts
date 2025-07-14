import { Component, Input, OnInit } from '@angular/core';
import { ImageHeroComponent } from "src/components/molecules/image-hero/image-hero.component";
import { ImageTextBlockComponent } from "src/components/molecules/image-text-block/image-text-block.component";

@Component({
  selector: 'app-behandlung',
  standalone: true,
  imports: [ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './behandlung.component.html',
  styleUrl: './behandlung.component.scss'
})
export class BehandlungComponent implements OnInit {
    constructor() { }

  ngOnInit(): void {
  }

  paragraphText: string = `
    Die Behandlung ist eine medizinisch anerkannte Methode zur permanenten Haarentfernung.
    Sie ist für alle Hauttypen und Haarfarben geeignet und bietet eine sichere, effektive Lösung für unerwünschte Haare.
    
    Alle wichtigen Infos zur Elektrolyse findest du weiter unten.
  `;
}
