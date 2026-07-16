import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MasseurKarriereComponent } from './masseur-karriere.component';

describe('MasseurKarriereComponent', () => {
  let component: MasseurKarriereComponent;
  let fixture: ComponentFixture<MasseurKarriereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasseurKarriereComponent],
      // The template uses routerLink; the spec needs a router context.
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasseurKarriereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
