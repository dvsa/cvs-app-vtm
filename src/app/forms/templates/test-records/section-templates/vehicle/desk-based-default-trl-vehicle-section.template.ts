import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { EuVehicleCategories } from '@models/vehicle-tech-record.model';

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
      name: 'trailerId',
      label: 'Trailer ID',
      value: '',
      disabled: true,
      width: FormNodeWidth.L,
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
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.S,
      options: getOptionsFromEnum(EuVehicleCategories),
      validators: [{ name: ValidatorNames.Required }]
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
