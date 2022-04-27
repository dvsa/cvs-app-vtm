import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestRecordSummaryComponent } from './test-record-summary.component';
import { TestResultModel } from '../../models/test-result.model';
import { RouterTestingModule } from '@angular/router/testing';

const fakeRecord: TestResultModel = {
  testResultId: 'test',
  systemNumber: 'test',
  testStartTimestamp: new Date(),
  testStatus: 'testStatus',
  testTypes: [],
  vin: 'vin'
};

describe('TestRecordSummaryComponent', () => {
  let component: TestRecordSummaryComponent;
  let fixture: ComponentFixture<TestRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRecordSummaryComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no records found', () => {
    component.testRecords = [];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.innerHTML).toBe('No test records found.');

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeFalsy();
  });

  it('should show records found', () => {
    component.testRecords = [fakeRecord];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeTruthy();
  });
});
