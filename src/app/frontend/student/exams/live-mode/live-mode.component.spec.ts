import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveModeComponent } from './live-mode.component';

describe('LiveModeComponent', () => {
  let component: LiveModeComponent;
  let fixture: ComponentFixture<LiveModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
