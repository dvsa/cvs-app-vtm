import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const ManufacturerTemplate: FormNode = {
  name: 'manufacturerSection',
  label: 'Manufacturer',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_manufacturerDetails_name',
      label: 'Name',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
      customId: 'manufacturerName'
    },
    {
      name: 'techRecord_manufacturerDetails_address1',
      label: 'Address line 1',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'manufacturerAddress1'
    },
    {
      name: 'techRecord_manufacturerDetails_address2',
      label: 'Address line 2',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'manufacturerAddress2'
    },
    {
      name: 'techRecord_manufacturerDetails_postTown',
      label: 'Town or City',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'manufacturerPostTown'
    },
    {
      name: 'techRecord_manufacturerDetails_address3',
      label: 'County',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'manufacturerCounty'
    },
    {
      name: 'techRecord_manufacturerDetails_postCode',
      label: 'Postcode',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
      customId: 'manufacturerPostCode'
    },
    {
      name: 'techRecord_manufacturerDetails_telephoneNumber',
      label: 'Telephone number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customId: 'manufacturerTelephoneNumber'
    },
    {
      name: 'techRecord_manufacturerDetails_emailAddress',
      label: 'Email address',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 255 }, { name: ValidatorNames.Email }],
      customId: 'manufacturerEmailAddress'
    },
    {
      name: 'techRecord_manufacturerDetails_faxNumber',
      label: 'Fax Number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customId: 'manufacturerFaxNumber'
    },
    {
      name: 'techRecord_manufacturerDetails_manufacturerNotes',
      label: 'Manufacturer Notes',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
    }
  ]
};
