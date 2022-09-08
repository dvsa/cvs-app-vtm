import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const SeatbeltSection: FormNode = {
  name: 'seatbeltSection',
  label: 'Seatbelt Installation Check',
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
              label: 'Was a seatbelt installation check carried out?',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.RADIO,
              value: null,
              options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ],
              validators: [{ name: ValidatorNames.Required }]
            },
            {
              name: 'numberOfSeatbeltsFitted',
              label: 'Number of seatbelts fitted',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.NUMBER,
              value: null,
              validators: [{ name: ValidatorNames.RequiredIfEquals, args: { sibling: 'seatbeltInstallationCheckDate', value: true } }]
            },
            {
              name: 'lastSeatbeltInstallationCheckDate',
              label: 'Most recent installation check',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE,
              value: null,
              validators: [{ name: ValidatorNames.RequiredIfEquals, args: { sibling: 'seatbeltInstallationCheckDate', value: true } }],
              hint: 'For example, 27 3 2022'
            }
          ]
        }
      ]
    }
  ]
};
