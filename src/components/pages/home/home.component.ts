import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import googleReviewsJson from 'src/assets/data/google-reviews.json';
import type {
  GooglePlaceReviewsResponse,
  GoogleReview,
} from 'src/components/molecules/google-reviews/google-reviews';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const PAGE_PATH = '/';

/** Statische Karte im Behandlungs-Rail — Sprachwechsel läuft über .lang-Spans. */
type ServiceCard = {
  num: string;
  titleDe: string;
  titleEn: string;
  descDe: string;
  descEn: string;
  altDe: string;
  altEn: string;
  path: string;
  image: string;
};

type ReviewCard = {
  name: string;
  time: string;
  text: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective, ScrollToDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'home-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/farewell/studio.webp';
  private readonly bookingUrl = 'https://salonkee.de/salon/farewell?lang=de';

  @ViewChild('railTrack') private railTrack?: ElementRef<HTMLElement>;

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  // -------------------------------------------------------------------------
  // Zeit-Rechner — 10 Minuten pro Rasur, 52 Wochen, 60 Rasier-Jahre.
  // -------------------------------------------------------------------------
  readonly freq = signal(7);
  readonly hoursYear = computed(() => Math.round((this.freq() * 10 * 52) / 60));
  readonly daysLife = computed(() => Math.round((this.hoursYear() * 60) / 24));

  onFreqInput(event: Event): void {
    this.freq.set(Number((event.target as HTMLInputElement).value));
  }

  // -------------------------------------------------------------------------
  // Behandlungen — gleiche sechs Behandlungen wie im Header-Mega-Menü.
  // -------------------------------------------------------------------------
  readonly services: ServiceCard[] = [
    {
      num: '01',
      titleDe: 'Nadelepilation',
      titleEn: 'Electrolysis',
      descDe:
        'Permanente Haarentfernung mit Elektrolyse: präzise, zuverlässig, endgültig. Die einzige medizinisch anerkannt permanente Methode.',
      descEn:
        'Permanent hair removal with electrolysis: precise, reliable, final. The only medically recognised permanent method.',
      altDe:
        'Permanente Haarentfernung mit Nadelepilation bei FareWell in Nürnberg',
      altEn: 'Permanent hair removal with electrolysis at FareWell in Nuremberg',
      path: '/behandlungen/nadelepilation',
      image: 'assets/images/treatment/nadelepilation.jpg',
    },
    {
      num: '02',
      titleDe: '4 Wellen Dioden Laser',
      titleEn: '4-Wavelength Diode Laser',
      descDe:
        'Dauerhafte Haarentfernung für viele Haut- & Haartypen, schnell und komfortabel auch auf großen Flächen.',
      descEn:
        'Long-lasting hair removal for many skin and hair types, fast and comfortable even on larger areas.',
      altDe:
        'Dauerhafte Laser-Haarentfernung mit dem 4-Wellen-Diodenlaser in Nürnberg',
      altEn:
        'Long-lasting laser hair removal with the 4-wavelength diode laser in Nuremberg',
      path: '/behandlungen/diodenlaser-4-wellen',
      image: 'assets/images/treatment/diodenlaser.webp',
    },
    {
      num: '03',
      titleDe: 'Microneedling RF',
      titleEn: 'RF Microneedling',
      descDe:
        'Straffung & Hautbild: feine Nadeln plus Radiofrequenz-Wärme für ein glatteres Erscheinungsbild.',
      descEn:
        'Firming and skin texture: fine needles plus radiofrequency heat for a smoother appearance.',
      altDe:
        'Microneedling mit Radiofrequenz für ein glatteres Hautbild bei FareWell Nürnberg',
      altEn: 'RF microneedling for smoother skin at FareWell Nuremberg',
      path: '/behandlungen/microneedling-radiofrequenz',
      image: 'assets/images/treatment/microneedling.webp',
    },
    {
      num: '04',
      titleDe: 'Wellness Massage',
      titleEn: 'Wellness Massage',
      descDe:
        'Entspannung, Regeneration & neue Leichtigkeit mit wohltuenden Wellness-Massagen.',
      descEn:
        'Relaxation, recovery and new lightness with soothing wellness massages.',
      altDe: 'Wellness-Massage im FareWell Studio in Nürnberg',
      altEn: 'Wellness massage at the FareWell studio in Nuremberg',
      path: '/behandlungen/wellness-massage',
      image: 'assets/images/treatment/massage-hero.jpg',
    },
    {
      num: '05',
      titleDe: 'Therapeutische Massage',
      titleEn: 'Therapeutic Massage',
      descDe:
        'Gezielte Behandlung bei Verspannungen, sportlicher Belastung & für individuelle Regeneration.',
      descEn:
        'Targeted work for tension, sports strain and individual recovery.',
      altDe:
        'Therapeutische Massage gegen Verspannungen bei FareWell in Nürnberg',
      altEn: 'Therapeutic massage for muscle tension at FareWell in Nuremberg',
      path: '/behandlungen/therapeutische-massage',
      image: 'assets/images/massages/tm%20massaging.jpg',
    },
    {
      num: '06',
      titleDe: 'Kavitation',
      titleEn: 'Cavitation',
      descDe:
        'Ultraschall-Unterstützung zur Kontur: sanft, nicht-invasiv und effektiv gegen Cellulite.',
      descEn:
        'Ultrasound support for body contour: gentle, non-invasive and effective against cellulite.',
      altDe: 'Kavitationsbehandlung für die Körperkontur bei FareWell Nürnberg',
      altEn: 'Cavitation body contouring treatment at FareWell Nuremberg',
      path: '/behandlungen/kavitation',
      image: 'assets/images/treatment/kavitation.webp',
    },
  ];

  scrollRail(direction: 1 | -1): void {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    this.railTrack?.nativeElement.scrollBy({
      left: direction * 420,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  // -------------------------------------------------------------------------
  // Google-Bewertungen — gleiche Datenquelle wie fw-google-reviews.
  // -------------------------------------------------------------------------
  private readonly reviewsData = (
    googleReviewsJson as GooglePlaceReviewsResponse
  ).data;

  readonly rating = this.reviewsData.rating ?? 4.9;
  readonly ratingCount = this.reviewsData.userRatingCount ?? 0;
  readonly ratingDe = this.rating.toFixed(1).replace('.', ',');
  readonly ratingEn = this.rating.toFixed(1);

  readonly rowA: ReviewCard[] = (this.reviewsData.reviews ?? []).map((r) =>
    this.toReviewCard(r)
  );
  readonly rowB: ReviewCard[] = this.rowA.slice().reverse();

  /** Laufband anhalten/abspielen (WCAG 2.2.2 — sichtbarer Pause-Schalter). */
  marqueePaused = false;

  toggleMarquee(): void {
    this.marqueePaused = !this.marqueePaused;
  }

  private toReviewCard(review: GoogleReview): ReviewCard {
    const raw = (review.text?.text ?? review.originalText?.text ?? '').trim();
    const flat = raw.replace(/\s+/g, ' ');
    const name = (review.authorAttribution?.displayName ?? 'Google')
      // Gamer-Tags wie "Kevin Donath (DoughnutBot)" ohne Klammerzusatz zeigen.
      .replace(/\s*\([^)]*\)\s*$/, '');
    return {
      name,
      time: review.relativePublishTimeDescription ?? '',
      text: this.truncate(flat, 220),
    };
  }

  private truncate(text: string, max: number): string {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()} …`;
  }

  trackReview(index: number, review: ReviewCard): string {
    return `${review.name}-${index}`;
  }

  // -------------------------------------------------------------------------
  // Buchungs-Tracking — gleiches Muster wie Header/Footer.
  // -------------------------------------------------------------------------
  trackBookingClick(event: MouseEvent, location: string, label: string): void {
    event.preventDefault();

    if (!window.gtag) {
      window.open(this.bookingUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    let opened = false;

    const openBooking = () => {
      if (opened) return;
      opened = true;
      window.open(this.bookingUrl, '_blank', 'noopener,noreferrer');
    };

    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: label,
      link_text: label,
      location,
      destination: 'salonkee',
      event_callback: openBooking,
    });

    setTimeout(openBooking, 800);
  }

  // -------------------------------------------------------------------------
  // Manifest — Wörter färben sich beim Scrollen von gedimmt nach Creme.
  // Reine Browser-Verschönerung: auf dem Server, ohne JS und bei
  // prefers-reduced-motion bleibt der Text vollständig lesbar.
  // -------------------------------------------------------------------------
  private manifestSpans: HTMLElement[][] = [];
  private manifestParagraphs: HTMLElement[] = [];
  private scrollHandler?: () => void;
  private cueEl: HTMLElement | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const hostEl = this.host.nativeElement as HTMLElement;
    this.cueEl = hostEl.querySelector<HTMLElement>('.scroll-cue');

    // Wort-für-Wort-Highlight nur ohne prefers-reduced-motion; das reine
    // Ausblenden des Scroll-Hinweises ist keine Bewegung und bleibt aktiv.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const paragraphs = Array.from(
        hostEl.querySelectorAll<HTMLElement>('.manifest-copy')
      );
      this.manifestParagraphs = paragraphs;
      this.manifestSpans = paragraphs.map((paragraph) =>
        this.wrapWords(paragraph)
      );
    }

    this.zone.runOutsideAngular(() => {
      this.scrollHandler = () => {
        // Scroll-Hinweis nicht hart wegschalten, sondern mit dem Scrollweg
        // ausblenden: ab dem ersten Pixel linear, komplett weg bei 20 % der
        // Viewport-Höhe.
        if (this.cueEl) {
          const fade =
            1 -
            Math.min(
              Math.max(window.scrollY / (window.innerHeight * 0.2), 0),
              1
            );
          this.cueEl.style.setProperty('--cue-fade', fade.toFixed(3));
          this.cueEl.classList.toggle('is-hidden', fade === 0);
        }
        this.updateManifestHighlight();
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      this.scrollHandler();
    });
  }

  private wrapWords(root: HTMLElement): HTMLElement[] {
    const spans: HTMLElement[] = [];

    const wrap = (node: Node): void => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          (child.textContent ?? '').split(/(\s+)/).forEach((token) => {
            if (token === '' || /^\s+$/.test(token)) {
              fragment.appendChild(document.createTextNode(token));
              return;
            }
            const span = document.createElement('span');
            span.textContent = token;
            span.className = 'manifest-word';
            fragment.appendChild(span);
            spans.push(span);
          });
          node.replaceChild(fragment, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrap(child);
        }
      });
    };

    wrap(root);
    return spans;
  }

  private updateManifestHighlight(): void {
    this.manifestParagraphs.forEach((paragraph, i) => {
      // Nur den sichtbaren Sprach-Absatz auswerten (der andere ist display:none).
      if (!paragraph.offsetParent) return;

      const rect = paragraph.getBoundingClientRect();
      if (rect.height === 0) return;

      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.75 - rect.top) / rect.height)
      );
      const spans = this.manifestSpans[i];
      const visibleCount = Math.floor(progress * spans.length);

      spans.forEach((span, j) => {
        span.classList.toggle('is-lit', j < visibleCount);
      });
    });
  }

  // -------------------------------------------------------------------------
  // SEO
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    const pageTitle = this.t(
      'FareWell Nürnberg | Permanente Haarentfernung & Beauty Studio',
      'FareWell Nuremberg | Permanent Hair Removal & Beauty Studio'
    );
    const description = this.t(
      'FareWell Nürnberg: spezialisiert auf Elektrolyse (permanente Haarentfernung), Laserbehandlungen, Microneedling und weitere Beauty Behandlungen.',
      'FareWell in Nuremberg specialises in electrolysis (permanent hair removal), laser hair removal, RF microneedling and body treatments. Consultations in English, near the main station.'
    );
    const imageAlt = this.t(
      'FareWell Studio in Nürnberg für permanente Haarentfernung und ästhetische Behandlungen',
      'FareWell studio in Nuremberg for permanent hair removal and aesthetic treatments'
    );

    this.seo.setPageSeo({
      title: pageTitle,
      description: description,
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: imageAlt,
      largeImage: true,
    });

    const isEn = this.lang.lang() === 'en';
    const pageUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon/';

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BeautySalon',
          '@id': 'https://farewell.salon/#organization',
          name: 'FareWell',
          url: 'https://farewell.salon',
          image: this.heroImageUrl,
          telephone: '+4915757995694',
          priceRange: '€€',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Frauentorgraben 5',
            postalCode: '90443',
            addressLocality: 'Nürnberg',
            addressCountry: 'DE',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 49.44677,
            longitude: 11.07501,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
              ],
              opens: '10:00',
              closes: '20:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '08:00',
              closes: '17:00',
            },
            // Sonntag explizit als geschlossen markieren (opens = closes),
            // statt den Tag nur wegzulassen.
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Sunday',
              opens: '00:00',
              closes: '00:00',
            },
          ],
          sameAs: ['https://www.instagram.com/farewell.salon/'],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://farewell.salon/#website',
          url: 'https://farewell.salon',
          name: 'FareWell',
          publisher: {
            '@id': 'https://farewell.salon/#organization',
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description: description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: {
            '@id': 'https://farewell.salon/#website',
          },
          about: {
            '@id': 'https://farewell.salon/#organization',
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: this.heroImageUrl,
          },
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
