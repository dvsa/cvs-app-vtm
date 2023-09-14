import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, VehicleSubclass } from '@models/vehicle-tech-record.model';

export const SmallTrailerTechRecord: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  children: [
    {
      name: 'techRecord_vehicleType',
      label: 'Vehicle type',
      value: '',
      width: FormNodeWidth.S,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE,
      disabled: true,
      validators: []
    },
    {
      name: 'techRecord_statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
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
        { name: ValidatorNames.Min, args: 1000 }
      ]
    },
    {
      name: 'techRecord_noOfAxles',
      label: 'Number of axles',
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99 }]
    },
    {
      customId: 'vehicleClassDescription',
      name: 'techRecord_vehicleClass_description',
      label: 'Vehicle class',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: [
        { label: 'motorbikes over 200cc or with a sidecar', value: 'motorbikes over 200cc or with a sidecar' },
        { label: 'not applicable', value: 'not applicable' },
        { label: 'small psv (ie: less than or equal to 22 passengers)', value: 'small psv (ie: less than or equal to 22 seats)' },
        { label: 'motorbikes up to 200cc', value: 'motorbikes up to 200cc' },
        { label: 'trailer', value: 'trailer' },
        { label: 'large psv(ie: greater than or equal to 23 passengers)', value: 'large psv(ie: greater than 23 seats)' },
        { label: '3 wheelers', value: '3 wheelers' },
        { label: 'heavy goods vehicle', value: 'heavy goods vehicle' },
        { label: 'MOT class 4', value: 'MOT class 4' },
        { label: 'MOT class 7', value: 'MOT class 7' },
        { label: 'MOT class 5', value: 'MOT class 5' }
      ],
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'techRecord_vehicleSubclass',
      label: 'Vehicle Subclass',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOXGROUP,
      options: getOptionsFromEnum(VehicleSubclass)
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration)
    },
    {
      name: 'techRecord_euVehicleCategory',
      label: 'EU vehicle category',
      value: EuVehicleCategories.O1,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.S,
      options: [
        {
          label: 'O1',
          value: EuVehicleCategories.O1
        },
        {
          label: 'O2',
          value: EuVehicleCategories.O2
        }
      ]
    }
  ]
};
