import { DOCUMENT_TYPES } from '@forms/templates/general/document-types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const DocumentsTemplate: FormNode = {
  name: 'documentsSection',
  label: 'Documents',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_microfilm_microfilmDocumentType',
      label: 'Microfilm document type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      options: DOCUMENT_TYPES,
    },
    {
      name: 'techRecord_microfilm_microfilmRollNumber',
      label: 'Microfilm roll number',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 5 }],
    },
    {
      name: 'techRecord_microfilm_microfilmSerialNumber',
      label: 'Microfilm serial number',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 4 }],
    },
  ],
};
