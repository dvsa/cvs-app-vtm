import { ValidatorNames } from '@models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

export const CustomDefectsSection: FormNode = {
	name: 'customDefectsSection',
	label: 'Custom Defects',
	type: FormNodeTypes.GROUP,
	children: [
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
							name: 'customDefects',
							type: FormNodeTypes.ARRAY,
							children: [
								{
									name: '0',
									type: FormNodeTypes.GROUP,
									children: [
										{
											name: 'referenceNumber',
											label: 'Reference Number',
											type: FormNodeTypes.CONTROL,
											validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 10 }],
											width: FormNodeWidth.XL,
										},
										{
											name: 'defectName',
											label: 'Defect Name',
											type: FormNodeTypes.CONTROL,
											validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 200 }],
										},
										{
											name: 'defectNotes',
											label: 'Defect Notes',
											type: FormNodeTypes.CONTROL,
											validators: [{ name: ValidatorNames.MaxLength, args: 200 }],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
