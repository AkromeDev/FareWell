import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NadelepilationPromotionComponent } from './nadelepilation-promotion.component';

describe('NadelepilationPromotionComponent', () => {
  let component: NadelepilationPromotionComponent;
  let fixture: ComponentFixture<NadelepilationPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NadelepilationPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NadelepilationPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
