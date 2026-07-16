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
  isMobile: boolean = false;

  isBehandlungenRoute: boolean = false;

  readonly lang = inject(LanguageService);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly bookingUrl = 'https://salonkee.de/salon/farewell?lang=de';
  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  get treatments(): TreatmentCard[] {
    const t = (de: string, en: string) => this.lang.t(de, en);
    return [
      {
        title: t('Nadelepilation', 'Electrolysis'),
        description: t(
          'Permanente Haarentfernung mit Elektrolyse: präzise, zuverlässig, endgültig.',
          'Permanent hair removal with electrolysis: precise, reliable, final.'
        ),
        route: '/behandlungen/nadelepilation',
        image: 'assets/images/treatment/nadelepilation.jpg'
      },
      {
        title: t('4 Wellen Dioden Laser', '4-Wavelength Diode Laser'),
        description: t(
          'Dauerhafte Haarentfernung für viele Haut- & Haartypen, schnell und komfortabel.',
          'Long-lasting hair removal for many skin and hair types, fast and comfortable.'
        ),
        route: '/behandlungen/diodenlaser-4-wellen',
        image: 'assets/images/treatment/diodenlaser.webp'
      },
      {
        title: t('Microneedling Radio Frequenz', 'RF Microneedling'),
        description: t(
          'Straffung & Hautbild: feine Nadeln + Wärme für ein glatteres Erscheinungsbild.',
          'Firming and skin texture: fine needles plus heat for a smoother appearance.'
        ),
        route: '/behandlungen/microneedling-radiofrequenz',
        image: 'assets/images/treatment/microneedling.webp'
      },
      {
        title: t('Wellness Massage', 'Wellness Massage'),
        description: t(
          'Entspannung, Regeneration & neue Leichtigkeit mit wohltuenden Wellness-Massagen.',
          'Relaxation, recovery and new lightness with soothing wellness massages.'
        ),
        route: '/behandlungen/wellness-massage',
        image: 'assets/images/treatment/massage-hero.jpg'
      },
      {
        title: t('Therapeutische Massage', 'Therapeutic Massage'),
        description: t(
          'Gezielte Behandlung bei Verspannungen, sportlicher Belastung & für individuelle Regeneration.',
          'Targeted work for tension, sports strain and individual recovery.'
        ),
        route: '/behandlungen/therapeutische-massage',
        image: 'assets/images/massages/tm%20massaging.jpg'
      },
      {
        title: t('Kavitation', 'Cavitation'),
        description: t(
          'Ultraschall-Unterstützung zur Kontur: sanft, nicht-invasiv und effektiv.',
          'Ultrasound support for body contour: gentle, non-invasive and effective.'
        ),
        route: '/behandlungen/kavitation',
        image: 'assets/images/treatment/kavitation.webp'
      }
    ];
  }

  constructor(private eRef: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.updateIsMobile();
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
    if (this.isMobile) return;
    this.clearCloseTimer();
    this.behandlungenOpen = true;
  }

  onBehandlungenLeave() {
    if (this.isMobile) return;
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

  private updateIsMobile() {
    if (!this.isBrowser) return;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.updateIsMobile();
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