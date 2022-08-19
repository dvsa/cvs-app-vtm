import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TestResultModel } from '@models/test-result.model';
import { resultOfTestEnum, TestType } from '@models/test-type.model';
import { createMock, createMockList } from 'ts-auto-mock';
import { TestRecordSummaryComponent } from './test-record-summary.component';

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
    component.testRecords = [createMock<TestResultModel>()];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeTruthy();
  });

  it('should concatinate multiple test types', () => {
    const testTypeNames = component.getTestTypeName(
      createMock<TestResultModel>({
        testTypes: createMockList<TestType>(2, itr =>
          createMock<TestType>({
            testTypeName: 'name'
          })
        )
      })
    );
    expect(testTypeNames).toEqual('name,name');
  });

  it('should concatinate multiple test results', () => {
    const testTypeResults = component.getTestTypeResults(
      createMock<TestResultModel>({
        testTypes: createMockList<TestType>(2, itr =>
          createMock<TestType>({
            testResult: resultOfTestEnum.pass
          })
        )
      })
    );
    expect(testTypeResults).toEqual('pass,pass');
  });
});
