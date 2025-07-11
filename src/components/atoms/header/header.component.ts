import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
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

  protected setActiveTab (tab: string) {
    this.activeTab = tab;
  }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        this.scrolled = window.scrollY > 110;
    }

  constructor() { }

  ngOnInit(): void {
  }
}
