import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUniversitiesCollegesComponent } from './create-universities-colleges.component';

describe('CreateUniversitiesCollegesComponent', () => {
  let component: CreateUniversitiesCollegesComponent;
  let fixture: ComponentFixture<CreateUniversitiesCollegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUniversitiesCollegesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUniversitiesCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
