import { ValidatorNames } from '@/src/app/models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

export const WeightsHGVTpl: FormNode = {
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
					width: FormNodeWidth.M,
					suffix: 'kg',
					validators: [
						{ name: ValidatorNames.Min, args: 1 },
						{ name: ValidatorNames.Max, args: 99999 },
					],
				},
				{
					name: 'designGrossTrainWeight',
					label: 'Design gross train weight',
					type: FormNodeTypes.CONTROL,
					value: null,
					width: FormNodeWidth.M,
					suffix: 'kg',
					validators: [
						{ name: ValidatorNames.Min, args: 1 },
						{ name: ValidatorNames.Max, args: 99999 },
					],
				},
			],
		},
	],
};
