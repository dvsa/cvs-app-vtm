import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultModel } from '@app/models/test-result.model';

@Component({
  selector: 'vtm-emission-details',
  templateUrl: './emission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmissionDetailsComponent implements OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() editState: VIEW_STATE;
  @Input() hasEmissionApplicable: boolean;

  constructor() {}

  ngOnInit() {}
}
