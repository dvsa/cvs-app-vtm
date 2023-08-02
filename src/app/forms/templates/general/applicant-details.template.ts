import { FormNode, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';

export const ApplicantDetails: FormNode = {
  name: 'techRecord',
  type: FormNodeTypes.GROUP,
  label: 'Last Applicant',
  children: [
    {
      name: 'applicantDetails',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'techRecord_purchaserDetails_name',
          label: 'Name or company',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
          customId: 'applicantName'
        },
        {
          name: 'techRecord_purchaserDetails_address1',
          label: 'Address line 1',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'applicantAddress1'
        },
        {
          name: 'techRecord_purchaserDetails_address2',
          label: 'Address line 2',
          value: '',
          width: FormNodeWidth.XXL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'applicantAddress2'
        },
        {
          name: 'techRecord_purchaserDetails_postTown',
          label: 'Town or City',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'applicantPostTown'
        },
        {
          name: 'techRecord_purchaserDetails_address3',
          label: 'County',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
          customId: 'applicantCounty'
        },
        {
          name: 'techRecord_purchaserDetails_postCode',
          label: 'Postcode',
          value: '',
          width: FormNodeWidth.L,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
          customId: 'applicantPostCode'
        },
        {
          name: 'techRecord_purchaserDetails_telephoneNumber',
          label: 'Telephone number',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
          customId: 'applicantTelephoneNumber'
        },
        {
          name: 'techRecord_purchaserDetails_emailAddress',
          label: 'Email address',
          value: '',
          width: FormNodeWidth.XL,
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 255 }],
          customId: 'applicantEmailAddress'
        }
      ]
    }
  ]
};
