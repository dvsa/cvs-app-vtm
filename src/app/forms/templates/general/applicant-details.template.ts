import { FormNode, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';

export const ApplicantDetails: FormNode = {
  name: 'techRecord',
  type: FormNodeTypes.GROUP,
  label: 'Last Applicant',
  children: [
    {
      name: 'techRecord_applicantDetails_name',
      label: 'Name or company',
      value: '',
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
      customId: 'applicantName'
    },
    {
      name: 'techRecord_applicantDetails_address1',
      label: 'Address line 1',
      value: '',
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'applicantAddress1'
    },
    {
      name: 'techRecord_applicantDetails_address2',
      label: 'Address line 2',
      value: '',
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'applicantAddress2'
    },
    {
      name: 'techRecord_applicantDetails_postTown',
      label: 'Town or City',
      value: '',
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'applicantPostTown'
    },
    {
      name: 'techRecord_applicantDetails_address3',
      label: 'County',
      value: '',
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
      customId: 'applicantCounty'
    },
    {
      name: 'techRecord_applicantDetails_postCode',
      label: 'Postcode',
      value: '',
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
      customId: 'applicantPostCode'
    },
    {
      name: 'techRecord_applicantDetails_telephoneNumber',
      label: 'Telephone number',
      value: '',
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customId: 'applicantTelephoneNumber'
    },
    {
      name: 'techRecord_applicantDetails_emailAddress',
      label: 'Email address',
      value: '',
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 255 }],
      customId: 'applicantEmailAddress'
    }
  ]
};
