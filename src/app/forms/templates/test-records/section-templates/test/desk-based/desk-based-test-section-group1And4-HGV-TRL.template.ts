import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const DeskBasedTestSectionGroup1And4HgvTrl: FormNode = {
	name: 'requiredSection',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'testStartTimestamp',
			label: 'Test start date',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'testEndTimestamp',
			type: FormNodeTypes.CONTROL,
			label: 'Test end date',
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
							name: 'testResult',
							label: 'Result',
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
							type: FormNodeTypes.CONTROL,
							value: 'pass',
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
							width: FormNodeWidth.L,
							required: true,
							value: null,
						},

						{
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							value: null,
							label: 'Test start date and time',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testTypeEndTimestamp',
							type: FormNodeTypes.CONTROL,
							value: null,
							label: 'Test end date and time',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'prohibitionIssued',
							label: 'Prohibition issued',
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

export const amendDeskBasedTestSectionGroup1And4HgvTrl: FormNode = {
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
		},
		{
			name: 'testEndTimestamp',
			type: FormNodeTypes.CONTROL,
			label: 'Test end date',
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
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.STRING,
							type: FormNodeTypes.CONTROL,
							width: FormNodeWidth.XS,
						},
						{
							name: 'testResult',
							label: 'Result',
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
							type: FormNodeTypes.CONTROL,
							value: 'pass',
						},
						{
							name: 'certificateNumber',
							label: 'Certificate number',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							width: FormNodeWidth.L,
							required: true,
							value: null,
						},

						{
							name: 'testTypeStartTimestamp',
							type: FormNodeTypes.CONTROL,
							value: null,
							label: 'Test start date and time',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testTypeEndTimestamp',
							type: FormNodeTypes.CONTROL,
							value: null,
							label: 'Test end date and time',
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testNumber',
							label: 'Test Number',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
						},
					],
				},
			],
		},
	],
};
