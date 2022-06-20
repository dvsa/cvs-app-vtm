import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const SeatbeltSection: FormNode = {
  name: 'seatbeltSection',
  label: 'Seatbelt',
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
              name: 'seatbeltInstallationCheckDate',
              label: 'Carried out during test',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'numberOfSeatbeltsFitted',
              label: 'Number of seatbelts fitted',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'lastSeatbeltInstallationCheckDate',
              label: 'Most recent installation check',
              value: '',

              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE
            }
          ]
        }
      ]
    }
  ]
};
