import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvNotes: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'remarks',
      label: 'Notes',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'dispensations',
      type: FormNodeTypes.CONTROL,
      label: 'Dispensations',
      value: ''
    }
  ]
};
