import { TagType } from '@components/tag/tag.component';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	TagTypeLabels,
} from '@services/dynamic-forms/dynamic-form.types';

export const TechRecordReasonForCreationSection: FormNode = {
	name: 'reasonForCreationSection',
	label: 'Reason for creation',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_reasonForCreation',
			label: 'Reason for creation',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.TEXTAREA,
			validators: [{ name: ValidatorNames.MaxLength, args: 500 }, { name: ValidatorNames.Required }],
			customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
		},
	],
};

export const TechRecordReasonForCreationHiddenSection: FormNode = {
	name: 'requiredSection',
	label: 'Reason for creation',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_reasonForCreation',
			label: 'Reason for creation',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
	],
};
