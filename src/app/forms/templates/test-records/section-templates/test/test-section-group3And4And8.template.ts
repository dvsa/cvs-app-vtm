import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { SpecialRefData } from '@services/multi-options/multi-options.service';

export const TestSectionGroup3And4And8: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'createdAt',
			label: 'Created',
			value: '',
			disabled: true,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.DATE,
			editType: FormNodeEditTypes.DATE,
		},
		{
			name: 'testStartTimestamp',
			label: 'Test Date',
			value: '',
			disabled: true,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.DATE,
			editType: FormNodeEditTypes.DATE,
		},
		{
			name: 'recalls',
			type: FormNodeTypes.GROUP,
			children: [
				{
					name: 'hasRecall',
					value: false,
					type: FormNodeTypes.CONTROL,
					viewType: FormNodeViewTypes.HIDDEN,
					editType: FormNodeEditTypes.HIDDEN,
				},
				{
					name: 'manufacturer',
					value: null,
					type: FormNodeTypes.CONTROL,
					viewType: FormNodeViewTypes.HIDDEN,
					editType: FormNodeEditTypes.HIDDEN,
				},
			],
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
						},
						{
							name: 'testResult',
							label: 'Result',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.RADIO,
							options: [
								{ value: 'pass', label: 'Pass' },
								{ value: 'fail', label: 'Fail' },
								{ value: 'abandoned', label: 'Abandoned' },
							],
							validators: [
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
								{
									name: ValidatorNames.HideIfNotEqual,
									args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' },
								},
							],
							asyncValidators: [{ name: AsyncValidatorNames.ResultDependantOnCustomDefects }],
							type: FormNodeTypes.CONTROL,
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
							referenceData: SpecialRefData.ReasonsForAbandoning,
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
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							value: '',
							disabled: true,
							label: 'Start time',
							viewType: FormNodeViewTypes.TIME,
						},
						{
							name: 'testTypeEndTimestamp',
							type: FormNodeTypes.CONTROL,
							value: '',
							disabled: true,
							label: 'End time',
							viewType: FormNodeViewTypes.TIME,
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
