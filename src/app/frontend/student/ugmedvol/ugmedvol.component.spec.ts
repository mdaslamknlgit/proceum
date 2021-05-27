import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgmedvolComponent } from './ugmedvol.component';

describe('UgmedvolComponent', () => {
  let component: UgmedvolComponent;
  let fixture: ComponentFixture<UgmedvolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UgmedvolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UgmedvolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
