import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

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
              disabled: true
            },
            {
              name: 'smokeTestKLimitApplied',
              label: 'Smoke test K limit applied',
              type: FormNodeTypes.CONTROL,
              disabled: true
            },
            {
              name: 'fuelType',
              label: 'Fuel type',
              type: FormNodeTypes.CONTROL,
              disabled: true
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
                  disabled: true
                },
                {
                  name: 'description',
                  label: 'Modification description',
                  type: FormNodeTypes.CONTROL,
                  disabled: true
                }
              ]
            },
            {
              name: 'modificationTypeUsed',
              label: 'Modification type used',
              type: FormNodeTypes.CONTROL,
              disabled: true
            },
            {
              name: 'particulateTrapFitted',
              label: 'Particulate trap fitted',
              type: FormNodeTypes.CONTROL,
              disabled: true
            },
            {
              name: 'particulateTrapSerialNumber',
              label: 'Particulate trap serial number',
              type: FormNodeTypes.CONTROL,
              disabled: true
            }
          ]
        }
      ]
    }
  ]
};
