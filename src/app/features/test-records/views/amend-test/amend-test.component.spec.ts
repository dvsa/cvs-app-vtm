import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendTestComponent } from './amend-test.component';

describe('AmendTestComponent', () => {
  let component: AmendTestComponent;
  let fixture: ComponentFixture<AmendTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
