import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import getOptionsFromEnum from '@forms/utils/enum-map';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories } from '@models/vehicle-tech-record.model';
import { VehicleSize } from '@models/vehicle-size.enum';
import { FuelPropulsionSystem } from '@models/fuel-propulsion-system.model';

export const PsvTechRecord: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  children: [
    {
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE
    },
    {
      name: 'regnDate',
      label: 'Date of first registration',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      validators: [
        { name: ValidatorNames.Required }],
      isoDate: false

    },
    {
      name: 'manufactureYear',
      label: 'Year of manufacture',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.MaxLength, args: 4 }, { name: ValidatorNames.Required }]
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
    },
    {
      name: 'brakes',
      label: 'DTP number',
      value: '',
      children: [
        {
          name: 'dtpNumber',
          label: 'DTP number',
          value: '',

          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        }
      ],
      type: FormNodeTypes.GROUP,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'axles',  //Must display as a list: Axles fitted with a parking brake : Axle 1 [True], Axle 2 [false]
      value: '', // or, out of scope with the DTp / Axle management ticket?
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'parkingBrakeMrk',
              label: 'Axle fitted with parking brake',
              value: '',
              width: FormNodeWidth.S,
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.STRING
            }
          ]
        }
      ]
    },
    {
      name: 'speedLimiterMrk',
      label: 'Speed limiter exempt',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Exempt' },
        { value: false, label: 'Not exempt' }
      ],
      validators: [
        { name: ValidatorNames.Required }]
    },
    {
      name: 'tachoExemptMrk',
      label: 'Tacho exempt',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Exempt' },
        { value: false, label: 'Not exempt' }
      ],
      validators: [
        { name: ValidatorNames.Required }]
    },
    {
      name: 'euroStandard',
      label: 'Euro standard',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
      options: getOptionsFromEnum(EmissionStandard),
      validators: [
        { name: ValidatorNames.Required }]
    },
    {
      name: 'fuelPropulsionSystem',
      label: 'Fuel / propulsion system',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FuelPropulsionSystem),
      validators: [
        { name: ValidatorNames.Required }]
    },
    //Vehicle class code not in form state, so this won't appear until there is something in the DB
    // {
    //   name: '<DataObjName>',
    //   value: '',
    //   type: FormNodeTypes.GROUP,
    //   children: [
    //     {
    //       name: 'description',
    //       label: 'Vehicle class code',
    //       value: '',
    //       type: FormNodeTypes.CONTROL,
    //       viewType: FormNodeViewTypes.STRING,
    //       editType: FormNodeEditTypes.SELECT,
    //       options: getOptionsFromEnum(<CodeEnum>)
    //     }
    //   ]
    // },
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
          options: getOptionsFromEnum(VehicleClass.DescriptionEnum)
        }
      ],
      validators: [
        { name: ValidatorNames.Required }]
    },
    {
      name: 'vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      validators: [
        { name: ValidatorNames.Required }]
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(EuVehicleCategories),
      validators: [
        { name: ValidatorNames.Required }]
    },
    {
      name: 'emissionsLimit',
      label: 'Emission limit (plate value)',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.MaxLength, args: 2 }],

    },
    {
      name: 'seatsLowerDeck',   // Should display as a list : Seats: Lower Deck: 22, Upper deck: 0
      label: 'Seats lower deck',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.MaxLength, args: 3 }, { name: ValidatorNames.Required }],
    },
    {
      name: 'seatsUpperDeck',
      label: 'Seats upper deck',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.MaxLength, args: 2 }, { name: ValidatorNames.Required }],
    },
    {
      name: 'standingCapacity',
      label: 'Standing capacity',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.MaxLength, args: 3 }, { name: ValidatorNames.Required }],
    },
    {
      name: 'numberOfSeatbelts',
      label: 'Number of seat belts',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.MaxLength, args: 2 }, { name: ValidatorNames.Required }],
    },

    {
      name: 'seatbeltInstallationApprovalDate',
      label: 'Seatbelt installation approval date / type approved',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'vehicleSize',
      label: 'Vehicle size',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
      options: getOptionsFromEnum(VehicleSize)
    },
    {
      name: 'departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]

    }
  ]
};
