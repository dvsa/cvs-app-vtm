import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const ContingencyTestSectionGroup9And10CentralDocs: FormNode = {
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
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
							value: null,
							type: FormNodeTypes.CONTROL,
							validators: [
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'centralDocs', value: ['pass', 'prs'] } },
							],
						},
						{
							name: 'centralDocs',
							type: FormNodeTypes.GROUP,
							children: [
								{
									name: 'issueRequired',
									type: FormNodeTypes.CONTROL,
									label: 'Issue documents centrally',
									editType: FormNodeEditTypes.RADIO,
									value: false,
									options: [
										{ value: true, label: 'Yes' },
										{ value: false, label: 'No' },
									],
									validators: [
										{
											name: ValidatorNames.HideIfParentSiblingEqual,
											args: { sibling: 'certificateNumber', value: true },
										},
									],
								},
								{
									name: 'reasonsForIssue',
									type: FormNodeTypes.CONTROL,
									viewType: FormNodeViewTypes.HIDDEN,
									editType: FormNodeEditTypes.HIDDEN,
									value: [],
								},
							],
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
							value: '',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
						{
							name: 'testExpiryDate',
							label: 'Expiry Date',
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
							name: 'prohibitionIssued',
							label: 'Prohibition issued',
							type: FormNodeTypes.CONTROL,
							value: null,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
							required: true,
						},
					],
				},
			],
		},
	],
};
