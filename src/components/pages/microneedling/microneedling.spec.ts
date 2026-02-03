import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MicroneedlingComponent } from './microneedling';

describe('MicroneedlingComponent', () => {
  let component: MicroneedlingComponent;
  let fixture: ComponentFixture<MicroneedlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroneedlingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroneedlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
