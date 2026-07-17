import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GuideLangToggleComponent } from 'src/components/molecules/guide/guide-lang-toggle/guide-lang-toggle.component';
import { LanguageService } from 'src/services/language.service';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type TreatmentCard = {
  title: string;
  description: string;
  route: string;
  image: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, GuideLangToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  scrolled: boolean = false;
  activeTab: string = 'home';
  menuOpen: boolean = false;

  behandlungenOpen: boolean = false;
  /** Kompakte Kopfzeile (Burger sichtbar), rein fürs Layout-Housekeeping. */
  isMobile: boolean = false;
  /** Echtes Zeigegerät (Maus/Trackpad), das hovern kann — sonst Touch. */
  canHover: boolean = false;

  isBehandlungenRoute: boolean = false;

  readonly lang = inject(LanguageService);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly bookingUrl = 'https://salonkee.de/salon/farewell?lang=de';
  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** Interner Link in der aktiven Sprache (auf /en/-Seiten mit /en-Präfix). */
  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get treatments(): TreatmentCard[] {
    const t = (de: string, en: string) => this.lang.t(de, en);
    return [
      {
        title: t('Nadelepilation', 'Electrolysis'),
        description: t(
          'Permanente Haarentfernung mit Elektrolyse: präzise, zuverlässig, endgültig.',
          'Permanent hair removal with electrolysis: precise, reliable, final.'
        ),
        route: this.p('/behandlungen/nadelepilation'),
        image: 'assets/images/treatment/nadelepilation.jpg'
      },
      {
        title: t('4 Wellen Dioden Laser', '4-Wavelength Diode Laser'),
        description: t(
          'Dauerhafte Haarentfernung für viele Haut- & Haartypen, schnell und komfortabel.',
          'Long-lasting hair removal for many skin and hair types, fast and comfortable.'
        ),
        route: this.p('/behandlungen/diodenlaser-4-wellen'),
        image: 'assets/images/treatment/diodenlaser.webp'
      },
      {
        title: t('Microneedling Radio Frequenz', 'RF Microneedling'),
        description: t(
          'Straffung & Hautbild: feine Nadeln + Wärme für ein glatteres Erscheinungsbild.',
          'Firming and skin texture: fine needles plus heat for a smoother appearance.'
        ),
        route: this.p('/behandlungen/microneedling-radiofrequenz'),
        image: 'assets/images/treatment/microneedling.webp'
      },
      {
        title: t('Wellness Massage', 'Wellness Massage'),
        description: t(
          'Entspannung, Regeneration & neue Leichtigkeit mit wohltuenden Wellness-Massagen.',
          'Relaxation, recovery and new lightness with soothing wellness massages.'
        ),
        route: this.p('/behandlungen/wellness-massage'),
        image: 'assets/images/treatment/massage-hero.jpg'
      },
      {
        title: t('Therapeutische Massage', 'Therapeutic Massage'),
        description: t(
          'Gezielte Behandlung bei Verspannungen, sportlicher Belastung & für individuelle Regeneration.',
          'Targeted work for tension, sports strain and individual recovery.'
        ),
        route: this.p('/behandlungen/therapeutische-massage'),
        image: 'assets/images/massages/tm%20massaging.jpg'
      },
      {
        title: t('Kavitation', 'Cavitation'),
        description: t(
          'Ultraschall-Unterstützung zur Kontur: sanft, nicht-invasiv und effektiv.',
          'Ultrasound support for body contour: gentle, non-invasive and effective.'
        ),
        route: this.p('/behandlungen/kavitation'),
        image: 'assets/images/treatment/kavitation.webp'
      }
    ];
  }

  constructor(private eRef: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.updateInteractionMode();
    this.updateBehandlungenRouteState(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.updateBehandlungenRouteState(e.urlAfterRedirects);
      });
  }

  private updateBehandlungenRouteState(url: string) {
    this.isBehandlungenRoute = url.startsWith('/behandlungen');
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.menuOpen = false;
    this.behandlungenOpen = false;
    this.clearCloseTimer();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) this.behandlungenOpen = false;
  }

  toggleBehandlungen(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.behandlungenOpen = !this.behandlungenOpen;
  }

  onBehandlungenEnter() {
    // Nur echte Zeigegeräte öffnen per Hover. Auf Touch-Geräten (auch großen
    // Tablets im Querformat) läuft das Öffnen über Klick/Tap, siehe
    // toggleBehandlungen — sonst würde ein Tap synthetisches mouseenter
    // (öffnet) UND click (toggelt wieder zu) auslösen und das Panel bliebe zu.
    if (!this.canHover) return;
    this.clearCloseTimer();
    this.behandlungenOpen = true;
  }

  onBehandlungenLeave() {
    if (!this.canHover) return;
    this.scheduleClose();
  }

  trackBookingClick(event: MouseEvent): void {
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
      event_label: 'Termin Buchen Header',
      link_text: 'Termin Buchen',
      location: 'header',
      destination: 'salonkee',
      event_callback: openBooking
    });

    setTimeout(openBooking, 800);
  }

  private scheduleClose() {
    this.clearCloseTimer();
    this.closeTimeoutId = setTimeout(() => {
      this.behandlungenOpen = false;
      this.closeTimeoutId = null;
    }, 280);
  }

  private clearCloseTimer() {
    if (this.closeTimeoutId) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }

  closeAll() {
    this.menuOpen = false;
    this.behandlungenOpen = false;
    this.clearCloseTimer();
  }

  private updateInteractionMode() {
    if (!this.isBrowser) return;
    // Kompakte Leiste (Burger) — muss mit dem CSS-Breakpoint übereinstimmen.
    this.isMobile = window.matchMedia('(max-width: 1160px)').matches;
    // Hover nur, wenn das Gerät wirklich hovern kann. Touch-Geräte melden
    // (hover: none) / (pointer: coarse) und bedienen das Menü per Tap.
    this.canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.updateInteractionMode();
    if (wasMobile && !this.isMobile) this.closeAll();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 110;
    this.closeAll();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeAll();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeAll();
    }
  }
}