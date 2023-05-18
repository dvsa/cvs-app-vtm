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
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',
      width: FormNodeWidth.S,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE,
      disabled: true,
      validators: []
    },
    {
      name: 'statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'manufactureYear',
      label: 'Year of manufacture',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.Max, args: 9999 },
        { name: ValidatorNames.Min, args: 1000 }
      ]
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'vehicleClass',
      type: FormNodeTypes.GROUP,
      children: [
        {
          customId: 'vehicleClassDescription',
          name: 'description',
          label: 'Vehicle class',
          value: '',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.SELECT,
          options: getOptionsFromEnum(VehicleClass.DescriptionEnum),
          validators: [{ name: ValidatorNames.Required }]
        }
      ]
    },
    {
      name: 'vehicleSubclass',
      label: 'Vehicle Subclass',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOXGROUP,
      options: getOptionsFromEnum(VehicleSubclass)
    },
    {
      name: 'vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration)
    },
    {
      name: 'euVehicleCategory',
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
