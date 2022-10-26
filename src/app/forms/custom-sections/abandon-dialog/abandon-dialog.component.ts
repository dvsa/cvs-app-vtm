import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { BaseDialogComponent } from '@shared/components/base-dialog/base-dialog.component';
import merge from 'lodash.merge';
import { DynamicFormGroupComponent } from '../../components/dynamic-form-group/dynamic-form-group.component';

const ABANDON_FORM: FormNode = {
  name: 'abandonSection',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testTypes',
      label: 'Test Types',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0', // it is important here that the name of the node for an ARRAY type should be an index value
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Why was this test abandoned?',
              hint: 'Select all that apply.',
              editType: FormNodeEditTypes.CHECKBOX,
              delimited: { regex: '\\. (?<!\\..\\. )', separator: '. ' }, // the space is important here
              required: true,
              referenceData: ReferenceDataResourceType.ReasonsForAbandoning,
              validators: [{ name: ValidatorNames.Required }]
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              required: true,
              label: 'Additional notes as to why this test was abandoned',
              editType: FormNodeEditTypes.TEXTAREA,
              validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 500 }]
            }
          ]
        }
      ]
    }
  ]
};

@Component({
  selector: 'app-abandon-dialog',
  templateUrl: './abandon-dialog.component.html'
})
export class AbandonDialogComponent extends BaseDialogComponent {
  @ViewChild(DynamicFormGroupComponent) dynamicFormGroup?: DynamicFormGroupComponent;
  @Input() testResult?: TestResultModel;
  @Output() newTestResult = new EventEmitter<TestResultModel>();
  template = ABANDON_FORM;

  handleFormChange(event: any) {
    let latestTest: any;
    latestTest = merge(latestTest, this.testResult, event);
    latestTest && Object.keys(latestTest).length > 0 && this.newTestResult.emit(latestTest as TestResultModel);
  }
}
