import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const TrlPurchasers: FormNode = {
  name: 'purchaserSection',
  type: FormNodeTypes.GROUP,
  label: 'Purchasers',
  children: [
    {
      name: 'purchaserDetails',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'name',
          label: 'Name',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address1',
          label: 'Address line 1',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address2',
          label: 'Address line 2',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'postTown',
          label: 'Town or city',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address3',
          label: 'County',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'postCode',
          label: 'Postcode',
          value: '',
          width: FormNodeWidth.L,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'telephoneNumber',
          label: 'Telephone number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'purchaserNotes',
          label: 'Purchaser Notes',
          value: '',
          editType: FormNodeEditTypes.TEXTAREA,
          type: FormNodeTypes.CONTROL
        },
      ]
    }
  ]
};
