import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const PsvBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'brakes',
      label: 'DTP number',
      value: '',
      children: [
        {
          name: 'dtpNumber',
          label: 'DTP number',
          value: '',
          width: FormNodeWidth.S,
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.AUTOCOMPLETE,
          validators: [{ name: ValidatorNames.Required }]
        }
      ],
      type: FormNodeTypes.GROUP
    },
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
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }],
      disabled: true
    },
    {
      name: 'bodyModel',
      label: 'Body model',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }]
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
          customId: 'bodyType',
          type: FormNodeTypes.CONTROL,
          disabled: true,
          validators: [{ name: ValidatorNames.Required }]
        }
      ]
    },
    {
      name: 'functionCode',
      label: 'Function code',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: [
        { value: 'r', label: 'R' },
        { value: 'a', label: 'A' }
      ],
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }]
    },
    {
      name: 'conversionRefNo',
      label: 'Conversion ref no',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.CustomPattern, args: ['^[A-Z0-9]{0,10}$', 'max length 10 uppercase letters or numbers'] }]
    },
    {
      name: 'modelLiteral',
      label: 'Model literal',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }],
      width: FormNodeWidth.L
    }
  ]
};
