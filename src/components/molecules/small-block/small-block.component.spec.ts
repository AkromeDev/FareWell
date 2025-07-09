import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallBlockComponent } from './small-block.component';

describe('SmallBlockComponent', () => {
  let component: SmallBlockComponent;
  let fixture: ComponentFixture<SmallBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SmallBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
