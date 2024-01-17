import { ValidatorNames } from '@forms/models/validators.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth,
} from '../../services/dynamic-form.types';

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
    },
    {
      name: 'techRecord_manufacturerDetails_address1',
      label: 'Address line 1',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
    },
    {
      name: 'techRecord_manufacturerDetails_address2',
      label: 'Address line 2',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
    },
    {
      name: 'techRecord_manufacturerDetails_postTown',
      label: 'Town or City',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
    },
    {
      name: 'techRecord_manufacturerDetails_address3',
      label: 'County',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
    },
    {
      name: 'techRecord_manufacturerDetails_postCode',
      label: 'Postcode',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
    },
    {
      name: 'techRecord_manufacturerDetails_telephoneNumber',
      label: 'Telephone number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
    },
    {
      name: 'techRecord_manufacturerDetails_emailAddress',
      label: 'Email address',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 255 }, { name: ValidatorNames.Email }],
    },
    {
      name: 'techRecord_manufacturerDetails_faxNumber',
      label: 'Fax Number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
    },
    {
      name: 'techRecord_manufacturerDetails_manufacturerNotes',
      label: 'Manufacturer Notes',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],
    },
  ],
};
