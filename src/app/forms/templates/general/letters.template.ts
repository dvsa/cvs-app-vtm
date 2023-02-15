import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { LETTER_TYPES } from './letter-types';

export const LettersTemplate: FormNode = {
  name: 'lettersSection',
  label: 'Letters',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: '0',
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
          name: 'letterParagraphID',
          label: 'Paragraph ID',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.HIDDEN
        }
      ]
    }
  ]
};
