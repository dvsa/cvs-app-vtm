import { ValidatorNames } from '@forms/models/validators.enum';
import { DimensionLabelEnum } from '@shared/enums/dimension-label.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvDimensionsTemplate: FormNode = {
  name: 'dimensionsSection',
  label: 'Dimensions',
  type: FormNodeTypes.SECTION,
  children: [
    {
      name: 'techRecord_dimensions_height',
      label: DimensionLabelEnum.HEIGHT,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
    {
      name: 'techRecord_dimensions_length',
      label: DimensionLabelEnum.LENGTH,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
    {
      name: 'techRecord_dimensions_width',
      label: DimensionLabelEnum.WIDTH,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
    {
      name: 'techRecord_frontAxleToRearAxle',
      label: DimensionLabelEnum.FRONT_AXLE_TO_REAR_AXLE,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
  ],
};
