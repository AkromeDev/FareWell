import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 110;
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.menuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}

