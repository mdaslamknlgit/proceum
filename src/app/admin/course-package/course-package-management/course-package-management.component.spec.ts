import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePackageManagementComponent } from './course-package-management.component';

describe('CoursePackageManagementComponent', () => {
  let component: CoursePackageManagementComponent;
  let fixture: ComponentFixture<CoursePackageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursePackageManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePackageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
