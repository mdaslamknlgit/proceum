import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCollegesComponent } from './list-colleges.component';

describe('ListCollegesComponent', () => {
  let component: ListCollegesComponent;
  let fixture: ComponentFixture<ListCollegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCollegesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
