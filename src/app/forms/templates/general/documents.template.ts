import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { DOCUMENT_TYPES } from '@forms/templates/general/document-types';
import { ValidatorNames } from '@forms/models/validators.enum';

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
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.AUTOCOMPLETE,
          options: DOCUMENT_TYPES,
        },
        {
          name: 'microfilmRollNumber',
          label: 'Microfilm roll number',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXT,
          validators: [{ name: ValidatorNames.MaxLength, args: 5 }]
        },
        {
          name: 'microfilmSerialNumber',
          label: 'Microfilm serial number',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXT,
          validators: [{ name: ValidatorNames.MaxLength, args: 4 }]
        }
      ]
    }
  ]
};
