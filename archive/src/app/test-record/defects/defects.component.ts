import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { TestTypesApplicable } from '@app/test-record/test-record.mapper';

@Component({
  selector: 'vtm-defects',
  templateUrl: './defects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefectsComponent implements OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() testTypesApplicable: TestTypesApplicable;

  constructor() {}

  ngOnInit() {}
}
