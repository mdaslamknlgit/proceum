import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalSettingsComponent } from './promotional-settings.component';

describe('PromotionalSettingsComponent', () => {
  let component: PromotionalSettingsComponent;
  let fixture: ComponentFixture<PromotionalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionalSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
