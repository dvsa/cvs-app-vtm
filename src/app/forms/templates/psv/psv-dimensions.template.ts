import { ValidatorNames } from '@forms/models/validators.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes, FormNodeValidator } from '../../services/dynamic-form.types';

export const PsvDimensionsTemplate: FormNode = {
  name: 'dimensionsSection',
  label: 'Dimensions',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'dimensions',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'height',
          label: 'Height (mm)',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.Max, args: 99999 }]
        },
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
        }
      ]
    },
    {
      name: 'frontAxleToRearAxle',
      label: 'Front axle to rear axle (mm)',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }]
    }
  ]
};
