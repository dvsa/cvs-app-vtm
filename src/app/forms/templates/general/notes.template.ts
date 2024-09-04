import { ValidatorNames } from '@models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';

export const NotesTemplate: FormNode = {
	name: 'notesSection',
	label: 'Notes',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_notes',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.FULLWIDTH,
			editType: FormNodeEditTypes.TEXTAREA,
			validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],
		},
	],
};
