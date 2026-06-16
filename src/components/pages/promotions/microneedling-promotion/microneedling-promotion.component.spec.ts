import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MicroneedlingPromotionComponent } from './microneedling-promotion.component';

describe('MicroneedlingPromotionComponent', () => {
  let component: MicroneedlingPromotionComponent;
  let fixture: ComponentFixture<MicroneedlingPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroneedlingPromotionComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroneedlingPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
