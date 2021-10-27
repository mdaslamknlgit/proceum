import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbankComponent } from './qbank.component';

describe('QbankComponent', () => {
  let component: QbankComponent;
  let fixture: ComponentFixture<QbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
