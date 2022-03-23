import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUniversitiesCollegesComponent } from './list-universities-colleges.component';

describe('ListUniversitiesCollegesComponent', () => {
  let component: ListUniversitiesCollegesComponent;
  let fixture: ComponentFixture<ListUniversitiesCollegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUniversitiesCollegesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUniversitiesCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
