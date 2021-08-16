import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSemestersComponent } from './list-semesters.component';

describe('ListSemestersComponent', () => {
  let component: ListSemestersComponent;
  let fixture: ComponentFixture<ListSemestersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSemestersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSemestersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
