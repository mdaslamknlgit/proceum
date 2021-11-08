import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageYearsSemestersGroupsComponent } from './manage-years-semesters-groups.component';

describe('ManageYearsSemestersGroupsComponent', () => {
  let component: ManageYearsSemestersGroupsComponent;
  let fixture: ComponentFixture<ManageYearsSemestersGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageYearsSemestersGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageYearsSemestersGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
