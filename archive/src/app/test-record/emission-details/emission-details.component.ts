import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultModel } from '@app/models/test-result.model';

@Component({
  selector: 'vtm-emission-details',
  templateUrl: './emission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmissionDetailsComponent implements OnChanges {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() editState: VIEW_STATE;
  @Input() hasEmissionApplicable: boolean;
  editModTypeUsed: boolean;
  editParticulate: boolean;
  modTypeValue: string;

  constructor() {}

  ngOnChanges() {
    this.modTypeValue = !!this.testType.modType
      ? this.testType.modType.code + ' - ' + this.testType.modType.description
      : '';

    this.editParticulate = this.modTypeValue === 'p - particulate trap';
    this.editModTypeUsed =
      this.modTypeValue === 'g - gas engine' ||
      this.modTypeValue === 'm - modification or change of engine';
  }
}
