import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { SpecialRefData } from '@services/multi-options/multi-options.service';

export const TestSectionGroup9And10CentralDocs: FormNode = {
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
							editType: FormNodeEditTypes.HIDDEN,
							viewType: FormNodeViewTypes.HIDDEN,
							validators: [
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
								{
									name: ValidatorNames.HideIfNotEqual,
									args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' },
								},
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'centralDocs', value: ['pass', 'prs'] } },
							],
							type: FormNodeTypes.CONTROL,
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
							name: 'testTypeName',
							label: 'Description',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
						},
						{
							name: 'certificateNumber',
							label: 'Certificate number',
							value: '',
							disabled: true,
							type: FormNodeTypes.CONTROL,
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
						{
							name: 'testExpiryDate',
							label: 'Expiry Date',
							value: '',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'testResult', value: ['pass'] },
								},
								{ name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' },
							],
						},
						{
							name: 'testAnniversaryDate',
							label: 'Anniversary date',
							value: '',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'testResult', value: ['pass'] },
								},
								{ name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' },
								{ name: ValidatorNames.DateNotExceed, args: { sibling: 'testExpiryDate', months: 14 } },
							],
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
					],
				},
			],
		},
	],
};
