import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const DeskBasedTestSectionLgvGroup5: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
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
							type: FormNodeTypes.CONTROL,
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
							width: FormNodeWidth.L,
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
							name: 'testExpiryDate',
							label: 'Expiry Date',
							value: null,
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
							validators: [{ name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' }],
						},
						{
							name: 'prohibitionIssued',
							type: FormNodeTypes.CONTROL,
							label: 'Prohibition issued',
							value: null,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'reasonForAbandoning',
							type: FormNodeTypes.CONTROL,
							label: 'Reason for abandoning',
							value: null,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'additionalCommentsForAbandon',
							type: FormNodeTypes.CONTROL,
							value: null,
							label: 'Additional details for abandoning',
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
					],
				},
			],
		},
	],
};

export const AmendDeskBasedTestSectionLgvGroup5: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'testStartTimestamp',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'testEndTimestamp',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'createdAt',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
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
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.RADIO,
							options: [
								{ value: 'pass', label: 'Pass' },
								{ value: 'fail', label: 'Fail' },
							],
						},
						{
							name: 'certificateNumber',
							label: 'Certificate number',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.TEXT,
							width: FormNodeWidth.L,
							validators: [{ name: ValidatorNames.Alphanumeric }],
							value: null,
						},
						{
							name: 'testNumber',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
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
							name: 'testExpiryDate',
							label: 'Expiry Date',
							value: null,
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
							validators: [{ name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' }],
						},
					],
				},
			],
		},
	],
};
