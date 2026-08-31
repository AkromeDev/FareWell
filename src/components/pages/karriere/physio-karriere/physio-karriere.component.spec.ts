import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PhysioKarriereComponent } from './physio-karriere.component';

describe('PhysioKarriereComponent', () => {
  let component: PhysioKarriereComponent;
  let fixture: ComponentFixture<PhysioKarriereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysioKarriereComponent],
      // The template uses routerLink; the spec needs a router context.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PhysioKarriereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
