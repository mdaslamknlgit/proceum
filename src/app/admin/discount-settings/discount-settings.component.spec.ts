import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSettingsComponent } from './discount-settings.component';

describe('DiscountSettingsComponent', () => {
  let component: DiscountSettingsComponent;
  let fixture: ComponentFixture<DiscountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
