import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ParallaxComponent } from 'src/components/atoms/parallax/parallax.component';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';
import { OpeningHoursComponent } from "src/components/atoms/opening-hours/opening-hours.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [TextBlockComponent, ImageHeroComponent, CommonModule, ParallaxComponent, OpeningHoursComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  paragraphText: string = `
  Der Beauty Salon FareWell ist spezialisiert in Elektrolyse Haarentfernung. die einzige Methode zur Haarentfernung, die von medizinischen Fachstellen als wirklich permanent anerkannt ist, unabhängig von Haarfarbe oder Hauttyp.

  Willkommen in eurer neuen permanenten Freiheit.
  `;
  buttonList: ButtonItem[] = [
    { label: 'Mehr erfahren', link: '/behandlung', theme: 'dark' },
    { label: 'Unsere Preise', link: '/price', theme: 'dark' },
    { label: 'Termin buchen', link: '/buchung', theme: 'dark' }
  ];
  activeTab: string = 'home';

  protected setActiveTab (tab: string) {
    this.activeTab = tab;
  }

  constructor() { }

  ngOnInit(): void {
  }
}
