import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const ContingencyVehicleSectionDefaultPsvHgv: FormNode = {
  name: 'vehicleSection',
  label: 'Vehicle Details',
  type: FormNodeTypes.GROUP,
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
      name: 'vrm',
      label: 'VRM',
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
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      options: [],
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
      width: FormNodeWidth.XXS
    },
    {
      name: 'odometerReading',
      label: 'Odometer Reading',
      value: null,
      validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 9999999 }],
      asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotAbandoned }],
      editType: FormNodeEditTypes.NUMBER,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      width: FormNodeWidth.L
    },
    {
      name: 'odometerReadingUnits',
      label: 'Odometer Reading Units',
      value: null,
      options: [
        { value: 'kilometres', label: 'Kilometres' },
        { value: 'miles', label: 'Miles' }
      ],
      type: FormNodeTypes.CONTROL,
      asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotAbandoned }],
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.RADIO
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
