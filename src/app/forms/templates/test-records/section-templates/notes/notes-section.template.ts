import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const NotesSection: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testTypes',
      label: 'Test Types',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0', // it is important here that the name of the node for an ARRAY type should be an index value
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'additionalNotesRecorded',
              label: 'Additional Notes',
              type: FormNodeTypes.CONTROL,
              value: '',
              editType: FormNodeEditTypes.TEXTAREA,
              validators: [{ name: ValidatorNames.MaxLength, args: 500 }]
            }
          ]
        }
      ]
    }
  ]
};
