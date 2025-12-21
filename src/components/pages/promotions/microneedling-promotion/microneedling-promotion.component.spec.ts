import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MicroneedlingPromotionComponent } from './microneedling-promotion.component';
import { CommonModule } from '@angular/common';

describe('MicroneedlingPromotionComponent', () => {
  let component: MicroneedlingPromotionComponent;
  let fixture: ComponentFixture<MicroneedlingPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MicroneedlingPromotionComponent],
      imports: [CommonModule] // add any modules the component depends on
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

describe('MicroneedlingPromotionComponent', () => {
  let component: MicroneedlingPromotionComponent;
  let fixture: ComponentFixture<MicroneedlingPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroneedlingPromotionComponent]
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
