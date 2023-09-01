import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { VehicleClass } from '@models/vehicle-class.model';
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
      options: getOptionsFromEnum(VehicleClass.DescriptionEnum),
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
