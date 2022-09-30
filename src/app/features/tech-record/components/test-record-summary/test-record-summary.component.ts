import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input() currentPage: number = 1;

  itemsPerPage = 5;

  constructor() {}

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
    return this.testRecords.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage) ?? [];
  }

  trackByFn(i: number, t: TestResultModel) {
    return t.createdAt;
  }
}
