import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@services/dynamic-forms/dynamic-form.types';

export const reasonForCreationSection: FormNode = {
	name: 'reasonForCreationSection',
	label: 'Reason for creation',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'reasonForCreation',
			label: 'Reason for creation',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.TEXTAREA,
			validators: [{ name: ValidatorNames.MaxLength, args: 100 }, { name: ValidatorNames.Required }],
		},
	],
};

export const reasonForCreationHiddenSection: FormNode = {
	name: 'requiredSection',
	label: 'Reason for creation',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'reasonForCreation',
			label: 'Reason for creation',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
	],
};
