import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { KavitationComponent } from './kavitation';

describe('Kavitation', () => {
  let component: KavitationComponent;
  let fixture: ComponentFixture<KavitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KavitationComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(KavitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
