import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Level44Component } from './level-44.component';

describe('Level44Component', () => {
  let component: Level44Component;
  let fixture: ComponentFixture<Level44Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level44Component],
      // LanguageService (über den SeoService) braucht einen Router.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Level44Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lädt Wistia erst nach dem Klick', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('iframe')).toBeNull();
    el.querySelector<HTMLButtonElement>('.audio-gate button')!.click();
    fixture.detectChanges();
    expect(el.querySelector('iframe')?.getAttribute('src')).toContain('fast.wistia.net/embed/iframe/nx15jjlaj3');
  });

  it('nennt nirgends Therapie als Angebot und nicht Hypnosetherapie', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).not.toMatch(/Hypnosetherapie|Hypnotherapy|Soul Touch Therapy/i);
  });

  it('zeigt die Online-Journeys vorerst nicht', () => {
    expect(fixture.nativeElement.querySelector('#offer-online')).toBeNull();
  });

  it('ist indexierbar', () => {
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content') ?? '').not.toContain('noindex');
  });
});
