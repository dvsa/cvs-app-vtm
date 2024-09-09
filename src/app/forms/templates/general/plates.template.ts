import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { PlateReasonForIssue } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

export const PlatesTemplate: FormNode = {
	name: 'platesSection',
	label: 'Plates',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_plates',
			type: FormNodeTypes.ARRAY,
			children: [
				{
					name: '0',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'plateSerialNumber',
							label: 'Plate serial number',
							value: null,
							type: FormNodeTypes.CONTROL,
							width: FormNodeWidth.L,
							disabled: true,
						},
						{
							name: 'plateIssueDate',
							label: 'Plate issue date',
							value: null,
							type: FormNodeTypes.CONTROL,
							width: FormNodeWidth.L,
							disabled: true,
						},
						{
							name: 'plateReasonForIssue',
							label: 'Plate reason for issue',
							value: null,
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.SELECT,
							options: getOptionsFromEnum(PlateReasonForIssue),
							width: FormNodeWidth.L,
						},
						{
							name: 'plateIssuer',
							label: 'Plate issuer',
							value: null,
							type: FormNodeTypes.CONTROL,
							width: FormNodeWidth.L,
							disabled: true,
						},
					],
				},
			],
		},
	],
};
