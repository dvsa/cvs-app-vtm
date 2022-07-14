import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-base-test-record',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent {
  @ViewChildren(DynamicFormGroupComponent) set dynamicFormGroupComponents(sections: QueryList<DynamicFormGroupComponent>) {
    sections.forEach(section => this.sectionForms.push(section.form as CustomFormGroup));
  }
  @Input() testResult: TestResultModel | undefined = undefined;
  @Input() isEditing: boolean = false;

  sectionForms: CustomFormGroup[] = [];

  constructor(private dynamicFormService: DynamicFormService) {}

  generateTemplate(): FormNode[] | undefined {
    if (this.testResult) {
      const { vehicleType } = this.testResult;
      const testTypeId = this.testResult.testTypes[0].testTypeId;
      if (vehicleType && masterTpl.hasOwnProperty(vehicleType)) {
        const vehicleTpl: Partial<Record<string | 'default', Record<string, FormNode>>> = masterTpl[vehicleType as VehicleTypes];
        if (testTypeId && vehicleTpl.hasOwnProperty(testTypeId)) {
          const tpl = vehicleTpl[testTypeId];
          return tpl && Object.values(tpl);
        } else {
          const tpl: Record<string, FormNode> | undefined = vehicleTpl['default'];
          return tpl && Object.values(tpl);
        }
      }
    }
    return undefined;
  }

  getFormForTemplate(template: FormNode): CustomFormGroup {
    const form = this.dynamicFormService.createForm(template, this.testResult) as CustomFormGroup;
    this.sectionForms.push(form);
    return form;
  }
}
