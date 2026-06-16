import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleReviewsComponent } from './google-reviews';

describe('GoogleReviewsComponent', () => {
  let component: GoogleReviewsComponent;
  let fixture: ComponentFixture<GoogleReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a view model from the bundled reviews JSON', () => {
    expect(component.vm).toBeTruthy();
    expect(Array.isArray(component.vm.reviews)).toBe(true);
    expect(component.vm.reviews.length).toBeLessThanOrEqual(component.maxItems);
  });
});
