import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const TrlPurchasers: FormNode = {
  name: 'purchaserSection',
  type: FormNodeTypes.GROUP,
  label: 'Purchasers',
  children: [
    {
      name: 'techRecord_purchaserDetails_name',
      label: 'Name or company',
      value: null,
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
      customId: 'purchaserName'
    },
    {
      name: 'techRecord_purchaserDetails_address1',
      label: 'Address line 1',
      value: null,
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'purchaserAddress1'
    },
    {
      name: 'techRecord_purchaserDetails_address2',
      label: 'Address line 2',
      value: null,
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'purchaserAddress2'
    },
    {
      name: 'techRecord_purchaserDetails_postTown',
      label: 'Town or city',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'purchaserPostTown'
    },
    {
      name: 'techRecord_purchaserDetails_address3',
      label: 'County',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'purchaserCounty'
    },
    {
      name: 'techRecord_purchaserDetails_postCode',
      label: 'Postcode',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
      customId: 'purchaserPostCode'
    },
    {
      name: 'techRecord_purchaserDetails_telephoneNumber',
      label: 'Telephone number',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customId: 'purchaserTelephoneNumber'
    },
    {
      name: 'techRecord_purchaserDetails_emailAddress',
      label: 'Email address',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 255 }, { name: ValidatorNames.Email }],
      customId: 'purchaserEmailAddress'
    },
    {
      name: 'techRecord_purchaserDetails_faxNumber',
      label: 'Fax Number',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customId: 'purchaserFaxNumber'
    },
    {
      name: 'techRecord_purchaserDetails_purchaserNotes',
      label: 'Purchaser Notes',
      value: null,
      editType: FormNodeEditTypes.TEXTAREA,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
    }
  ]
};
