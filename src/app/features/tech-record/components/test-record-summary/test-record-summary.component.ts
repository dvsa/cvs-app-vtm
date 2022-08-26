import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { v4 as uuidv4 } from 'uuid';

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

  get newTestResultId() {
    return uuidv4();
  }
}
