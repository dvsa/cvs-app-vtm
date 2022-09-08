import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const VehicleSectionTrlGroups5n6n11n13: FormNode = {
  name: 'vehicleSection',
  label: 'Vehicle Details',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'vin',
      label: 'VIN/chassis number',
      value: '',
      disabled: true,

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'trailerId',
      label: 'Trailer ID',
      value: '',
      disabled: true,

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'countryOfRegistration',
      label: 'Country Of Registration',
      value: '',
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      options: [],
      referenceData: ReferenceDataResourceType.CountryOfRegistration,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',
      disabled: true,

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'odometerCombination',
      label: 'Odometer',
      type: FormNodeTypes.COMBINATION,
      options: {
        leftComponentName: 'odometerReading',
        rightComponentName: 'odometerReadingUnits',
        separator: ' '
      },
      disabled: true
    },
    {
      name: 'odometerReading',
      label: 'Odometer Reading',
      value: '',
      validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Required }],
      editType: FormNodeEditTypes.NUMBER,

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'odometerReadingUnits',
      label: 'Odometer Reading Units',
      value: '',
      options: [
        { value: 'kilometres', label: 'Kilometres' },
        { value: 'miles', label: 'Miles' }
      ],

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.RADIO
    },
    {
      name: 'preparerCombination',
      label: 'Preparer',
      type: FormNodeTypes.COMBINATION,
      options: {
        leftComponentName: 'preparerName',
        rightComponentName: 'preparerId',
        separator: ' - '
      },
      disabled: true
    },
    {
      name: 'preparerName',
      label: 'Preparer Name',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      disabled: true
    },
    {
      name: 'preparerId',
      label: 'Preparer ID',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      disabled: true
    }
  ]
};
