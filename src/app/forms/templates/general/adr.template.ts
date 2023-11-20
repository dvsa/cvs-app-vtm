import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { AdrAdditionalNotesNumber, AdrBodyType, AdrDangerousGood } from '@models/adr.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth,
} from '../../services/dynamic-form.types';

export const AdrTemplate: FormNode = {
  name: 'adrSection',
  type: FormNodeTypes.SECTION,
  label: 'ADR',
  children: [
    {
      name: 'techRecord_adrDetails_dangerousGoods',
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
        { name: ValidatorNames.ShowGroupsWhenEqualTo, args: { values: [true], groups: ['dangerous_goods'] } },
        { name: ValidatorNames.HideGroupsWhenEqualTo, args: { values: [false], groups: ['dangerous_goods'] } },
        { name: ValidatorNames.AddWarningForAdrField, args: 'By selecting this field it will delete all previous ADR field inputs' },
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
    {
      name: 'adrDetailsSectionTitle',
      type: FormNodeTypes.TITLE,
      label: 'ADR Details',
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_vehicleDetails_type',
      label: 'ADR body type',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      editType: FormNodeEditTypes.SELECT,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      options: getOptionsFromEnum(AdrBodyType),
      validators: [{ name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } }],
    },
    {
      name: 'techRecord_adrDetails_vehicleDetails_approvalDate',
      label: 'Date processed',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.DATE,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      validators: [
        { name: ValidatorNames.PastDate },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } },
      ],
    },
    {
      name: 'techRecord_adrDetails_permittedDangerousGoods',
      label: 'Permitted dangerous goods',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOXGROUP,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      options: getOptionsFromEnum(AdrDangerousGood),
      validators: [
        {
          name: ValidatorNames.ShowGroupsWhenIncludes,
          args: {
            values: [AdrDangerousGood.EXPLOSIVES_TYPE2, AdrDangerousGood.EXPLOSIVES_TYPE3],
            groups: ['compatibility_group_j'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenExcludes,
          args: {
            values: [AdrDangerousGood.EXPLOSIVES_TYPE2, AdrDangerousGood.EXPLOSIVES_TYPE3],
            groups: ['compatibility_group_j'],
          },
        },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } },
      ],
    },
    {
      name: 'techRecord_adrDetails_compatibilityGroupJ',
      label: 'Compatibility group J',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      groups: ['compatibility_group_j', 'adr_details'],
      hide: true,
      options: [
        { value: 'I', label: 'Yes' },
        { value: 'E', label: 'No' },
      ],
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_permittedDangerousGoods',
            value: [AdrDangerousGood.EXPLOSIVES_TYPE2, AdrDangerousGood.EXPLOSIVES_TYPE3],
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_additionalNotes_number',
      label: 'Guidance notes',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOXGROUP,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      options: getOptionsFromEnum(AdrAdditionalNotesNumber),
      validators: [
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } },
      ],
    },
    {
      name: 'techRecord_adrDetails_adrTypeApprovalNo',
      label: 'ADR type approval number',
      value: '',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      validators: [
        { name: ValidatorNames.MaxLength, args: 40 },
      ],
    },
  ],
};
