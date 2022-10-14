import { ValidatorNames } from '@forms/models/validators.enum';
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
          label: 'Name or company',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 150 }, {name:ValidatorNames.Required}]
        },
        {
          name: 'address1',
          label: 'Address line 1',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }, {name:ValidatorNames.Required}]
        },
        {
          name: 'address2',
          label: 'Address line 2',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }, {name:ValidatorNames.Required}]
        },
        {
          name: 'postTown',
          label: 'Town or city',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }, {name:ValidatorNames.Required}]
        },
        {
          name: 'address3',
          label: 'County',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
        },
        {
          name: 'postCode',
          label: 'Postcode',
          value: '',
          width: FormNodeWidth.L,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 12 }]
        },
        {
          name: 'telephoneNumber',
          label: 'Telephone number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 225 }]
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
        },
        {
          name: 'purchaserNotes',
          label: 'Purchaser Notes',
          value: '',
          editType: FormNodeEditTypes.TEXTAREA,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
        },
      ]
    }
  ]
};
