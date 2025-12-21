import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaserPromotionComponent } from './laser-promotion.component';

describe('LaserPromotionComponent', () => {
  let component: LaserPromotionComponent;
  let fixture: ComponentFixture<LaserPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaserPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaserPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
