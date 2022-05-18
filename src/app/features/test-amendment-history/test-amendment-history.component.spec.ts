import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAmendmentHistoryComponent } from './test-amendment-history.component';

describe('TestAmendmentHistoryComponent', () => {
  let component: TestAmendmentHistoryComponent;
  let fixture: ComponentFixture<TestAmendmentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAmendmentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAmendmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
