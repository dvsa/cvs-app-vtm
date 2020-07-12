import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';

@Component({
  selector: 'vtm-test-history',
  templateUrl: './test-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestHistoryComponent implements OnInit {
  @Input() testResultJson: TestResultModel[];
  @Output() viewTestRecord = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  viewTest() {
    this.viewTestRecord.emit();
  }
}
