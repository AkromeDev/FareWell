import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IplPromotionComponent } from './ipl-promotion.component';

describe('IplPromotionComponent', () => {
  let component: IplPromotionComponent;
  let fixture: ComponentFixture<IplPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IplPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IplPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
