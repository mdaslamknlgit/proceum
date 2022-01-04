import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildPartnersComponent } from './child-partners.component';

describe('ChildPartnersComponent', () => {
  let component: ChildPartnersComponent;
  let fixture: ComponentFixture<ChildPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
