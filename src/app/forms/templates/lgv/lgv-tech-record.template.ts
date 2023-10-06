import { ValidatorNames } from '@forms/models/validators.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth, TagTypeLabels,
} from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, VehicleSubclass } from '@models/vehicle-tech-record.model';
import { TagType } from '@shared/components/tag/tag.component';

export const LgvTechRecord: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  children: [
    {
      name: 'techRecord_vehicleType',
      label: 'Vehicle type',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE,
      disabled: true,
      validators: [],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_regnDate',
      label: 'Date of first registration',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      validators: [],
      isoDate: false,
    },
    {
      name: 'techRecord_manufactureYear',
      label: 'Year of manufacture',
      value: null,
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.Max, args: 9999 },
        { name: ValidatorNames.Min, args: 1000 },
      ],
    },
    {
      name: 'techRecord_noOfAxles',
      label: 'Number of axles',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      value: 2,
      validators: [{ name: ValidatorNames.Max, args: 99 }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_vehicleSubclass',
      label: 'Vehicle Subclass',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOXGROUP,
      options: getOptionsFromEnum(VehicleSubclass),
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: VehicleConfiguration.OTHER,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      validators: [{ name: ValidatorNames.Required }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_euVehicleCategory',
      label: 'EU vehicle category',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.S,
      options: getOptionsFromEnum(EuVehicleCategories),
      validators: [],
    },
  ],
};
