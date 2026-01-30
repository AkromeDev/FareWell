import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

type TreatmentCard = {
  title: string;
  description: string;
  route: string;
  image: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  scrolled: boolean = false;
  activeTab: string = 'home';
  menuOpen: boolean = false;

  behandlungenOpen: boolean = false;
  isMobile: boolean = false;

  treatments: TreatmentCard[] = [
    {
      title: 'Nadelepilation',
      description: 'Permanente Haarentfernung mit Elektrolyse – präzise, zuverlässig, endgültig.',
      route: '/behandlungen/nadelepilation',
      image: 'assets/images/treatment/nadelepilation.jpg'
    },
    {
      title: '4 Wellen Dioden Laser',
      description: 'Dauerhafte Haarentfernung für viele Haut- & Haartypen – schnell und komfortabel.',
      route: '/behandlungen/diodenlaser-4-wellen',
      image: 'assets/images/treatment/diodenlaser.jpg'
    },
    {
      title: 'Microneedling Radio Frequenz',
      description: 'Straffung & Hautbild: feine Nadeln + Wärme für ein glatteres Erscheinungsbild.',
      route: '/behandlungen/microneedling-radiofrequenz',
      image: 'assets/images/treatment/microneedling.png'
    },
    {
      title: 'Kavitation',
      description: 'Ultraschall-Unterstützung zur Kontur – sanft, nicht-invasiv und effektiv.',
      route: '/behandlungen/kavitation',
      image: 'assets/images/treatment/kavitation.jpg'
    }
  ];

  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {
    this.updateIsMobile();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.menuOpen = false;
    this.behandlungenOpen = false;
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

  openBehandlungenDesktop() {
    if (!this.isMobile) this.behandlungenOpen = true;
  }

  closeBehandlungenDesktop() {
    if (!this.isMobile) this.behandlungenOpen = false;
  }

  closeAll() {
    this.menuOpen = false;
    this.behandlungenOpen = false;
  }

  private updateIsMobile() {
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.updateIsMobile();

    if (wasMobile && !this.isMobile) {
      this.closeAll();
    }
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
