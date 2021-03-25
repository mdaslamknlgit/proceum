import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeEmailComponent } from './unsubscribe-email.component';

describe('UnsubscribeEmailComponent', () => {
  let component: UnsubscribeEmailComponent;
  let fixture: ComponentFixture<UnsubscribeEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsubscribeEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
