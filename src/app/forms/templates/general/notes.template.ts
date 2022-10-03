import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const NotesTemplate: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'notes',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.FULLWIDTH
    }
  ]
};
