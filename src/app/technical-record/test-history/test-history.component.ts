import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';

@Component({
  selector: 'vtm-test-history',
  templateUrl: './test-history.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestHistoryComponent implements OnInit {
  @Input() testResultJson: TestResultModel[];

  constructor() {}

  ngOnInit() {}
}
