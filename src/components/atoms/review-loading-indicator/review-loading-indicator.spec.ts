import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewLoadingIndicator } from './review-loading-indicator';

describe('ReviewLoadingIndicator', () => {
  let component: ReviewLoadingIndicator;
  let fixture: ComponentFixture<ReviewLoadingIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewLoadingIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewLoadingIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
