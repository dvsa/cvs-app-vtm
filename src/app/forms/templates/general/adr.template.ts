import { ValidatorNames } from '@forms/models/validators.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth,
} from '../../services/dynamic-form.types';

export const AdrTemplate: FormNode = {
  name: 'adrSection',
  type: FormNodeTypes.SECTION,
  label: 'ADR',
  children: [
    {
      name: 'dangerousGoods',
      label: 'Able to carry dangerous goods',
      width: FormNodeWidth.XS,
      value: false,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
      validators: [
        { name: ValidatorNames.ShowGroupsWhenEqualTo, args: { value: true, groups: ['dangerous_goods'] } },
        { name: ValidatorNames.HideGroupsWhenEqualTo, args: { value: false, groups: ['dangerous_goods'] } },
      ],
    },
    {
      name: 'applicationDetailsSectionTitle',
      type: FormNodeTypes.TITLE,
      label: 'Applicant Details',
      groups: ['applicant_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_applicantDetails_name',
      label: 'Name',
      value: null,
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [
        { name: ValidatorNames.MaxLength, args: 150 },
      ],
      customId: 'adrName',
      groups: ['applicant_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_applicantDetails_street',
      label: 'Street',
      value: null,
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
      customId: 'adrStreet',
      groups: ['applicant_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_applicantDetails_town',
      label: 'Town',
      value: null,
      width: FormNodeWidth.XXL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
      customId: 'adrPostTown',
      groups: ['applicant_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_applicantDetails_city',
      label: 'City',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
      customId: 'adrPostCity',
      groups: ['applicant_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_applicantDetails_postcode',
      label: 'Postcode',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customId: 'adrPostCode',
      groups: ['applicant_details', 'dangerous_goods'],
      hide: true,
    },
  ],
};
