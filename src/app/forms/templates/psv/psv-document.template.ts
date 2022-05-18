import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvDocuments: FormNode = {
  name: 'documentsSection',
  label: 'Documents',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'microfilm',
      label: 'Documents',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'microfilmDocumentType',
          label: 'Microfilm document type',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'microfilmRollNumber',
          label: 'Microfilm roll number',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'microfilmSerialNumber',
          label: 'Microfilm Serial Number',
          type: FormNodeTypes.CONTROL
        }
      ]
    }
  ]
};
