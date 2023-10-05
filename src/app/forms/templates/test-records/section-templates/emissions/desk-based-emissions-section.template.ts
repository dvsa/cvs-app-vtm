import { FormNode, FormNodeTypes, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';

export const DeskBasedEmissionsSection: FormNode = {
  name: 'deskBasedEmissionsSection',
  label: 'Emissions',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testTypes',
      label: 'Test Types',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0', // it is important here that the name of the node for an ARRAY type should be an index value
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'emissionStandard',
              label: 'Emissions standard',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.RADIO,
              options: getOptionsFromEnum(EmissionStandard),
              required: true,
              value: null,
            },
            {
              name: 'smokeTestKLimitApplied',
              label: 'Smoke test K limit applied',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              required: true,
              value: null,
            },
            {
              name: 'fuelType',
              label: 'Fuel type',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'diesel', label: 'Diesel' },
                { value: 'gas-cng', label: 'Gas-CNG' },
                { value: 'gas-lng', label: 'Gas-LNG' },
                { value: 'gas-lpg', label: 'Gas-LPG' },
                { value: 'fuel cell', label: 'Fuel cell' },
                { value: 'petrol', label: 'Petrol' },
                { value: 'full electric', label: 'Full electric' },
              ],
              required: true,
              value: null,
            },
            {
              name: 'modType',
              label: 'Modification Type',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'code',
                  label: 'Modification code',
                  type: FormNodeTypes.CONTROL,
                  editType: FormNodeEditTypes.RADIO,
                  options: [
                    { value: 'p', label: 'P' },
                    { value: 'm', label: 'M' },
                    { value: 'g', label: 'G' },
                  ],
                  validators: [
                    { name: ValidatorNames.HideIfParentSiblingEqual, args: { sibling: 'modificationTypeUsed', value: 'p' } },
                    { name: ValidatorNames.HideIfParentSiblingNotEqual, args: { sibling: 'particulateTrapFitted', value: 'p' } },
                    { name: ValidatorNames.HideIfParentSiblingNotEqual, args: { sibling: 'particulateTrapSerialNumber', value: 'p' } },
                  ],
                },
                {
                  name: 'description',
                  label: 'Modification description',
                  type: FormNodeTypes.CONTROL,
                  editType: FormNodeEditTypes.RADIO,
                  options: [
                    { value: 'particulate trap', label: 'Particulate trap' },
                    { value: 'modification or change of engine', label: 'Modification or change of engine' },
                    { value: 'gas engine', label: 'Gas engine' },
                  ],
                },
              ],
            },
            {
              name: 'modificationTypeUsed',
              label: 'Modification type used',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'm' },
                },
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'g' },
                },
              ],
              required: true,
              value: null,
            },
            {
              name: 'particulateTrapFitted',
              label: 'Particulate trap fitted',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'p' },
                },
              ],
              required: true,
              value: null,
            },
            {
              name: 'particulateTrapSerialNumber',
              label: 'Particulate trap serial number',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'p' },
                },
              ],
              required: true,
              value: null,
            },
          ],
        },
      ],
    },
  ],
};
