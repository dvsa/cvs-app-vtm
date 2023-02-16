import { FormNodeOption } from '@forms/services/dynamic-form.types';

export const LETTER_TYPES: FormNodeOption<string>[] = [
  {
    value: 'Authorised',
    label: 'Authorised'
  },
  {
    value: 'Rejected',
    label: 'Rejected'
  }
];
