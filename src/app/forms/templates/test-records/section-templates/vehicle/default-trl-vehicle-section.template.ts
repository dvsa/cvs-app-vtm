import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

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
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'trailerId',
      label: 'Trailer ID',
      value: '',
      disabled: true,
      width: FormNodeWidth.L,
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
      width: FormNodeWidth.XXS,
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
