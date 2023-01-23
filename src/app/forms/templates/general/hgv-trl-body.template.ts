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
      name: 'brakes',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'dtpNumber',
          label: 'DTp number',
          value: '',
          width: FormNodeWidth.L,
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXT,
          validators: [{ name: ValidatorNames.MaxLength, args: 6 }]
        }
      ]
    },
    {
      name: 'make',
      label: 'Body make',
      value: '',
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }]
    },
    {
      name: 'model',
      label: 'Body model',
      value: '',
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }]
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
          width: FormNodeWidth.L,
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.SELECT,
          options: getOptionsFromEnum(BodyTypeDescription),
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
      width: FormNodeWidth.S,
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
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 10 }]
    }
  ]
};
