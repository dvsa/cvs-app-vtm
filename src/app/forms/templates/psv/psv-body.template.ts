import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const PsvBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_brakes_dtpNumber',
      label: 'DTP number',
      value: null,
      width: FormNodeWidth.S,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'techRecord_modelLiteral',
      label: 'Model literal',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }]
    },
    {
      name: 'techRecord_chassisMake',
      label: 'Chassis make',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }],
      disabled: true
    },
    {
      name: 'techRecord_chassisModel',
      label: 'Chassis model',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }],
      disabled: true
    },
    {
      name: 'techRecord_bodyMake',
      label: 'Body make',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }],
      disabled: true
    },
    {
      name: 'techRecord_bodyModel',
      label: 'Body model',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }]
    },
    {
      name: 'techRecord_bodyType_description',
      label: 'Body type',
      value: '',
      customId: 'bodyType',
      type: FormNodeTypes.CONTROL,
      disabled: true,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'techRecord_functionCode',
      label: 'Function code',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: [
        { value: 'r', label: 'R' },
        { value: 'a', label: 'A' }
      ],
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }]
    },
    {
      name: 'techRecord_conversionRefNo',
      label: 'Conversion ref no',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.CustomPattern, args: ['^[A-Z0-9 ]{0,10}$', 'max length 10 uppercase letters or numbers'] }]
    },
    {
      name: 'techRecord_modelLiteral',
      label: 'Model literal',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }],
      width: FormNodeWidth.L
    }
  ]
};
