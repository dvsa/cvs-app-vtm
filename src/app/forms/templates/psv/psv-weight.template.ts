import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

const requiredValidation = [
	{ name: ValidatorNames.Numeric, args: 99999 },
	{ name: ValidatorNames.Max, args: 99999 },
	{ name: ValidatorNames.Min, args: 0 },
];

const optionalValidation = [
	{ name: ValidatorNames.Numeric, args: 99999 },
	{ name: ValidatorNames.Max, args: 99999 },
	{ name: ValidatorNames.Min, args: 0 },
];

export const PsvWeightsTemplate: FormNode = {
	name: 'weightsSection',
	label: 'Weights',
	type: FormNodeTypes.SECTION,
	children: [
		{
			name: 'techRecord_grossSection',
			label: 'Gross vehicle weight',
			value: null,
			type: FormNodeTypes.SECTION,
		},
		{
			name: 'techRecord_grossKerbWeight',
			label: 'Kerb',
			customValidatorErrorName: 'Gross Kerb Weight',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: requiredValidation,
		},
		{
			name: 'techRecord_grossLadenWeight',
			label: 'Laden',
			customValidatorErrorName: 'Gross Laden Weight',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: requiredValidation,
		},
		{
			name: 'techRecord_grossGbWeight',
			label: 'GB',
			customValidatorErrorName: 'Gross GB Weight',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: requiredValidation,
		},
		{
			name: 'techRecord_grossDesignWeight',
			label: 'Design',
			customValidatorErrorName: 'Gross Design Weight',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: requiredValidation,
		},
		{
			name: 'techRecord_unladenWeight',
			label: 'Unladen weight',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: requiredValidation,
		},
		{
			name: 'techRecord_trainSection',
			label: 'Train weight',
			value: null,
			type: FormNodeTypes.SECTION,
		},
		{
			name: 'techRecord_maxTrainGbWeight',
			label: 'Max train GB',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: optionalValidation,
		},
		{
			name: 'techRecord_trainDesignWeight',
			label: 'Train design',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: optionalValidation,
		},
		{
			name: 'axleSection',
			label: 'Axle weights',
			value: '',
			type: FormNodeTypes.SECTION,
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
							name: 'weights_kerbWeight',
							label: 'Kerb weight',
							customValidatorErrorName: 'Axle Kerb Weight',
							value: null,
							type: FormNodeTypes.CONTROL,
							validators: requiredValidation,
						},
						{
							name: 'weights_ladenWeight',
							label: 'Laden weight',
							customValidatorErrorName: 'Axle Laden Weight',
							value: null,
							type: FormNodeTypes.CONTROL,
							validators: requiredValidation,
						},
						{
							name: 'weights_gbWeight',
							label: 'GB weight',
							customValidatorErrorName: 'Axle GB Weight',
							value: null,
							type: FormNodeTypes.CONTROL,
							validators: requiredValidation,
						},
						{
							name: 'weights_designWeight',
							label: 'Design weight',
							customValidatorErrorName: 'Axle Design Weight',
							value: null,
							type: FormNodeTypes.CONTROL,
							validators: requiredValidation,
						},
					],
				},
			],
		},
	],
};
