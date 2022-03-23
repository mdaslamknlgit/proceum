import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTestimonialsComponent } from './package-testimonials.component';

describe('PackageTestimonialsComponent', () => {
  let component: PackageTestimonialsComponent;
  let fixture: ComponentFixture<PackageTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageTestimonialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
