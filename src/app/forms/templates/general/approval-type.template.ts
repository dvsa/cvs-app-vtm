import { TagType } from '@components/tag/tag.component';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeWidth,
	TagTypeLabels,
} from '@services/dynamic-forms/dynamic-form.types';

export const HgvAndTrlTypeApprovalTemplate: FormNode = {
	name: 'approvalSection',
	label: 'Type approval',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_approvalType',
			label: 'Approval type',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			options: getOptionsFromEnum(ApprovalType),
			validators: [
				{ name: ValidatorNames.IsMemberOfEnum, args: { enum: ApprovalType, options: { allowFalsy: true } } },
			],
		},
		{
			name: 'techRecord_approvalTypeNumber',
			label: 'Approval type number',
			type: FormNodeTypes.CONTROL,
			width: FormNodeWidth.XL,
			validators: [
				{
					name: ValidatorNames.RequiredIfEquals,
					args: {
						sibling: 'techRecord_approvalType',
						value: [
							'NTA',
							'ECTA',
							'ECSSTA',
							'IVA',
							'NSSTA',
							'GB WVTA',
							'UKNI WVTA',
							'EU WVTA Pre 23',
							'EU WVTA 23 on',
							'QNIG',
							'Prov.GB WVTA',
							'Small series NKSXX',
							'Small series NKS',
							'IVA - VCA',
							'IVA - DVSA/NI',
						],
					},
				},
			],
		},
		{
			name: 'techRecord_ntaNumber',
			label: 'National type number',
			type: FormNodeTypes.CONTROL,
			width: FormNodeWidth.XXL,
			validators: [{ name: ValidatorNames.MaxLength, args: 40 }],
		},
		{
			name: 'techRecord_variantNumber',
			label: 'Variant number',
			type: FormNodeTypes.CONTROL,
			width: FormNodeWidth.XL,
			validators: [{ name: ValidatorNames.MaxLength, args: 35 }],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_variantVersionNumber',
			label: 'Variant version number',
			type: FormNodeTypes.CONTROL,
			width: FormNodeWidth.XXL,
			validators: [{ name: ValidatorNames.MaxLength, args: 35 }],
		},
	],
};
