import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MicroneedlingComponent } from './microneedling';

describe('MicroneedlingComponent', () => {
  let component: MicroneedlingComponent;
  let fixture: ComponentFixture<MicroneedlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroneedlingComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroneedlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
