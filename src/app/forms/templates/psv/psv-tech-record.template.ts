import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { VehicleSize } from '@models/vehicle-size.enum';
import { EuVehicleCategories, FuelTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const PsvTechRecord: FormNode = {
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
      value: null,
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
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      validators: [],
      disabled: true
    },
    {
      name: 'techRecord_speedLimiterMrk',
      label: 'Speed limiter exempt',
      value: null,
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
      value: null,
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
      name: 'techRecord_fuelPropulsionSystem',
      label: 'Fuel / propulsion system',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FuelTypes),
      validators: []
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      validators: []
    },
    {
      name: 'techRecord_euVehicleCategory',
      label: 'EU vehicle category',
      value: null,
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
    { name: 'seatsTitle', label: 'Seats:', type: FormNodeTypes.TITLE },
    {
      name: 'techRecord_seatsUpperDeck',
      label: 'Upper deck',
      value: null,
      width: FormNodeWidth.M,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.Max, args: 99 },
        {
          name: ValidatorNames.HandlePsvPassengersChange,
          args: { passengersOne: 'techRecord_seatsLowerDeck', passengersTwo: 'techRecord_standingCapacity' }
        }
      ],
      class: 'flex--half'
    },
    {
      name: 'techRecord_seatsLowerDeck',
      label: 'Lower deck',
      value: null,
      width: FormNodeWidth.M,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.Max, args: 999 },
        {
          name: ValidatorNames.HandlePsvPassengersChange,
          args: { passengersOne: 'techRecord_standingCapacity', passengersTwo: 'techRecord_seatsUpperDeck' }
        }
      ],
      class: 'flex--half'
    },
    {
      name: 'techRecord_standingCapacity',
      label: 'Standing capacity',
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.Max, args: 999 },
        {
          name: ValidatorNames.HandlePsvPassengersChange,
          args: { passengersOne: 'techRecord_seatsLowerDeck', passengersTwo: 'techRecord_seatsUpperDeck' }
        }
      ]
    },
    {
      name: 'techRecord_vehicleClass_description',
      label: 'Vehicle class',
      value: null,
      hint: 'The Vehicle Class is calculated automatically based on the number of seats and standing capacity. Only change the Class if you need to',
      customId: 'vehicleClassDescription',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleClass.DescriptionEnum),
      class: '.govuk-input--width-10',
      validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.HandlePsvClassChange }]
    },
    {
      name: 'techRecord_vehicleSize',
      label: 'Vehicle size',
      value: null,
      hint: 'The Vehicle Size is calculated automatically based on the number of seats and standing capacity. Only change the Size if you need to',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: getOptionsFromEnum(VehicleSize),
      validators: [{ name: ValidatorNames.HandlePsvSizeChange }]
    },
    {
      name: 'techRecord_numberOfSeatbelts',
      label: 'Number of seat belts',
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMERICSTRING,
      validators: [{ name: ValidatorNames.Max, args: 99 }]
    },
    {
      name: 'techRecord_seatbeltInstallationApprovalDate',
      label: 'Seatbelt installation approval date / type approved',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'techRecord_departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      validators: []
    },
    {
      name: 'techRecord_alterationMarker',
      label: 'Alteration marker',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      validators: []
    }
  ]
};
