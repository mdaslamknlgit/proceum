import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLeadComponent } from './approve-lead.component';

describe('ApproveLeadComponent', () => {
  let component: ApproveLeadComponent;
  let fixture: ComponentFixture<ApproveLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveLeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
