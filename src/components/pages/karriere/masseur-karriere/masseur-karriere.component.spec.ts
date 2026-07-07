import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasseurKarriereComponent } from './masseur-karriere.component';

describe('MasseurKarriereComponent', () => {
  let component: MasseurKarriereComponent;
  let fixture: ComponentFixture<MasseurKarriereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasseurKarriereComponent]
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
