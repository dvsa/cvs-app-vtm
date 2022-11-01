import { ValidatorNames } from '@forms/models/validators.enum';
import getOptionsFromEnum from '@forms/utils/enum-map';
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
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.Max, args: 9999 },
        { name: ValidatorNames.Min, args: 1000 },
        { name: ValidatorNames.Numeric },
        { name: ValidatorNames.Required }
      ]
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Required }],
    },
    {
      name: 'brakes',
      label: 'DTP number',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'dtpNumber',
          label: 'DTP number',
          value: '',
          width: FormNodeWidth.M,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.Required }],
        }
      ],
    },
    // {
    //   name: 'axles',
    //   value: '',
    //   type: FormNodeTypes.ARRAY,
    //   children: [
    //     {
    //       name: '0',
    //       label: 'Axle',
    //       value: '',
    //       type: FormNodeTypes.GROUP,
    //       children: [
    //         {
    //           name: 'parkingBrakeMrk',
    //           label: 'Axles fitted with a parking brake',
    //           value: '',

    //           type: FormNodeTypes.CONTROL,
    //           viewType: FormNodeViewTypes.STRING
    //         }
    //       ]
    //     }
    //   ]
    // },
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
      name: 'roadFriendly',
      label: 'Road friendly suspension',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
    },
    {
      name: 'fuelPropulsionSystem',
      label: 'Fuel / propulsion system',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FuelTypes),
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'drawbarCouplingFitted',
      label: 'Drawbar coupling fitted',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
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
          editType: FormNodeEditTypes.SELECT,
          options: getOptionsFromEnum(VehicleClass.DescriptionEnum)
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
      name: 'offRoad',
      label: 'Off road vehicle',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(EuVehicleCategories),
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'emissionsLimit',
      label: 'Emission limit (plate value)',
      value: '' || null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.Min, args: 0 },
        { name: ValidatorNames.Max, args: 99 },
        { name: ValidatorNames.Numeric, args: 99 },
      ]
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
    }
  ]
};
