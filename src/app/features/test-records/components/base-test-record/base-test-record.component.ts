import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-result.model';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent {
  @ViewChildren(DynamicFormGroupComponent) dynamicFormGroupComponents?: QueryList<DynamicFormGroupComponent>;
  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;

  constructor() {}

  generateTemplate(): FormNode[] | undefined {
    const { vehicleType } = this.testResult;

    if (!vehicleType || !masterTpl.hasOwnProperty(vehicleType) || this.testResult.testTypes.length == 0) {
      return undefined;
    }

    const testTypeId = this.testResult.testTypes[0].testTypeId;
    const vehicleTpl: Partial<Record<string | 'default', Record<string, FormNode>>> = masterTpl[vehicleType];

    const tpl = testTypeId && vehicleTpl.hasOwnProperty(testTypeId)
      ? vehicleTpl[testTypeId]
      : vehicleTpl['default'];

    return tpl && Object.values(tpl);
  }
}
