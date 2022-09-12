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

  constructor() {}

  getTestTypeName(testResult: TestResultModel) {
    return testResult.testTypes.map(t => t.testTypeName).join(',');
  }

  getTestTypeResults(testResult: TestResultModel) {
    return testResult.testTypes.map(t => t.testResult).join(',');
  }
}
