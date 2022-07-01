import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-result.model';
import { TestCodes } from '@models/testCodes.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-base-test-record',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent {
  @ViewChildren(DynamicFormGroupComponent) dynamicFormGroupComponents?: QueryList<DynamicFormGroupComponent>;
  @Input() testResult: TestResultModel | undefined = undefined;
  @Input() edit: boolean = false;

  constructor() {}

  generateTemplate(): FormNode[] | undefined {
    if (this.testResult) {
      const { vehicleType, testCode } = this.testResult;
      if (vehicleType && masterTpl.hasOwnProperty(vehicleType)) {
        const vehicleTpl: Partial<Record<TestCodes | 'default', Record<string, FormNode>>> = masterTpl[vehicleType as VehicleTypes];
        if (testCode && vehicleTpl.hasOwnProperty(testCode)) {
          const tpl = vehicleTpl[testCode as TestCodes];
          return tpl && Object.values(tpl);
        } else {
          const tpl: Record<string, FormNode> | undefined = vehicleTpl['default'];
          return tpl && Object.values(tpl);
        }
      }
    }
    return undefined;
  }
}
