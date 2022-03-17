import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAdminReportComponent } from './assessment-admin-report.component';

describe('AssessmentAdminReportComponent', () => {
  let component: AssessmentAdminReportComponent;
  let fixture: ComponentFixture<AssessmentAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentAdminReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
