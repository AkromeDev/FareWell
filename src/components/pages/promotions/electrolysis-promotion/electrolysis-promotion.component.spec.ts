import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectrolysisPromotionComponent } from './electrolysis-promotion.component';

describe('ElektrolysisPromotionComponent', () => {
  let component: ElectrolysisPromotionComponent;
  let fixture: ComponentFixture<ElectrolysisPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectrolysisPromotionComponent]
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
