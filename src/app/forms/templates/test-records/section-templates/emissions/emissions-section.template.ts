import { FormNode, FormNodeTypes, FormNodeViewTypes, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
export const EmissionsSection: FormNode = {
  name: 'emissionsSection',
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
              options: [
                { value: '0.10 g/kWh Euro 3 PM', label: '0.10 g/kWh Euro 3 PM' },
                { value: '0.03 g/kWh Euro IV PM', label: '0.03 g/kWh Euro IV PM' },
                { value: 'Euro 3', label: 'Euro 3' },
                { value: 'Euro 4', label: 'Euro 4' },
                { value: 'Euro 6', label: 'Euro 6' },
                { value: 'Euro VI', label: 'Euro VI' },
                { value: 'Full Electric', label: 'Full Electric' }
              ],
              asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotResult, args: { testResult: ['fail', 'abandoned'] } }],
              required: true,
              value: null
            },
            {
              name: 'smokeTestKLimitApplied',
              label: 'Smoke test K limit applied',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotResult, args: { testResult: ['fail', 'abandoned'] } }],
              required: true,
              value: null
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
                { value: 'full electric', label: 'Full electric' }
              ],
              asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotResult, args: { testResult: ['fail', 'abandoned'] } }],
              required: true,
              value: null
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
                    { value: 'g', label: 'G' }
                  ],
                  validators: [
                    { name: ValidatorNames.HideIfParentSiblingEqual, args: { sibling: 'modificationTypeUsed', value: 'p' } },
                    { name: ValidatorNames.HideIfParentSiblingNotEqual, args: { sibling: 'particulateTrapFitted', value: 'p' } },
                    { name: ValidatorNames.HideIfParentSiblingNotEqual, args: { sibling: 'particulateTrapSerialNumber', value: 'p' } }
                  ],
                  asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotResult, args: { testResult: ['fail', 'abandoned'] } }],
                },
                {
                  name: 'description',
                  label: 'Modification description',
                  type: FormNodeTypes.CONTROL,
                  editType: FormNodeEditTypes.RADIO,
                  options: [
                    { value: 'particulate trap', label: 'Particulate trap' },
                    { value: 'modification or change of engine', label: 'Modification or change of engine' },
                    { value: 'gas engine', label: 'Gas engine' }
                  ]
                }
              ]
            },
            {
              name: 'modificationTypeUsed',
              label: 'Modification type used',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'm' }
                },
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'g' }
                }
              ],
              required: true,
              value: null
            },
            {
              name: 'particulateTrapFitted',
              label: 'Particulate trap fitted',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'p' }
                }
              ],
              required: true,
              value: null
            },
            {
              name: 'particulateTrapSerialNumber',
              label: 'Particulate trap serial number',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              asyncValidators: [
                {
                  name: AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals,
                  args: { testResult: ['fail', 'abandoned'], sibling: 'modType.code', value: 'p' }
                }
              ],
              required: true,
              value: null
            }
          ]
        }
      ]
    }
  ]
};
