import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { mockTestResult } from '@mocks/mock-test-result';
import { mockTestType } from '@mocks/mock-test-types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { SharedModule } from '@shared/shared.module';
import { TestRecordSummaryComponent } from './test-record-summary.component';

describe('TestRecordSummaryComponent', () => {
  let component: TestRecordSummaryComponent;
  let fixture: ComponentFixture<TestRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRecordSummaryComponent],
      imports: [RouterTestingModule, SharedModule],
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
    component.testResults = [];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.innerHTML).toBe('No test records found.');

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeFalsy();
  });

  it('should show table if records found', () => {
    component.testResults = [mockTestResult(0)];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeTruthy();
  });

  it('should concatinate multiple test types', () => {
    const testTypeNames = component.getTestTypeName(
      mockTestResult(0, {
        testTypes: [
          mockTestType({ testTypeName: 'name' }),
          mockTestType({ testTypeName: 'name' }),
        ],
      }),
    );
    expect(testTypeNames).toBe('name,name');
  });

  it('should concatinate multiple test results', () => {
    const testTypeResults = component.getTestTypeResults(
      mockTestResult(0, {
        testTypes: [
          mockTestType({ testResult: resultOfTestEnum.pass }),
          mockTestType({ testResult: resultOfTestEnum.pass }),
        ],
      }),
    );
    expect(testTypeResults).toBe('pass,pass');
  });

  it('should retrieve all testTypes and creates sorted TestField[]', () => {
    const mockRecords = [
      {
        testResultId: '1',
        testTypes: [
          {
            testTypeStartTimestamp: new Date('12/12/2022').toISOString(),
            testNumber: '1',
            testResult: resultOfTestEnum.pass,
            testTypeName: 'annual',
          },
          {
            testTypeStartTimestamp: new Date('12/12/2023').toISOString(),
            testNumber: '2',
            testResult: resultOfTestEnum.pass,
            testTypeName: 'annual',
          },
        ],
      },
      {
        testResultId: '1',
        testTypes: [
          {
            testTypeStartTimestamp: new Date('12/12/2021').toISOString(),
            testNumber: '1',
            testResult: resultOfTestEnum.pass,
            testTypeName: 'annual',
          },
        ],
      },
    ] as TestResultModel[];
    component.testResults = mockRecords;
    const testFieldResults = component.sortedTestTypeFields;

    expect(testFieldResults).toHaveLength(3);

    expect(testFieldResults[0].testTypeStartTimestamp).toBe(mockRecords[0].testTypes[1].testTypeStartTimestamp);
    expect(testFieldResults[1].testTypeStartTimestamp).toBe(mockRecords[0].testTypes[0].testTypeStartTimestamp);
    expect(testFieldResults[2].testTypeStartTimestamp).toBe(mockRecords[1].testTypes[0].testTypeStartTimestamp);
  });
});
