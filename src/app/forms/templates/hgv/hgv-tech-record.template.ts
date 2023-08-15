import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, FuelTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const HgvTechRecord: FormNode = {
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
      disabled: true
    },
    {
      name: 'techRecord_statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'techRecord_numberOfWheelsDriven',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'techRecord_regnDate',
      label: 'Date of first registration',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      validators: [],
      isoDate: false
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
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      validators: [],
      disabled: true
    },
    {
      name: 'techRecord_speedLimiterMrk',
      label: 'Speed limiter exempt',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Exempt' },
        { value: false, label: 'Not exempt' }
      ],
      validators: [],
      class: 'flex--half'
    },
    {
      name: 'techRecord_tachoExemptMrk',
      label: 'Tacho exempt',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Exempt' },
        { value: false, label: 'Not exempt' }
      ],
      validators: [],
      class: 'flex--half'
    },
    {
      name: 'techRecord_euroStandard',
      label: 'Euro standard',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: getOptionsFromEnum(EmissionStandard)
    },
    {
      name: 'techRecord_roadFriendly',
      label: 'Road friendly suspension',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      name: 'techRecord_fuelPropulsionSystem',
      label: 'Fuel / propulsion system',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FuelTypes),
      validators: []
    },
    {
      name: 'techRecord_drawbarCouplingFitted',
      label: 'Drawbar coupling fitted',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      name: 'techRecord_vehicleClass_description',
      label: 'Vehicle class',
      value: '',
      customId: 'vehicleClassDescription',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleClass.DescriptionEnum),
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      validators: []
    },
    {
      name: 'techRecord_offRoad',
      label: 'Off road vehicle',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      name: 'techRecord_euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.S,
      options: getOptionsFromEnum(EuVehicleCategories),
      validators: []
    },
    {
      name: 'techRecord_emissionsLimit',
      label: 'Emission limit (plate value)',
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99 }]
    },
    {
      name: 'techRecord_departmentalVehicleMarker',
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
      name: 'techRecord_alterationMarker',
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
