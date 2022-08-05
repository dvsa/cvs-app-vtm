import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { TestTypeSelectComponent } from '@forms/components/test-type-select/test-type-select.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { State } from '@store/.';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

@Component({
  selector: 'app-base-test-record[testResult]',
  templateUrl: './base-test-record.component.html'
})
export class BaseTestRecordComponent implements OnInit {
  @ViewChildren(DynamicFormGroupComponent) set dynamicFormGroupComponents(sections: QueryList<DynamicFormGroupComponent>) {
    sections.forEach(section => this.sectionForms.push(section.form as CustomFormGroup));
  }
  @ViewChild(DefectsComponent) set defects(defectsComponent: DefectsComponent) {
    defectsComponent && defectsComponent.form && this.sectionForms.push(defectsComponent.form);
  }
  @ViewChild(TestTypeSelectComponent) set testTypeSelect(testTypeSelectComponent: TestTypeSelectComponent) {
    testTypeSelectComponent && testTypeSelectComponent.form && this.sectionForms.push(testTypeSelectComponent.form);
  }
  @Input() testResult!: TestResultModel;
  @Input() isEditing: boolean = false;

  sectionForms: CustomFormGroup[] = [];
  testResultCopy: TestResultModel = {} as TestResultModel;

  constructor(private dynamicFormService: DynamicFormService, private store: Store<State>) {}

  ngOnInit(): void {
    this.testResultCopy = cloneDeep(this.testResult);
  }

  generateTemplate(): FormNode[] | undefined {
    const { vehicleType } = this.testResultCopy;
    if (!vehicleType || !masterTpl.hasOwnProperty(vehicleType) || this.testResultCopy.testTypes.length == 0) {
      return undefined;
    }
    const testTypeId = this.testResultCopy.testTypes[0].testTypeId;
    const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);
    const vehicleTpl = masterTpl[vehicleType as VehicleTypes];
    const tpl =
      testTypeGroup && vehicleTpl.hasOwnProperty(testTypeGroup) ? vehicleTpl[testTypeGroup] : this.isEditing ? undefined : vehicleTpl['default'];
    return tpl && Object.values(tpl);
  }

  getFormForTemplate(template: FormNode): CustomFormGroup {
    const form = this.dynamicFormService.createForm(template, this.testResultCopy) as CustomFormGroup;
    this.sectionForms.push(form);
    return form;
  }

  handleTestTypeIdChangeOrSomething(event: string): void {
    this.testResultCopy.testTypes[0].testTypeId = event;
  }

  handleFormChange(event: any) {
    const newTest = merge(this.testResultCopy, event);
  }
}
