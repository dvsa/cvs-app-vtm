import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, FuelTypes } from '@models/vehicle-tech-record.model';
import { VehicleSize } from '@models/vehicle-size.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';

export function getPsvTechRecord(_isEditing: boolean): FormNode {
  const PsvTechRecord: FormNode = {
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
        name: 'regnDate',
        label: 'Date of first registration',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.DATE,
        editType: FormNodeEditTypes.DATE,
        validators: [{ name: ValidatorNames.Required }],
        isoDate: false
      },
      {
        name: 'manufactureYear',
        label: 'Year of manufacture',
        value: '',
        width: FormNodeWidth.XS,
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.NUMBER,
        validators: [{ name: ValidatorNames.Max, args: 9999 }, { name: ValidatorNames.Min, args: 1000 }, { name: ValidatorNames.Required }]
      },
      {
        name: 'noOfAxles',
        label: 'Number of axles',
        value: '',
        width: FormNodeWidth.XXS,
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.Required }],
        disabled: true
      },
      {
        name: 'speedLimiterMrk',
        label: 'Speed limiter exempt',
        value: '',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.RADIO,
        options: [
          { value: true, label: 'Exempt' },
          { value: false, label: 'Not exempt' }
        ],
        validators: [{ name: ValidatorNames.Required }],
        class: 'flex--half'
      },
      {
        name: 'tachoExemptMrk',
        label: 'Tacho exempt',
        value: '',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.RADIO,
        options: [
          { value: true, label: 'Exempt' },
          { value: false, label: 'Not exempt' }
        ],
        validators: [{ name: ValidatorNames.Required }],
        class: 'flex--half'
      },
      {
        name: 'euroStandard',
        label: 'Euro standard',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.RADIO,
        options: getOptionsFromEnum(EmissionStandard),
        validators: [{ name: ValidatorNames.Defined }]
      },
      {
        name: 'fuelPropulsionSystem',
        label: 'Fuel / propulsion system',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING,
        editType: FormNodeEditTypes.SELECT,
        options: getOptionsFromEnum(FuelTypes),
        validators: [{ name: ValidatorNames.Required }]
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
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING,
            editType: FormNodeEditTypes.SELECT,
            options: getOptionsFromEnum(VehicleClass.DescriptionEnum),
            class: '.govuk-input--width-10'
          }
        ],
        validators: [{ name: ValidatorNames.Required }]
      },
      {
        name: 'vehicleConfiguration',
        label: 'Vehicle configuration',
        value: '',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.SELECT,
        options: getOptionsFromEnum(VehicleConfiguration),
        validators: [{ name: ValidatorNames.Required }]
      },
      {
        name: 'euVehicleCategory',
        label: 'EU vehicle category',
        value: '',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.SELECT,
        width: FormNodeWidth.S,
        options: getOptionsFromEnum(EuVehicleCategories),
        validators: [{ name: ValidatorNames.Required }]
      },
      {
        name: 'emissionsLimit',
        label: 'Emission limit (plate value)',
        value: '' || null,
        width: FormNodeWidth.XXS,
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.NUMBER,
        validators: [{ name: ValidatorNames.Max, args: 99 }]
      },
      { name: 'seatsTitle', label: `${_isEditing ? 'Seats:' : ''}`, type: FormNodeTypes.TITLE },
      {
        name: 'seatsUpperDeck',
        label: `${_isEditing ? 'Upper deck' : 'Seats upper deck'}`,
        value: '',
        width: FormNodeWidth.M,
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.NUMBER,
        validators: [{ name: ValidatorNames.Max, args: 99 }, { name: ValidatorNames.Required }],
        class: 'flex--half'
      },
      {
        name: 'seatsLowerDeck',
        label: `${_isEditing ? 'Lower Deck' : 'Seats lower deck'}`,
        value: '',
        width: FormNodeWidth.M,
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.NUMBER,
        validators: [{ name: ValidatorNames.Max, args: 999 }, { name: ValidatorNames.Required }],
        class: 'flex--half'
      },
      {
        name: 'standingCapacity',
        label: 'Standing capacity',
        value: '',
        width: FormNodeWidth.XXS,
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.NUMBER,
        validators: [{ name: ValidatorNames.Max, args: 999 }, { name: ValidatorNames.Required }]
      },
      {
        name: 'numberOfSeatbelts',
        label: 'Number of seat belts',
        value: '',
        width: FormNodeWidth.XXS,
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.NUMERICSTRING,
        validators: [{ name: ValidatorNames.Max, args: 99 }, { name: ValidatorNames.Required }]
      },
      {
        name: 'seatbeltInstallationApprovalDate',
        label: 'Seatbelt installation approval date / type approved',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.DATE,
        editType: FormNodeEditTypes.DATE,
        isoDate: false
      },
      {
        name: 'vehicleSize',
        label: 'Vehicle size',
        value: '',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.RADIO,
        options: getOptionsFromEnum(VehicleSize)
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
  return PsvTechRecord;
}
