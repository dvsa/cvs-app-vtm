import { Component, Input, OnInit } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';

@Component({
  selector: 'app-test-amendment-history',
  templateUrl: './test-amendment-history.component.html',
  styleUrls: ['./test-amendment-history.component.scss']
})
export class TestAmendmentHistoryComponent implements OnInit {
  @Input() testRecords: TestResultModel | undefined;

  constructor() { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getTestTypeName(testResult: TestResultModel) {
    return testResult.testTypes.map((t) => t.testTypeName).join(',');
  }

  getTestTypeResults(testResult: TestResultModel) {
    return testResult.testTypes.map((t) => t.testResult).join(',');
  }

}
