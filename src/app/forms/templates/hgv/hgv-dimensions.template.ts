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
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.Max, args: 99999 }]
        },
        {
          name: 'width',
          label: 'Width (mm)',
          value: '',
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
                  value: '',
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
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelCouplingMin',
      label: 'Minimum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelCouplingMax',
      label: 'Maximum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelMin',
      label: 'Minimum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'frontAxleTo5thWheelMax',
      label: 'Maximum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    }
  ]
};
