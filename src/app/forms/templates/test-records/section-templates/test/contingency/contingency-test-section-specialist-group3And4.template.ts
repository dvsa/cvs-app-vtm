import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const ContingencyTestSectionSpecialistGroup3And4: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'contingencyTestNumber',
			label: 'Contingency Test Number',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.NUMERICSTRING,
			validators: [
				{ name: ValidatorNames.MaxLength, args: 8 },
				{ name: ValidatorNames.MinLength, args: 6 },
				{ name: ValidatorNames.Required },
			],
			width: FormNodeWidth.L,
		},
		{
			name: 'testStartTimestamp',
			label: 'Test start date',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			validators: [{ name: ValidatorNames.PastDate }],
		},
		{
			name: 'testEndTimestamp',
			label: 'Test end date',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			validators: [{ name: ValidatorNames.AheadOfDate, args: 'testStartTimestamp' }],
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
							name: 'testResult',
							label: 'Result',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.RADIO,
							options: [
								{ value: 'pass', label: 'Pass' },
								{ value: 'fail', label: 'Fail' },
								{ value: 'prs', label: 'PRS' },
							],
							validators: [
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'certificateNumber', value: ['pass'] } },
								{
									name: ValidatorNames.HideIfNotEqual,
									args: { sibling: 'secondaryCertificateNumber', value: ['pass'] },
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
							name: 'reasonForAbandoning',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							value: null,
							required: true,
						},
						{
							name: 'additionalCommentsForAbandon',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							value: null,
							required: true,
						},
						{
							name: 'certificateNumber',
							label: 'Certificate number',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							required: true,
							value: null,
						},
						{
							name: 'secondaryCertificateNumber',
							label: 'Secondary certificate number',
							value: '',
							required: true,
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.TEXT,
							validators: [
								{ name: ValidatorNames.Alphanumeric },
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'testResult', value: ['pass'] },
								},
								{ name: ValidatorNames.MaxLength, args: 20 },
							],
						},
						{
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							value: '',
							label: 'Test start date and time',
							viewType: FormNodeViewTypes.DATETIME,
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
							label: 'Test end date and time',
							viewType: FormNodeViewTypes.DATETIME,
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
