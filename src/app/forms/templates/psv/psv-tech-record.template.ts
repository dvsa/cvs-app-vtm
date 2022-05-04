import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.service';

export const PsvTechRecord: FormNode = {
  name: 'techRecordSummary',
  label: 'Summary',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE
    },
    {
      name: 'regnDate',
      label: 'Date of first registration',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'manufactureYear',
      label: 'Year of manufacture',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
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
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        }
      ],
      type: FormNodeTypes.GROUP,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'axles',
      label: 'Axles fitted with a parking brake',
      value: '',
      children: [
        {
          name: 'parkingBrakeMrk',
          label: 'Axles fitted with a parking brake',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        }
      ],
      type: FormNodeTypes.GROUP,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'speedLimiterMrk',
      label: 'Speed limiter exempt',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'tachoExemptMrk',
      label: 'Tacho exempt',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'euroStandard',
      label: 'Euro standard',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'fuelPropulsionSystem',
      label: 'Fuel / propulsion system',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
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
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        }
      ]
    },
    {
      name: 'vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'emissionsLimit',
      label: 'Emission limit (plate value)',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'seatsLowerDeck',
      label: 'Seats lower deck',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'seatsUpperDeck',
      label: 'Seats upper deck',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'standingCapacity',
      label: 'Standing capacity',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'vehicleSize',
      label: 'Vehicle size',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'numberOfSeatbelts',
      label: 'Number of seat belts',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'seatbeltInstallationApprovalDate',
      label: 'Seatbelt installation approval date / type approved',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    }
  ]
};
