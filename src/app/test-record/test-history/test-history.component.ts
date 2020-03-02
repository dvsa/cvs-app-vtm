import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-test-history',
  templateUrl: './test-history.component.html',
  styleUrls: ['./test-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestHistoryComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  @Input() editState: VIEW_STATE;

  constructor() {}

  ngOnInit() {
  }
}
