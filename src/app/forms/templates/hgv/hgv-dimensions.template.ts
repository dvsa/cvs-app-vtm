import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const HgvDimensionsTemplate: FormNode = {
  name: 'dimensionsSection',
  label: 'Dimensions',
  type: FormNodeTypes.SECTION,
  children: [
    {
      name: 'dimensions',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'length',
          label: 'Length (mm)',
          value: null,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.Max, args: 99999 }]
        },
        {
          name: 'width',
          label: 'Width (mm)',
          value: null,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.Max, args: 99999 }]
        },
        {
          name: 'axleSpacing',
          type: FormNodeTypes.ARRAY,
          children: [
            {
              name: '0',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'value',
                  label: 'Axle to axle (mm)',
                  value: null,
                  editType: FormNodeEditTypes.NUMBER,
                  type: FormNodeTypes.CONTROL,
                  validators: [{ name: ValidatorNames.Max, args: 99999 }]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'frontAxleToRearAxle',
      label: 'Front axle to rear axle (mm)',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelCouplingMin',
      label: 'Minimum',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelCouplingMax',
      label: 'Maximum',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelMin',
      label: 'Minimum',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelMax',
      label: 'Maximum',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    }
  ]
};
