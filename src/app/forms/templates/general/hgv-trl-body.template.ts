import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const hgvAndTrlBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'make',
      label: 'Body make',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: []
    },
    {
      name: 'model',
      label: 'Body model',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'bodyType',
      label: 'Body type',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'description',
          label: 'Body type',
          value: '',
          type: FormNodeTypes.CONTROL,
        },
      ]
    },
    {
      name: 'functionCode',
      label: 'Function code',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }]
    },
    {
      name: 'conversionRefNo',
      label: 'Conversion ref no',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 10 }]
    }
  ]
};
