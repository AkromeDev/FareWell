import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-kavitation',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './kavitation.html',
  styleUrls: ['./kavitation.scss']
})
export class KavitationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  paragraphText: string = `
    Kavitation ist eine moderne, nicht-invasive Body-Treatment Methode mit Ultraschall.
    Sie unterstützt die Kontur und kann das Hautbild glätten – sanft, komfortabel und ohne Ausfallzeit.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `;
}
