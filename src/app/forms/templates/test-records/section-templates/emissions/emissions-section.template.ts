import { FormNode, FormNodeTypes, FormNodeViewTypes, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { Validators } from '@forms/models/validators.enum';
import { CodeChallengeMethodValues } from '@azure/msal-common/dist/utils/Constants';
export const EmissionsSection: FormNode = {
  name: 'emissionsSection',
  label: 'Emissions',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
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
              validators: [{ name: Validators.Required }]
            },
            {
              name: 'smokeTestKLimitApplied',
              label: 'Smoke test K limit applied',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: Validators.MaxLength, args: 100 }, { name: Validators.Required }]
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
              validators: [{ name: Validators.Required }]
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
                    { name: Validators.HideIfParentSiblingEqual, args: { sibling: 'modificationTypeUsed', value: 'p' } },
                    { name: Validators.HideIfParentSiblingNotEqual, args: { sibling: 'particulateTrapFitted', value: 'p' } },
                    { name: Validators.HideIfParentSiblingNotEqual, args: { sibling: 'particulateTrapSerialNumber', value: 'p' } }
                  ]
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
              validators: [
                { name: Validators.MaxLength, args: 100 },
                { name: Validators.RequiredIfEquals, args: { sibling: 'modType.code', value: 'm' } },
                { name: Validators.RequiredIfEquals, args: { sibling: 'modType.code', value: 'g' } }
              ],
              value: ''
            },
            {
              name: 'particulateTrapFitted',
              label: 'Particulate trap fitted',
              type: FormNodeTypes.CONTROL,
              validators: [
                { name: Validators.MaxLength, args: 100 },
                { name: Validators.RequiredIfEquals, args: { sibling: 'modType.code', value: 'p' } }
              ],
              value: ''
            },
            {
              name: 'particulateTrapSerialNumber',
              label: 'Particulate trap serial number',
              type: FormNodeTypes.CONTROL,
              validators: [
                { name: Validators.MaxLength, args: 100 },
                { name: Validators.RequiredIfEquals, args: { sibling: 'modType.code', value: 'p' } }
              ],
              value: ''
            }
          ]
        }
      ]
    }
  ]
};
