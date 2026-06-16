import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ElectrolysisPromotionComponent } from './electrolysis-promotion.component';

describe('ElectrolysisPromotionComponent', () => {
  let component: ElectrolysisPromotionComponent;
  let fixture: ComponentFixture<ElectrolysisPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectrolysisPromotionComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectrolysisPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
