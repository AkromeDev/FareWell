import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ScrollToDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
