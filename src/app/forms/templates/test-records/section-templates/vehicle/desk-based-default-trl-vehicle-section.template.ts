import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const DeskBasedVehicleSectionDefaultTrl: FormNode = {
  name: 'vehicleSection',
  label: 'Vehicle Details',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'vin',
      label: 'VIN/chassis number',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'vrm',
      label: 'VRM',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'countryOfRegistration',
      label: 'Country Of Registration',
      value: '',
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      options: [],
      referenceData: ReferenceDataResourceType.CountryOfRegistration,
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXS
    },
    {
      name: 'preparerName',
      label: 'Preparer Name',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'preparerId',
      label: 'Preparer ID',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    }
  ]
};
