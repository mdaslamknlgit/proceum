import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceumLibraryComponent } from './proceum-library.component';

describe('ProceumLibraryComponent', () => {
  let component: ProceumLibraryComponent;
  let fixture: ComponentFixture<ProceumLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceumLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceumLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
