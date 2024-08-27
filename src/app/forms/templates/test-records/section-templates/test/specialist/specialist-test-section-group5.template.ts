import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { TEST_TYPES_GROUP5_SPEC_TEST } from '@forms/models/testTypeId.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const SpecialistTestSectionGroup5: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'createdAt',
			label: 'Created',
			disabled: true,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.DATE,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'testStartTimestamp',
			label: 'Test Date',
			value: '',
			disabled: true,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.DATE,
			editType: FormNodeEditTypes.HIDDEN,
		},
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
							name: 'testCode',
							label: 'Test Code',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
							width: FormNodeWidth.XS,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testResult',
							label: 'Result',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.RADIO,
							options: [
								{ value: 'pass', label: 'Pass' },
								{ value: 'fail', label: 'Fail' },
								{ value: 'prs', label: 'PRS' },
								{ value: 'abandoned', label: 'Abandoned' },
							],
							validators: [
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
								{
									name: ValidatorNames.HideIfNotEqual,
									args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' },
								},
							],
							asyncValidators: [
								{ name: AsyncValidatorNames.ResultDependantOnRequiredStandards },
								{
									name: AsyncValidatorNames.HideIfEqualsWithCondition,
									args: {
										sibling: 'certificateNumber',
										value: 'fail',
										conditions: { field: 'testTypeId', operator: 'equals', value: TEST_TYPES_GROUP5_SPEC_TEST },
									},
								},
							],
							type: FormNodeTypes.CONTROL,
						},
						{
							name: 'reasonForAbandoning',
							type: FormNodeTypes.CONTROL,
							label: 'Reason for abandoning',
							editType: FormNodeEditTypes.CHECKBOXGROUP,
							delimited: { regex: '\\. (?<!\\..\\. )', separator: '. ' },
							required: true,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'testResult', value: ['abandoned'] },
								},
							],
							referenceData: ReferenceDataResourceType.SpecialistReasonsForAbandoning,
						},
						{
							name: 'additionalCommentsForAbandon',
							type: FormNodeTypes.CONTROL,
							value: '',
							required: true,
							label: 'Additional details for abandoning',
							editType: FormNodeEditTypes.TEXTAREA,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'testResult', value: ['abandoned'] },
								},
								{ name: ValidatorNames.MaxLength, args: 500 },
							],
						},
						{
							name: 'testTypeName',
							label: 'Description',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
						},
						{
							name: 'testNumber',
							label: 'Test Number',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'certificateNumber',
							label: 'Certificate number',
							value: null,
							type: FormNodeTypes.CONTROL,
							required: true,
							viewType: FormNodeViewTypes.STRING,
							editType: FormNodeEditTypes.TEXT,
							validators: [
								{ name: ValidatorNames.Alphanumeric },
								{
									name: ValidatorNames.RequiredIfEquals,
									args: {
										sibling: 'testResult',
										value: ['pass', 'prs'],
									},
								},
							],
						},
						{
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							value: '',
							label: 'Start time',
							viewType: FormNodeViewTypes.TIME,
							editType: FormNodeEditTypes.DATETIME,
							validators: [
								{ name: ValidatorNames.Required },
								{ name: ValidatorNames.PastDate },
								{ name: ValidatorNames.CopyValueToRootControl, args: 'testStartTimestamp' },
							],
						},
						{
							name: 'testTypeEndTimestamp',
							type: FormNodeTypes.CONTROL,
							value: '',
							label: 'End time',
							viewType: FormNodeViewTypes.TIME,
							editType: FormNodeEditTypes.DATETIME,
							validators: [
								{ name: ValidatorNames.Required },
								{ name: ValidatorNames.PastDate },
								{ name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' },
								{ name: ValidatorNames.CopyValueToRootControl, args: 'testEndTimestamp' },
							],
						},
						{
							name: 'prohibitionIssued',
							type: FormNodeTypes.CONTROL,
							label: 'Prohibition issued',
							value: null,
							editType: FormNodeEditTypes.RADIO,
							options: [
								{ value: true, label: 'Yes' },
								{ value: false, label: 'No' },
							],
							validators: [{ name: ValidatorNames.Required }],
						},
					],
				},
			],
		},
	],
};
