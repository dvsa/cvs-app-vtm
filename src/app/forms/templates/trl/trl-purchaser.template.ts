import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlPurchasers: FormNode = {
  name: 'purchaserSection',
  type: FormNodeTypes.GROUP,
  label: 'Purchasers',
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'purchaserDetails',
      type: FormNodeTypes.GROUP,
      children: [
        {
        name: 'name',
        label: 'Name',
        value: '',
        type: FormNodeTypes.CONTROL
      },
        {
          name: 'address1',
          label: 'Building and street (box 1 of 2)',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address2',
          label: 'Building and street (box 2 of 2)',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'postTown',
          label: 'Town or city',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address3',
          label: 'County',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'postCode',
          label: 'Postcode',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'telephoneNumber',
          label: 'Telephone number',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'purchaserNotes',
          label: 'Purchaser Notes',
          value: '',
          type: FormNodeTypes.CONTROL
        },
      ]
    }
  ]
};
