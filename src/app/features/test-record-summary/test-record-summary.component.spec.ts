import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestRecordSummaryComponent } from './test-record-summary.component';
import { createMock, createMockList } from 'ts-auto-mock';
import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test-type.model';

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
    component.testRecords = [createMock<TestResultModel>()];
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const table = fixture.debugElement.query(By.css('.govuk-table__body'));
    expect(table).toBeTruthy();
  });

  it('should concatinate multiple test types', () => {
    const testTypeNames = component.getTestTypeName(createMock<TestResultModel>({
      testTypes: createMockList<TestType>(2, (itr) => createMock<TestType>({
        testTypeName: 'name',
      }))
    }))
    expect(testTypeNames).toEqual('name,name')
  });
});
