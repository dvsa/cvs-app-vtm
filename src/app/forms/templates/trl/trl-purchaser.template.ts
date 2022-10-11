import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

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
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 150 }, { name: ValidatorNames.Required }]
        },
        {
          name: 'address1',
          label: 'Building and street (box 1 of 2)',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }, { name: ValidatorNames.Required }]
        },
        {
          name: 'address2',
          label: 'Building and street (box 2 of 2)',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }, { name: ValidatorNames.Required }]
        },
        {
          name: 'postTown',
          label: 'Town or city',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }, { name: ValidatorNames.Required }]
        },
        {
          name: 'address3',
          label: 'County',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
        },
        {
          name: 'postCode',
          label: 'Postcode',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 12 }]
        },
        {
          name: 'telephoneNumber',
          label: 'Telephone number',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 225 }]
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
        },
        {
          name: 'purchaserNotes',
          label: 'Purchaser Notes',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
        },
      ]
    }
  ]
};
