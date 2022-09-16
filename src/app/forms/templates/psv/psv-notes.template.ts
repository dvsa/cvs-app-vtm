import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvNotes: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'remarks',
      label: 'Notes',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXTAREA
    },
    {
      name: 'dispensations',
      type: FormNodeTypes.CONTROL,
      label: 'Dispensations',
      value: '',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.TEXTAREA
    }
  ]
};
