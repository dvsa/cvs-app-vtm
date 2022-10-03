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

  currentPage: number = 1;
  itemsPerPage = 5;
  pageStart = 0;
  pageEnd = 5;

  constructor(private cdr: ChangeDetectorRef) {}

  handlePaginationChange({ currentPage, itemsPerPage, start, end }: { currentPage: number; itemsPerPage: number; start: number; end: number }) {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.markForCheck();
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
