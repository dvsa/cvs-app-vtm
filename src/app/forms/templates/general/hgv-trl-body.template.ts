import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { BodyTypeDescription } from '@models/body-type-enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const HgvAndTrlBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_brakes_dtpNumber',
      label: 'DTp number',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 6 }]
    },
    {
      name: 'techRecord_make',
      label: 'Body make',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 50 }]
    },
    {
      name: 'techRecord_model',
      label: 'Body model',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }]
    },
    {
      name: 'techRecord_bodyType_description',
      label: 'Body type',
      value: '',
      customId: 'bodyType',
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(BodyTypeDescription),
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'techRecord_functionCode',
      label: 'Function code',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.S,
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
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.CustomPattern, args: ['^[A-Z0-9]{0,10}$', 'max length 10 uppercase letters or numbers'] }]
    }
  ]
};
