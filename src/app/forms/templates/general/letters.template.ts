import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { LETTER_TYPES } from './letter-types';

export const LettersTemplate: FormNode = {
  name: 'lettersSection',
  label: 'Letters',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'lettersOfAuth',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'letterType',
          label: 'Type of letter',
          type: FormNodeTypes.CONTROL,
          options: LETTER_TYPES
        },
        {
          name: 'letterDateRequested',
          label: 'Date requested',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'letterContents',
          label: 'Content',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.HIDDEN
        }
      ]
    }
  ]
};
