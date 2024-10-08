import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';
import { LETTER_TYPES } from './letter-types';

export const LettersTemplate: FormNode = {
	name: 'lettersSection',
	label: 'Letters',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'techRecord_letterOfAuth_letterIssuer',
			label: 'Letter issuer',
			type: FormNodeTypes.CONTROL,
			options: LETTER_TYPES,
		},
		{
			name: 'techRecord_letterOfAuth_letterType',
			label: 'Type of letter',
			type: FormNodeTypes.CONTROL,
			options: LETTER_TYPES,
		},
		{
			name: 'techRecord_letterOfAuth_letterDateRequested',
			label: 'Date requested',
			type: FormNodeTypes.CONTROL,
		},
		{
			name: 'techRecord_letterOfAuth_paragraphId',
			label: 'Paragraph ID',
			type: FormNodeTypes.CONTROL,
		},
		{
			name: 'techRecord_letterOfAuth_letterContents',
			label: 'Content',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
		},
	],
};
