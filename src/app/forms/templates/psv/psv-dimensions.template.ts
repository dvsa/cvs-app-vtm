import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvDimensionsTemplate: FormNode = {
	name: 'dimensionsSection',
	label: 'Dimensions',
	type: FormNodeTypes.SECTION,
	children: [
		{
			name: 'techRecord_dimensions_height',
			label: 'Height (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_dimensions_length',
			label: 'Length (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_dimensions_width',
			label: 'Width (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_frontAxleToRearAxle',
			label: 'Front axle to rear axle (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
	],
};
