import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const NotesSection: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'additionalNotesRecorded',
      label: 'Additional Notes',
      type: FormNodeTypes.CONTROL
    }
  ]
};
