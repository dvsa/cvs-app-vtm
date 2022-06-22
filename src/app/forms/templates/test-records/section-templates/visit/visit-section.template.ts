import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const VisitSection: FormNode = {
  name: 'visitSection',
  label: 'Visit',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'testFacilityCombination',
      label: 'Test facility name/number',
      type: FormNodeTypes.COMBINATION,
      options: {
        leftComponentName: 'testStationName',
        rightComponentName: 'testStationPNumber',
        separator: ' / '
      },
      disabled: true
    },
    {
      name: 'testStationName',
      label: 'Test Station Name',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      disabled: true
    },
    {
      name: 'testStationPNumber',
      label: 'Test Station Number',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      disabled: true
    },
    {
      name: 'testStationType',
      label: 'Type of test facility',
      type: FormNodeTypes.CONTROL,
      disabled: true
    },
    {
      name: 'testerName',
      label: 'Tester name',
      type: FormNodeTypes.CONTROL,
      disabled: true
    },
    {
      name: 'testerEmailAddress',
      label: 'Tester email address',
      type: FormNodeTypes.CONTROL,
      disabled: true
    }
  ]
};
