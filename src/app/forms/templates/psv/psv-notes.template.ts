import { ValidatorNames } from '@models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';

export const PsvNotes: FormNode = {
	name: 'notesSection',
	label: 'Notes',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_remarks',
			label: 'Notes',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXTAREA,
			validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],
		},
		{
			name: 'techRecord_dispensations',
			type: FormNodeTypes.CONTROL,
			label: 'Dispensations',
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXTAREA,
			validators: [{ name: ValidatorNames.MaxLength, args: 160 }],
		},
	],
};
