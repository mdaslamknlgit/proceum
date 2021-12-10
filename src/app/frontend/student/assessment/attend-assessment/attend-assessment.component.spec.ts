import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendAssessmentComponent } from './attend-assessment.component';

describe('AttendAssessmentComponent', () => {
  let component: AttendAssessmentComponent;
  let fixture: ComponentFixture<AttendAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
