import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

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

  get numberOfRecords(): number {
    return this.testRecords.length;
  }

  get paginatedTestRecords() {
    return this.testRecords.slice(this.pageStart, this.pageEnd) ?? [];
  }

  trackByFn(i: number, t: TestResultModel) {
    return t.createdAt;
  }
}
