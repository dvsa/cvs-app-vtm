import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const tyresTemplateTrl: FormNode = {
  name: 'tyreSection',
  type: FormNodeTypes.GROUP,
  label: 'Tyres',
  children: [
    {
      name: 'tyreUseCode',
      label: 'Tyre use code',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.MaxLength, args: 2 },
        { name: ValidatorNames.Min, args: 0 }
      ]
    },
    {
      name: 'axles',
      value: '',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          label: 'Axle',
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'axleNumber',
              label: 'Axle Number',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'tyres',
              label: 'Tyres',
              value: '',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'tyreCode',
                  label: 'Tyre Code',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  editType: FormNodeEditTypes.NUMBER,
                  validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Min, args: 0 }]
                },
                {
                  name: 'tyreSize',
                  label: 'Tyre Size',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  disabled: true,
                  validators: [
                    { name: ValidatorNames.MaxLength, args: 12 },
                    { name: ValidatorNames.Min, args: 0 }
                  ]
                },
                {
                  name: 'plyRating',
                  label: 'Ply Rating',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  disabled: true,
                  validators: [
                    { name: ValidatorNames.MaxLength, args: 2 },
                    { name: ValidatorNames.Min, args: 0 }
                  ]
                },
                {
                  name: 'fitmentCode',
                  label: 'Fitment code',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: []
                },
                {
                  name: 'dataTrAxles',
                  label: 'Load index',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  editType: FormNodeEditTypes.NUMBER,
                  disabled: true,
                  validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 999 }, { name: ValidatorNames.Min, args: 0 }]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
