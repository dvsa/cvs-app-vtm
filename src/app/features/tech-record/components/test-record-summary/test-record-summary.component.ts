import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TestType, resultOfTestEnum } from '@models/test-types/test-type.model';
import { testTypeIdChanged } from '@store/test-records';

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
  @Input() vehicleTechRecord?: VehicleTechRecordModel;

  pageStart?: number;
  pageEnd?: number;

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
    const arr: TestField[] = [];

    this.testRecords.forEach(record =>
      record.testTypes.forEach(t => {
        const field: TestField = {
          testTypeStartTimestamp: t.testTypeStartTimestamp,
          testTypeName: t.testTypeName,
          testNumber: t.testNumber,
          testResult: t.testResult,
          testResultId: record.testResultId
        };
        arr.push(field);
      })
    );

    return arr.sort((a, b) => new Date(b.testTypeStartTimestamp).getTime() - new Date(a.testTypeStartTimestamp).getTime());
  }

  get numberOfRecords(): number {
    return this.testRecords.length;
  }

  get paginatedTestFields() {
    return this.sortedTestTypeFields.slice(this.pageStart, this.pageEnd) ?? [];
  }

  get paginatedTestRecords() {
    return this.testRecords.slice(this.pageStart, this.pageEnd) ?? [];
  }

  trackByFn(i: number, t: TestField) {
    return t.testNumber;
  }
}
