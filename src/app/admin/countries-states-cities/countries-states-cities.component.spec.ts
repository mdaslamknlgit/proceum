import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesStatesCitiesComponent } from './countries-states-cities.component';

describe('CountriesStatesCitiesComponent', () => {
  let component: CountriesStatesCitiesComponent;
  let fixture: ComponentFixture<CountriesStatesCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountriesStatesCitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesStatesCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
