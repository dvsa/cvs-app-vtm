import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const VehicleSectionDefaultTrl: FormNode = {
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
      disabled: true,
      editType: FormNodeEditTypes.AUTOCOMPLETE,

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',
      disabled: true,

      type: FormNodeTypes.CONTROL
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
