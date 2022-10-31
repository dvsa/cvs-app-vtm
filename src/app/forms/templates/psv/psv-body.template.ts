import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const psvBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'modelLiteral',
      label: 'Model literal',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'chassisMake',
      label: 'Chassis make',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'chassisModel',
      label: 'Chassis model',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
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
