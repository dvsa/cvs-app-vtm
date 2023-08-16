import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const ManufacturerTemplate: FormNode = {
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
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XXL,
          validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
          customId: 'manufacturerName'
        },
        {
          name: 'address1',
          label: 'Address line 1',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XXL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'manufacturerAddress1'
        },
        {
          name: 'address2',
          label: 'Address line 2',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XXL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'manufacturerAddress2'
        },
        {
          name: 'postTown',
          label: 'Town or City',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'manufacturerPostTown'
        },
        {
          name: 'address3',
          label: 'County',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'manufacturerCounty'
        },
        {
          name: 'postCode',
          label: 'Postcode',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.L,
          validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
          customId: 'manufacturerPostCode'
        },
        {
          name: 'telephoneNumber',
          label: 'Telephone number',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
          customId: 'manufacturerTelephoneNumber'
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XL,
          validators: [{ name: ValidatorNames.MaxLength, args: 255 }, { name: ValidatorNames.Email }],
          customId: 'manufacturerEmailAddress'
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          type: FormNodeTypes.CONTROL,
          width: FormNodeWidth.XL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
          customId: 'manufacturerFaxNumber'
        },
        {
          name: 'manufacturerNotes',
          label: 'Manufacturer Notes',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
        }
      ]
    }
  ]
};
