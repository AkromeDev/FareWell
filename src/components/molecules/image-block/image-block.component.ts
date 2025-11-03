import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTokens } from 'src/models';

@Component({
  selector: 'app-image-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss']
})
export class ImageBlockComponent {
  @Input() theme: DesignTokens.Theme = 'dark';
  @Input({ required: true }) src!: string;
  @Input() alt = 'Image';
  @Input() aspectRatio: string | 'auto' = '16 / 9';
  @Input() maxHeightVh: number | null = null;
  @Input() fit: 'cover' | 'contain' = 'cover';
  @Input() rounded = true;
  @Input() enableFullscreen = true;
  @Output() fullscreenChange = new EventEmitter<boolean>();

  isOverlayOpen = false;
  private usedNativeFullscreen = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  /** Handy getter to know if we're currently fullscreen in any way */
  get isFullscreenActive(): boolean {
    return this.isOverlayOpen || !!document.fullscreenElement;
  }

  async toggleFullscreen() {
    if (!this.enableFullscreen) return;
    if (this.isFullscreenActive) {
      await this.closeFullscreen();
    } else {
      await this.openFullscreen();
    }
  }

  async openFullscreen() {
    const wrapper = this.host.nativeElement.querySelector('.image-wrapper') as HTMLElement | null;
    if (wrapper?.requestFullscreen) {
      try {
        await wrapper.requestFullscreen();
        this.usedNativeFullscreen = true;
        this.fullscreenChange.emit(true);
        return;
      } catch {
        // fall back to overlay
      }
    }
    this.isOverlayOpen = true;
    this.fullscreenChange.emit(true);
  }

  async closeFullscreen() {
    if (document.fullscreenElement && this.usedNativeFullscreen) {
      await document.exitFullscreen();
    }
    this.usedNativeFullscreen = false;
    this.isOverlayOpen = false;
    this.fullscreenChange.emit(false);
  }

  /** ESC closes both native fullscreen and overlay */
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isFullscreenActive) this.closeFullscreen();
  }

  /** Keep state in sync when the user exits native fullscreen via browser UI */
  @HostListener('document:fullscreenchange')
  onFsChangeDoc() {
    if (!document.fullscreenElement && this.usedNativeFullscreen) {
      this.usedNativeFullscreen = false;
      this.fullscreenChange.emit(false);
    }
  }
}
