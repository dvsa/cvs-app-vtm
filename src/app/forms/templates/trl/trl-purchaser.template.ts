import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

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
          validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
          customId: 'purchaserName'
        },
        {
          name: 'address1',
          label: 'Address line 1',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'purchaserAddress1'
        },
        {
          name: 'address2',
          label: 'Address line 2',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'purchaserAddress2'
        },
        {
          name: 'postTown',
          label: 'Town or city',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'purchaserPostTown'
        },
        {
          name: 'address3',
          label: 'County',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'purchaserCounty'
        },
        {
          name: 'postCode',
          label: 'Postcode',
          value: '',
          width: FormNodeWidth.L,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
          customId: 'purchaserPostCode'
        },
        {
          name: 'telephoneNumber',
          label: 'Telephone number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
          customId: 'purchaserTelephoneNumber'
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 255 }],
          customId: 'purchaserEmailAddress'
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
          customId: 'purchaserFaxNumber'
        },
        {
          name: 'purchaserNotes',
          label: 'Purchaser Notes',
          value: '',
          editType: FormNodeEditTypes.TEXTAREA,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
        }
      ]
    }
  ]
};
