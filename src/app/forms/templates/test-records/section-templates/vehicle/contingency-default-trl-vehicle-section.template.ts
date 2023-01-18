import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const ContingencyVehicleSectionDefaultTrl: FormNode = {
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
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'trailerId',
      label: 'Trailer ID',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'countryOfRegistration',
      label: 'Country Of Registration',
      value: '',
      options: [],
      width: FormNodeWidth.XL,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: ReferenceDataResourceType.CountryOfRegistration,
      type: FormNodeTypes.CONTROL,
      asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotAbandoned }]
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XS
    },
    {
      name: 'preparerName',
      label: 'Preparer Name',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      disabled: true
    },
    {
      name: 'preparerId',
      label: 'Preparer ID',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      disabled: true
    }
  ]
};
