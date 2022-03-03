import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceUserSidebarComponent } from './finance-user-sidebar.component';

describe('FinanceUserSidebarComponent', () => {
  let component: FinanceUserSidebarComponent;
  let fixture: ComponentFixture<FinanceUserSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceUserSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceUserSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
