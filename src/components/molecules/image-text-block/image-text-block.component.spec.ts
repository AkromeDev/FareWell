import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTextBlockComponent } from './image-text-block.component';

describe('ImageTextBlockComponent', () => {
  let component: ImageTextBlockComponent;
  let fixture: ComponentFixture<ImageTextBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageTextBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageTextBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
