import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, FrameDescriptions } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const TrlTechRecordTemplate: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  children: [
    {
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE,
      disabled: true
    },
    {
      name: 'statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'regnDate',
      label: 'Date of first registration',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,

      isoDate: false
    },
    {
      name: 'manufactureYear',
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
      name: 'firstUseDate',
      label: 'Date of first use',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,

      isoDate: false
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,

      disabled: true
    },
    {
      name: 'roadFriendly',
      label: 'Road friendly suspension',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      class: 'flex--half'
    },
    {
      name: 'suspensionType',
      label: 'Suspension type (optional)',
      value: '',
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: [
        { value: 'S', label: 'Steel' },
        { value: 'R', label: 'Rubber' },
        { value: 'A', label: 'Air' },
        { value: 'H', label: 'Hydraulic' },
        { value: 'O', label: 'Other' }
      ],
      class: 'flex--half'
    },
    {
      name: 'vehicleClass',
      label: 'Vehicle class',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'description',
          label: 'Vehicle class',
          value: '',
          customId: 'vehicleClassDescription',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.SELECT,
          options: getOptionsFromEnum(VehicleClass.retrieveVehicleClassesByType('trl')),
          validators: [{ name: ValidatorNames.Required }]
        }
      ]
    },
    {
      name: 'couplingType',
      label: 'Coupling type (optional)',
      value: '',
      width: FormNodeWidth.M,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }],
      class: 'flex--half'
    },
    {
      name: 'maxLoadOnCoupling',
      label: 'Max load on coupling (optional)',
      value: null,
      width: FormNodeWidth.M,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      class: 'flex--half'
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
      name: 'frameDescription',
      label: 'Frame description (optional)',
      value: '',
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FrameDescriptions)
    },
    {
      name: 'departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(EuVehicleCategories).filter(option => option.value !== EuVehicleCategories.O1),
      width: FormNodeWidth.S
    },
    {
      name: 'alterationMarker',
      label: 'Alteration marker',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    }
  ]
};
