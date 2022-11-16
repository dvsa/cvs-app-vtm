import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'modelLiteral',
      label: 'Model literal',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }]
    },
    {
      name: 'chassisMake',
      label: 'Chassis make',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }],
      disabled: true
    },
    {
      name: 'chassisModel',
      label: 'Chassis model',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }],
      disabled: true
    },
    {
      name: 'bodyMake',
      label: 'Body make',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }],
      disabled: true
    },
    {
      name: 'bodyModel',
      label: 'Body model',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 20 }]
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
          disabled: true
        }
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
    },
  ]
};
