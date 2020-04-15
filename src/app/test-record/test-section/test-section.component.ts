import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-test-section',
  templateUrl: './test-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSectionComponent implements OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() testTypesApplicable: TestTypesApplicable;
  @Input() editState: VIEW_STATE;

  constructor() {}

  ngOnInit() {}
}
