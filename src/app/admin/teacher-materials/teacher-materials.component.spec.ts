import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMaterialsComponent } from './teacher-materials.component';

describe('TeacherMaterialsComponent', () => {
  let component: TeacherMaterialsComponent;
  let fixture: ComponentFixture<TeacherMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
