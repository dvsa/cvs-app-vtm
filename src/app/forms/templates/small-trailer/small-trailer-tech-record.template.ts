import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { EuVehicleCategories } from '@models/vehicle-tech-record.model';

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
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        { name: 'code', label: 'Vehicle Class code', value: '', customId: 'vehicleClassCode', type: FormNodeTypes.CONTROL },
        { name: 'description', label: 'Vehicle', value: '', customId: 'vehicleClassDescription', type: FormNodeTypes.CONTROL }
      ],
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'vehicleSubclass',
      label: 'Vehicle Subclass',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      validators: []
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: EuVehicleCategories.O1,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.S,
      disabled: true
    }
  ]
};
