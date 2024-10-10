import { AsyncValidatorNames } from '@models/async-validators.enum';
import { TEST_TYPES_GROUP1_SPEC_TEST } from '@models/testTypeId.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeValueFormat,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const ContingencyTestSectionSpecialistGroup1: FormNode = {
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
								{ value: 'prs', label: 'PRS' },
							],
							validators: [
								{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'centralDocs', value: ['pass', 'prs'] } },
							],
							asyncValidators: [
								{ name: AsyncValidatorNames.ResultDependantOnRequiredStandards },
								{
									name: AsyncValidatorNames.HideIfEqualsWithCondition,
									args: {
										sibling: 'certificateNumber',
										value: 'fail',
										conditions: { field: 'testTypeId', operator: 'equals', value: TEST_TYPES_GROUP1_SPEC_TEST },
									},
								},
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
							viewType: FormNodeViewTypes.STRING,
							editType: FormNodeEditTypes.TEXT,
							valueFormat: FormNodeValueFormat.UPPERCASE,
							validators: [
								{ name: ValidatorNames.Alphanumeric },
								// Make required if test result is pass/prs, but issue documents centrally is false
								{ name: ValidatorNames.IssueRequired },
							],
							required: true,
							value: null,
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
							name: 'reapplicationDate',
							label: 'Reapplication date',
							hint: 'For example, 27 3 2007',
							editType: FormNodeEditTypes.DATE,
							viewType: FormNodeViewTypes.DATE,
							type: FormNodeTypes.CONTROL,
							groups: ['failOnly'],
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: {
										sibling: 'testResult',
										value: ['fail'],
										customErrorMessage: 'Reapplication date is required',
									},
								},
								{ name: ValidatorNames.FutureDate },
							],
						},
					],
				},
			],
		},
	],
};
