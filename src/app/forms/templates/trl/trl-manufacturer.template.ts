import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlManufacturerTemplate: FormNode = {
  name: 'manufacturerSection',
  label: 'Manufacturer',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'manufacturerDetails',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'name',
          label: 'Name',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address1',
          label: 'Building and street',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address2',
          label: 'Building and street',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'postTown',
          label: 'Town or city',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'address3',
          label: 'County',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'postCode',
          label: 'Postcode',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'telephonenumber',
          label: 'Telephone number',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'manufacturerNotes',
          label: 'Manufacturer Notes',
          type: FormNodeTypes.CONTROL
        },
      ]
    }
  ]
};
