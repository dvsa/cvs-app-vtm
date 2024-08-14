import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvBrakesTemplate: FormNode = {
	name: 'psvBrakesSection',
	label: 'Brakes',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_brakes_brakeCodeOriginal',
			label: 'Brake code',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 6 }],
		},
		{
			name: 'techRecord_brakes_brakeCode',
			label: 'Brake code',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 6 }],
		},
		{
			name: 'techRecord_brakes_dataTrBrakeOne',
			label: 'Service *',
			value: null,
			type: FormNodeTypes.CONTROL,
			disabled: true,
		},
		{
			name: 'techRecord_brakes_dataTrBrakeTwo',
			label: 'Secondary *',
			value: null,
			type: FormNodeTypes.CONTROL,
			disabled: true,
		},
		{
			name: 'techRecord_brakes_dataTrBrakeThree',
			label: 'Parking *',
			value: null,
			type: FormNodeTypes.CONTROL,
			disabled: true,
		},
		{
			name: 'techRecord_brakes_retarderBrakeOne',
			label: 'Retarder 1',
			value: null,
			type: FormNodeTypes.CONTROL,
		},
		{
			name: 'techRecord_brakes_retarderBrakeTwo',
			label: 'Retarder 2',
			value: null,
			type: FormNodeTypes.CONTROL,
		},
		{
			name: 'techRecord_axles',
			value: '',
			type: FormNodeTypes.ARRAY,
			children: [
				{
					name: '0',
					label: 'Axle',
					value: '',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'axleNumber',
							label: 'Axle Number',
							type: FormNodeTypes.CONTROL,
						},
						{
							name: 'parkingBrakeMrk',
							label: 'Parking Brake',
							value: false,
							type: FormNodeTypes.CONTROL,
						},
					],
				},
			],
		},
	],
};
