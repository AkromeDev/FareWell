import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarewellToggleComponent } from './farewell-toggle.component';

describe('FarewellToggleComponent', () => {
  let component: FarewellToggleComponent;
  let fixture: ComponentFixture<FarewellToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarewellToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarewellToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
