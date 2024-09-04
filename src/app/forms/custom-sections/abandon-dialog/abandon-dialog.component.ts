import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TEST_TYPES_GROUP5_13 } from '@models/testTypeId.enum';
import { ValidatorNames } from '@models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { SpecialRefData } from '@services/multi-options/multi-options.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { BaseDialogComponent } from '@shared/components/base-dialog/base-dialog.component';
import merge from 'lodash.merge';
import { DynamicFormGroupComponent } from '../../components/dynamic-form-group/dynamic-form-group.component';

const ABANDON_FORM = (ReasonsForAbandoning: ReferenceDataResourceType | SpecialRefData): FormNode => ({
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
							editType: FormNodeEditTypes.CHECKBOXGROUP,
							delimited: { regex: '\\. (?<!\\..\\. )', separator: '. ' }, // the space is important here
							required: true,
							referenceData: ReasonsForAbandoning,
							validators: [{ name: ValidatorNames.Required }],
						},
						{
							name: 'additionalCommentsForAbandon',
							type: FormNodeTypes.CONTROL,
							required: true,
							label: 'Additional notes as to why this test was abandoned',
							editType: FormNodeEditTypes.TEXTAREA,
							validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 500 }],
						},
					],
				},
			],
		},
	],
});

@Component({
	selector: 'app-abandon-dialog',
	templateUrl: './abandon-dialog.component.html',
})
export class AbandonDialogComponent extends BaseDialogComponent implements OnInit {
	@ViewChild(DynamicFormGroupComponent) dynamicFormGroup?: DynamicFormGroupComponent;
	@Input() testResult?: TestResultModel;
	@Output() newTestResult = new EventEmitter<TestResultModel>();
	template?: FormNode;
	ngOnInit() {
		this.template = this.getTemplate();
	}

	getTemplate(): FormNode {
		const testTypeId = this.testResult?.testTypes[0].testTypeId ?? '';

		if (TEST_TYPES_GROUP5_13.includes(testTypeId)) {
			return ABANDON_FORM(ReferenceDataResourceType.TirReasonsForAbandoning);
		}
		if (TestRecordsService.getTestTypeGroup(testTypeId)?.includes('Specialist')) {
			return ABANDON_FORM(ReferenceDataResourceType.SpecialistReasonsForAbandoning);
		}
		return ABANDON_FORM(SpecialRefData.ReasonsForAbandoning);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleFormChange(event: any) {
		const latestTest = merge(this.testResult, event);
		if (latestTest && Object.keys(latestTest).length > 0) {
			this.newTestResult.emit(latestTest as TestResultModel);
		}
	}
}
