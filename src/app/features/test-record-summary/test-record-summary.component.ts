import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TestResultModel } from '../../models/test-result.model';

@Component({
  selector: 'app-test-record-summary',
  templateUrl: './test-record-summary.component.html',
  styleUrls: ['./test-record-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordSummaryComponent {
  @Input() testRecords: TestResultModel[] = [];

  constructor() {}

  getTestTypeName(testResult: TestResultModel) {
    return testResult.testTypes.map((t) => t.testTypeName).join(',');
  }

  getTestTypeResults(testResult: TestResultModel) {
    return testResult.testTypes.map((t) => t.testResult).join(',');
  }
}
