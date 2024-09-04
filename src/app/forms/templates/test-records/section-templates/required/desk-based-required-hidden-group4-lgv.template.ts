import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';

export const DeskBasedRequiredHiddenSectionGroup4And5Lgv: FormNode = {
	name: 'requiredSection',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'testResultId',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'vehicleType',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'contingencyTestNumber',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'typeOfTest',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'source',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'testStatus',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'systemNumber',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'testerStaffId',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'testEndTimestamp',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'vehicleClass',
			type: FormNodeTypes.GROUP,
			editType: FormNodeEditTypes.HIDDEN,

			viewType: FormNodeViewTypes.HIDDEN,
			children: [
				{
					name: 'code',
					customId: 'vehicleClassCode',
					type: FormNodeTypes.CONTROL,
					editType: FormNodeEditTypes.HIDDEN,
					viewType: FormNodeViewTypes.HIDDEN,
				},
				{
					name: 'description',
					customId: 'vehicleClassDescription',
					type: FormNodeTypes.CONTROL,
					editType: FormNodeEditTypes.HIDDEN,
					viewType: FormNodeViewTypes.HIDDEN,
				},
			],
		},
		{
			name: 'vehicleSubclass',
			type: FormNodeTypes.ARRAY,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
			children: [
				{
					name: '0',
					type: FormNodeTypes.CONTROL,
				},
			],
		},
		{
			name: 'vehicleType',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'noOfAxles',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'numberOfWheelsDriven',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'regnDate',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'firstUseDate',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'createdByName',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'createdById',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'lastUpdatedAt',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'lastUpdatedByName',

			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'lastUpdatedById',

			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'shouldEmailCertificate',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'vehicleConfiguration',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'reasonForCancellation',
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
							name: 'testTypeId',
							label: 'Test Type ID',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'testTypeName',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'prohibitionIssued',
							type: FormNodeTypes.CONTROL,
							value: null,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'name',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'createdAt',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'lastUpdatedAt',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'certificateLink',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'deletionFlag',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'testNumber',
							label: 'Test Number',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'reasonForAbandoning',
							type: FormNodeTypes.CONTROL,
							value: null,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'additionalCommentsForAbandon',
							type: FormNodeTypes.CONTROL,
							value: null,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
						{
							name: 'secondaryCertificateNumber',
							type: FormNodeTypes.CONTROL,
							value: null,
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
						},
					],
				},
			],
		},
	],
};
