import { ValidatorNames } from '@/src/app/models/validators.enum';
import { FormNode, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

export const ContingencyWeightsTRLTpl: FormNode = {
	name: 'weightsSection',
	label: 'Weights',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'weights',
			type: FormNodeTypes.GROUP,
			children: [
				{
					name: 'designGrossVehicleWeight',
					label: 'Design gross vehicle weight',
					type: FormNodeTypes.CONTROL,
					value: null,
					validators: [
						{ name: ValidatorNames.Min, args: 1 },
						{ name: ValidatorNames.Max, args: 999999 },
					],
				},
				{
					name: 'designGrossAxleWeight',
					label: 'Design total axle weight',
					type: FormNodeTypes.CONTROL,
					value: null,
					validators: [
						{ name: ValidatorNames.Min, args: 1 },
						{ name: ValidatorNames.Max, args: 999999 },
					],
				},
			],
		},
	],
};
