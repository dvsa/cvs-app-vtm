import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';

export const ContingencyM1IvaVehicleSection: FormNode = {
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
      editType: FormNodeEditTypes.HIDDEN,
    },
    {
      name: 'vrm',
      label: 'VRM',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
    },
    {
      name: 'countryOfRegistration',
      label: 'Country Of Registration',
      value: '',
      options: [],
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: ReferenceDataResourceType.CountryOfRegistration,
      type: FormNodeTypes.CONTROL,
      asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotAbandoned }],
      width: FormNodeWidth.XL,
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.S,
      options: getOptionsFromEnum(EUVehicleCategory),
      validators: [{ name: ValidatorNames.Required }],
    },
    {
      name: 'odometerReading',
      label: 'Odometer Reading',
      value: null,
      validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 9999999 },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'odometerReadingUnits', value: ['miles', 'kilometres'] } },
        { name: ValidatorNames.SetSiblingAsTouchedIfNotEqual, args: { sibling: 'odometerReadingUnits', value: [null] } },
      ],
      editType: FormNodeEditTypes.NUMBER,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      width: FormNodeWidth.L,
    },
    {
      name: 'odometerReadingUnits',
      label: 'Odometer Reading Units',
      validators: [{ name: ValidatorNames.RequiredIfNotEquals, args: { sibling: 'odometerReading', value: [null] } },
        { name: ValidatorNames.SetSiblingAsTouchedIfNotEqual, args: { sibling: 'odometerReading', value: [null] } }],

      value: null,
      options: [
        { value: 'kilometres', label: 'Kilometres' },
        { value: 'miles', label: 'Miles' },
      ],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.SELECT,
    },
    {
      name: 'preparerName',
      label: 'Preparer Name',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      disabled: true,
    },
    {
      name: 'preparerId',
      label: 'Preparer ID',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      disabled: true,
    },
  ],
};
