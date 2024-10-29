import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const ContingencyTestSectionGroup15and16: FormNode = {
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
			type: FormNodeTypes.CONTROL,
			label: 'Test end date',
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
							],
							validators: [{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'testExpiryDate', value: 'pass' } }],
							asyncValidators: [{ name: AsyncValidatorNames.PassResultDependantOnCustomDefects }],
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
							editType: FormNodeEditTypes.TEXT,
							validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.Alphanumeric }],
							viewType: FormNodeViewTypes.HIDDEN,
							required: true,
							value: null,
						},
						{
							name: 'testExpiryDate',
							label: 'Expiry Date',
							value: '',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.TIME,
							editType: FormNodeEditTypes.DATE,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'testResult', value: ['pass'] },
								},
								{ name: ValidatorNames.FutureDate },
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
						{
							name: 'defects',
							type: FormNodeTypes.ARRAY,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
					],
				},
			],
		},
	],
};
