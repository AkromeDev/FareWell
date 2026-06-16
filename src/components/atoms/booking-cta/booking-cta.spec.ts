import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCtaComponent } from './booking-cta';

describe('BookingCtaComponent', () => {
  let component: BookingCtaComponent;
  let fixture: ComponentFixture<BookingCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
