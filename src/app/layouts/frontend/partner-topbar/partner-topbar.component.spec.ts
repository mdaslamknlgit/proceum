import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerTopbarComponent } from './partner-topbar.component';

describe('PartnerTopbarComponent', () => {
  let component: PartnerTopbarComponent;
  let fixture: ComponentFixture<PartnerTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
