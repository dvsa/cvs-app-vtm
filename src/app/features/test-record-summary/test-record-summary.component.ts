import { Component, Input } from '@angular/core';
import { TestResultModel } from '../../models/test-result.model';

@Component({
  selector: 'app-test-record-summary',
  templateUrl: './test-record-summary.component.html',
  styleUrls: ['./test-record-summary.component.scss']
})
export class TestRecordSummaryComponent {
 
  @Input() testRecords: TestResultModel[] | null = [];

  constructor() {}
}
