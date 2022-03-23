import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardgalleryComponent } from './whiteboardgallery.component';

describe('WhiteboardgalleryComponent', () => {
  let component: WhiteboardgalleryComponent;
  let fixture: ComponentFixture<WhiteboardgalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhiteboardgalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardgalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
