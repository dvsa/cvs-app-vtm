import { FormNodeOption } from '@forms/services/dynamic-form.types';

export const LETTER_TYPES: FormNodeOption<string>[] = [
  {
    value: 'trailer authorisation',
    label: 'Trailer authorisation'
  },
  {
    value: 'trailer rejection',
    label: 'Trailer rejection'
  }
];
