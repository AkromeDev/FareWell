import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from 'src/components/atoms/header/header.component';
import { FooterComponent } from 'src/components/molecules/footer/footer.component';
import { AnalyticsService } from 'src/services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  constructor(private analytics: AnalyticsService) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (canonical) {
          canonical.href = `https://farewell.salon${e.urlAfterRedirects}`;
        }

        // Dokumentsprache pro Route (z. B. englischer US-Forces-Ratgeber),
        // damit <html lang> zu Inhalt, og:locale und hreflang passt.
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        this.document.documentElement.lang = (route.data['lang'] as string) ?? 'de';
      });
  }
}
