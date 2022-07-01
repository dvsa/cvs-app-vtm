import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const DocumentsTemplate: FormNode = {
  name: 'documentsSection',
  label: 'Documents',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'microfilm',
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
          label: 'Microfilm serial number',
          type: FormNodeTypes.CONTROL
        }
      ]
    }
  ]
};
