import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const DeskBasedTestSectionGroup2And5: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'testStartTimestamp',
			label: 'Test start date',
			type: FormNodeTypes.CONTROL,
			value: '',
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'testEndTimestamp',
			type: FormNodeTypes.CONTROL,
			label: 'Test end date',
			value: '',
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
			type: FormNodeTypes.ARRAY,
			children: [
				{
					name: '0',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'testResult',
							type: FormNodeTypes.CONTROL,
							label: 'Result',
							value: 'pass',
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'reasonForAbandoning',
							type: FormNodeTypes.CONTROL,
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							required: true,
						},
						{
							name: 'additionalCommentsForAbandon',
							type: FormNodeTypes.CONTROL,
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							required: true,
						},
						{
							name: 'certificateNumber',
							type: FormNodeTypes.CONTROL,
							label: 'Certificate number',
							value: '',
							validators: [{ name: ValidatorNames.Alphanumeric }, { name: ValidatorNames.Required }],
							width: FormNodeWidth.L,
							required: true,
						},
						{
							name: 'testExpiryDate',
							type: FormNodeTypes.CONTROL,
							label: 'Expiry Date',
							value: null,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
						},
						{
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							label: 'Test start date and time',
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testTypeEndTimestamp',
							type: FormNodeTypes.CONTROL,
							label: 'Test end date and time',
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'prohibitionIssued',
							type: FormNodeTypes.CONTROL,
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
					],
				},
			],
		},
	],
};

export const AmendDeskBasedTestSectionGroup2And5: FormNode = {
	name: 'testSection',
	label: 'Test',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'testStartTimestamp',
			label: 'Test start date',
			type: FormNodeTypes.CONTROL,
			value: '',
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'testEndTimestamp',
			type: FormNodeTypes.CONTROL,
			label: 'Test end date',
			value: '',
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
			type: FormNodeTypes.ARRAY,
			children: [
				{
					name: '0',
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
							type: FormNodeTypes.CONTROL,
							label: 'Certificate number',
							value: '',
							validators: [{ name: ValidatorNames.Alphanumeric }, { name: ValidatorNames.Required }],
							width: FormNodeWidth.L,
							required: true,
						},
						{
							name: 'testExpiryDate',
							type: FormNodeTypes.CONTROL,
							label: 'Expiry Date',
							value: null,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
						},
						{
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							label: 'Test start date and time',
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testTypeEndTimestamp',
							type: FormNodeTypes.CONTROL,
							label: 'Test end date and time',
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
					],
				},
			],
		},
	],
};
