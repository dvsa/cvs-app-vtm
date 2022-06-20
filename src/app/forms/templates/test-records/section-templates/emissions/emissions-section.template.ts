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
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'smokeTestKLimitApplied',
              label: 'Smoke test K limit applied',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'fuelType',
              label: 'Fuel type',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'modType',
              label: 'Modification Type',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'code',
                  label: 'Modification code',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'description',
                  label: 'Modification description',
                  type: FormNodeTypes.CONTROL
                }
              ]
            },
            {
              name: 'modificationTypeUsed',
              label: 'Modification type used',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'particulateTrapFitted',
              label: 'Particulate trap fitted',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'particulateTrapSerialNumber',
              label: 'Particulate trap serial number',
              type: FormNodeTypes.CONTROL
            }
          ]
        }
      ]
    }
  ]
};
