import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestRecordSummaryComponent } from './test-record-summary.component';
import { TestResultModel } from '../../models/test-result.model';
import { TestType } from '@models/test-type.model';

const fakeRecord: TestResultModel = {
  testResultId: 'test',
  systemNumber: 'test',
  testStartTimestamp: 'testStartTimestamp',
  testResult: 'testStatus',
  testTypes: [],
  vin: 'vin'
};

const testType: TestType = {
  testTypeName: 'name',
  testCode: '',
  testNumber: '',
  testExpiryDate: '',
  testTypeStartTimestamp: '',
  certificateNumber: ''
}

const fakeRecordMultipleTestTypes: TestResultModel = {
  testResultId: 'test',
  systemNumber: 'test',
  testStartTimestamp: 'testStartTimestamp',
  testResult: 'testStatus',
  testTypes: [testType,testType],
  vin: 'vin'
};

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show table if no records found', () => {
    component.testRecords = [];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.innerHTML).toBe('No test records found.');

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeFalsy();
  });

  it('should show table if records found', () => {
    component.testRecords = [fakeRecord];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeTruthy();
  });

  it('should concatinate multiple test types', () => {
    const testTypeNames = component.getTestTypeName(fakeRecordMultipleTestTypes)
    expect(testTypeNames).toEqual('name,name')
  });
});
