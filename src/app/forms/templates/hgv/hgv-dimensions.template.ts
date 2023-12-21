import { ValidatorNames } from '@forms/models/validators.enum';
import { TagType } from '@shared/components/tag/tag.component';
import { DimensionLabelEnum } from '@shared/enums/dimension-label.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, TagTypeLabels,
} from '../../services/dynamic-form.types';

export const HgvDimensionsTemplate: FormNode = {
  name: 'dimensionsSection',
  label: 'Dimensions',
  type: FormNodeTypes.SECTION,
  children: [
    {
      name: 'techRecord_dimensions_length',
      label: DimensionLabelEnum.LENGTH,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_dimensions_width',
      label: DimensionLabelEnum.WIDTH,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_dimensions_axleSpacing',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'value',
              label: DimensionLabelEnum.AXLE_TO_AXLE,
              value: null,
              editType: FormNodeEditTypes.NUMBER,
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.Max, args: 99999 }],
            },
          ],
        },
      ],
    },
    {
      name: 'techRecord_frontAxleToRearAxle',
      label: DimensionLabelEnum.FRONT_AXLE_TO_REAR_AXLE,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
    {
      name: 'techRecord_frontVehicleTo5thWheelCouplingMin',
      label: DimensionLabelEnum.MINIMUM,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_frontVehicleTo5thWheelCouplingMax',
      label: DimensionLabelEnum.MAXIMUM,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_frontAxleTo5thWheelMin',
      label: DimensionLabelEnum.MINIMUM,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
    {
      name: 'techRecord_frontAxleTo5thWheelMax',
      label: DimensionLabelEnum.MAXIMUM,
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
    },
  ],
};
