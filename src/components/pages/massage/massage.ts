import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-wellness-massagen',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './massage.html',
  styleUrls: ['./massage.scss']
})
export class MassageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  paragraphText: string = `
    Wellness Massagen bei FareWell sind deine Auszeit für Körper & Kopf:
    Verspannungen lösen, runterfahren und neue Leichtigkeit spüren.

    Unten findest du unsere Massage-Angebote inkl. Dauer & Preise.
  `;
}