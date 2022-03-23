import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocVideosComponent } from './poc-videos.component';

describe('PocVideosComponent', () => {
  let component: PocVideosComponent;
  let fixture: ComponentFixture<PocVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PocVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
