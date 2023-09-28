import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input,
} from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { Roles } from '@models/roles.enum';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';

interface TestField {
  testTypeStartTimestamp: string | Date;
  testTypeName: string;
  testNumber: string;
  testResult: resultOfTestEnum;
  testResultId: string;
  testResultStatus?: TestResultStatus;
}

@Component({
  selector: 'app-test-record-summary',
  templateUrl: './test-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRecordSummaryComponent {
  @Input() isEditing = false;
  @Input() testResults: TestResultModel[] = [];

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  public get roles(): typeof Roles {
    return Roles;
  }

  get numberOfRecords(): number {
    return this.testResults.length;
  }

  get paginatedTestFields(): TestField[] {
    return this.sortedTestTypeFields.slice(this.pageStart, this.pageEnd);
  }

  get sortedTestTypeFields(): TestField[] {
    const byDate = (a: TestField, b: TestField) => new Date(b.testTypeStartTimestamp).getTime() - new Date(a.testTypeStartTimestamp).getTime();

    return this.testResults
      .flatMap((record) =>
        record.testTypes.map((testType) => ({
          testTypeStartTimestamp: testType.testTypeStartTimestamp,
          testTypeName: testType.testTypeName,
          testNumber: testType.testNumber,
          testResult: testType.testResult,
          testResultId: record.testResultId,
          testResultStatus: record.testStatus,
        })))
      .sort(byDate);
  }

  getResult(test: TestField): string {
    return test.testResultStatus === TestResultStatus.CANCELLED ? TestResultStatus.CANCELLED : test.testResult;
  }

  getTestTypeName(testResult: TestResultModel): string {
    return testResult.testTypes.map((t) => t.testTypeName).join(',');
  }

  getTestTypeResults(testResult: TestResultModel): string {
    return testResult.testTypes.map((t) => t.testResult).join(',');
  }

  trackByFn(i: number, t: TestField): string {
    return t.testNumber;
  }

  handlePaginationChange({ start, end }: { start: number; end: number }): void {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
}
