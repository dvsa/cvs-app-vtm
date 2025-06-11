import { TagType } from '@components/tag/tag.component';
import { ValidatorNames } from '@models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';

export const TrlDimensionsTemplate: FormNode = {
	name: 'dimensionsSection',
	label: 'Dimensions',
	type: FormNodeTypes.SECTION,
	children: [
		{
			name: 'techRecord_dimensions_length',
			label: 'Length (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_dimensions_width',
			label: 'Width (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_dimensions_axleSpacing',
			type: FormNodeTypes.ARRAY,
			value: '',
			children: [
				{
					name: '0',
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'value',
							label: 'Axle to axle (mm)',
							value: null,
							editType: FormNodeEditTypes.NUMBER,
							type: FormNodeTypes.CONTROL,
							validators: [{ name: ValidatorNames.Max, args: 99999 }],
						},
					],
				},
			],
		},
		{
			name: 'techRecord_frontAxleToRearAxle',
			label: 'Front axle to rear axle (mm)',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_rearAxleToRearTrl',
			label: 'Rear axle to rear trailer',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_centreOfRearmostAxleToRearOfTrl',
			label: 'Center of Rear axle to rear of trailer',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_couplingCenterToRearAxleMin',
			label: 'Minimum',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_couplingCenterToRearAxleMax',
			label: 'Maximum',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
		},
		{
			name: 'techRecord_couplingCenterToRearTrlMin',
			label: 'Minimum',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
		{
			name: 'techRecord_couplingCenterToRearTrlMax',
			label: 'Maximum',
			value: null,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Max, args: 99999 }],
			customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
		},
	],
};
