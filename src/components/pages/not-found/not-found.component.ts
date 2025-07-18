import { Component, OnInit } from '@angular/core';
import { ImageHeroComponent } from '../../molecules/image-hero/image-hero.component';


@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [ImageHeroComponent],
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
