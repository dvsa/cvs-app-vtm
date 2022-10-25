import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';

interface TestField {
  testTypeStartTimestamp: string | Date;
  testTypeName: string;
  testNumber: string;
  testResult: resultOfTestEnum;
  testResultId: string;
}

@Component({
  selector: 'app-test-record-summary',
  templateUrl: './test-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordSummaryComponent {
  @Input() testRecords: TestResultModel[] = [];
  @Input() currentTechRecord?: TechRecordModel;


  pageStart?: number;
  pageEnd?: number;

  get isArchived(): boolean {
    return !(this.currentTechRecord?.statusCode === StatusCodes.CURRENT || this.currentTechRecord?.statusCode === StatusCodes.PROVISIONAL);
  }

  constructor(private cdr: ChangeDetectorRef) {}

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  getTestTypeName(testResult: TestResultModel) {
    return testResult.testTypes.map(t => t.testTypeName).join(',');
  }

  getTestTypeResults(testResult: TestResultModel) {
    return testResult.testTypes.map(t => t.testResult).join(',');
  }

  get sortedTestTypeFields(): TestField[] {
    const byDate = (a: TestField, b: TestField) => new Date(b.testTypeStartTimestamp).getTime() - new Date(a.testTypeStartTimestamp).getTime();

    return this.testRecords
      .flatMap(record =>
        record.testTypes.map(testType => ({
          testTypeStartTimestamp: testType.testTypeStartTimestamp,
          testTypeName: testType.testTypeName,
          testNumber: testType.testNumber,
          testResult: testType.testResult,
          testResultId: record.testResultId
        }))
      )
      .sort(byDate);
  }

  get numberOfRecords(): number {
    return this.testRecords.length;
  }

  get paginatedTestFields() {
    return this.sortedTestTypeFields.slice(this.pageStart, this.pageEnd);
  }

  trackByFn(i: number, t: TestField) {
    return t.testNumber;
  }
}
