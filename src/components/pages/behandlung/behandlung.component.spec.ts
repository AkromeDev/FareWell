import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehandlungComponent } from './behandlung.component';

describe('BehandlungComponent', () => {
  let component: BehandlungComponent;
  let fixture: ComponentFixture<BehandlungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BehandlungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BehandlungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
