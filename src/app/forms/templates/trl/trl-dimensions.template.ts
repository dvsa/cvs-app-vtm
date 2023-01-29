import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const TrlDimensionsTemplate: FormNode = {
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
          value: '',
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
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'rearAxleToRearTrl',
      label: 'Rear axle to rear trailer',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'centreOfRearmostAxleToRearOfTrl',
      label: 'Center pf Rear axle to rear of trailer',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'couplingCenterToRearAxleMin',
      label: 'Minimum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'couplingCenterToRearAxleMax',
      label: 'Maximum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'couplingCenterToRearTrlMin',
      label: 'Minimum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    },
    {
      name: 'couplingCenterToRearTrlMax',
      label: 'Maximum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    }
  ]
};
