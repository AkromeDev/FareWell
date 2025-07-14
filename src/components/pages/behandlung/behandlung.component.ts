import { Component, Input, OnInit } from '@angular/core';
import { ButtonItem } from 'src/models/ButtonItem';
import { ImageHeroComponent } from "src/components/molecules/image-hero/image-hero.component";
import { ImageTextBlockComponent } from "src/components/molecules/image-text-block/image-text-block.component";
import { ButtonComponent } from "src/components/atoms/button/button.component";

@Component({
  selector: 'app-behandlung',
  standalone: true,
  imports: [ImageHeroComponent, ImageTextBlockComponent, ButtonComponent],
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
    Die Buttons führen dich direkt zu den häufig gestellten Fragen.
  `;


  buttonList: ButtonItem[] = [
    { label: 'Wie lang dauert es?', link: '#dauer', theme: 'dark' },
    { label: 'Tut es Weh?', link: '#wehtun', theme: 'dark' },
    { label: 'Ist es gesund?', link: '#gesund', theme: 'dark' }
  ];

}
