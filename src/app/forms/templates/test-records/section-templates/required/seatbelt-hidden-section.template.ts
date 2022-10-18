import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const SeatbeltHiddenSection: FormNode = {
  name: 'requiredSection',
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
              name: 'seatbeltInstallationCheckDate',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN,
              value: null
            },
            {
              name: 'numberOfSeatbeltsFitted',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN,
              value: null
            },
            {
              name: 'lastSeatbeltInstallationCheckDate',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null
            }
          ]
        }
      ]
    }
  ]
};
