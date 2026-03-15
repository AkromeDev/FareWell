import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesignTokens } from 'src/models';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() theme: DesignTokens.Theme = 'light';
  @Input() link?: string;
  @Input() external: boolean = false;

  @Input() analyticsEvent?: string;
  @Input() analyticsLocation?: string;
  @Input() analyticsLabel?: string;

  get target(): string | null {
    return this.external ? '_blank' : null;
  }

  get rel(): string | null {
    return this.external ? 'noopener noreferrer' : null;
  }

  constructor() {}

  ngOnInit(): void {}

  handleClick(): void {
    if (!this.analyticsEvent) return;

    window.gtag?.('event', this.analyticsEvent, {
      event_category: 'engagement',
      event_label: this.analyticsLabel ?? this.analyticsLocation ?? 'button-click',
      location: this.analyticsLocation ?? 'unknown',
      link_url: this.link ?? ''
    });
  }
}