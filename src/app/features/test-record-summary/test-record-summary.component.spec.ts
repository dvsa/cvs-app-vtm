import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRecordSummaryComponent } from './test-record-summary.component';

describe('TestRecordSummaryComponent', () => {
  let component: TestRecordSummaryComponent;
  let fixture: ComponentFixture<TestRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRecordSummaryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
