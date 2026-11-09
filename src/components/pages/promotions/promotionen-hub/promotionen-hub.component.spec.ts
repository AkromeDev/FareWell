import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PromotionenHubComponent } from './promotionen-hub.component';

describe('PromotionenHubComponent', () => {
  let fixture: ComponentFixture<PromotionenHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionenHubComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionenHubComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
