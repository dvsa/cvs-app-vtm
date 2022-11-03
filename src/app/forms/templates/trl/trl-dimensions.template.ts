import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

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
          children: [{
            name: '0',
            type: FormNodeTypes.GROUP,
            children: [
              {
                name: 'value',
                label: 'Axle to axle (mm)',
                value: '',
                type: FormNodeTypes.CONTROL,
                validators: [{ name: ValidatorNames.Max, args: 99999 }]
              }
            ]
          }]
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
      validators: [{ name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Required }]
    },
    {
      name: 'couplingCenterToRearAxleMin',
      label: 'Minimum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Required }]
    },
    {
      name: 'couplingCenterToRearAxleMax',
      label: 'Maximum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Required }]
    },
    {
      name: 'couplingCenterToRearTrlMin',
      label: 'Minimum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Required }]
    },
    {
      name: 'couplingCenterToRearTrlMax',
      label: 'Maximum',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Required }]
    }
  ]
};
