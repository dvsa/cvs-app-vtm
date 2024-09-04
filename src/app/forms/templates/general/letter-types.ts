import { FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';

export const LETTER_TYPES: FormNodeOption<string>[] = [
	{
		value: 'trailer acceptance',
		label: 'Trailer acceptance',
	},
	{
		value: 'trailer rejection',
		label: 'Trailer rejection',
	},
];
