import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcComponent } from "src/components/timeProjection/bc/bc.component";
import { ImageTextBlockComponent } from "src/components/molecules/image-text-block/image-text-block.component";
import { LanguageService } from 'src/services/language.service';

@Component({
    selector: 'app-zeit',
    standalone: true,
    imports: [CommonModule, BcComponent, ImageTextBlockComponent],
    templateUrl: './zeit.component.html',
    styleUrls: ['./zeit.component.scss']
})
export class ZeitComponent implements OnInit {

  readonly lang = inject(LanguageService);

  constructor() { }

  ngOnInit(): void {
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }
}
