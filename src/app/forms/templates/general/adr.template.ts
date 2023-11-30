import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { AdrGuidanceNotesComponent } from '@forms/custom-sections/adr-guidance-notes/adr-guidance-notes.component';
import {
  AdrTankDetailsSubsequentInspectionsComponent,
} from '@forms/custom-sections/adr-tank-details-subsequent-inspections/adr-tank-details-subsequent-inspections.component';
import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { TC2Types, TC3Types } from '@models/adr.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes,
  FormNodeViewTypes,
  FormNodeWidth,
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
      options: getOptionsFromEnum(ADRBodyType),
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
      options: getOptionsFromEnum(ADRDangerousGood),
      validators: [
        {
          name: ValidatorNames.ShowGroupsWhenIncludes,
          args: {
            values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
            groups: ['compatibility_group_j'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenExcludes,
          args: {
            values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
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
        { value: ADRCompatibilityGroupJ.I, label: 'Yes' },
        { value: ADRCompatibilityGroupJ.E, label: 'No' },
      ],
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_permittedDangerousGoods',
            value: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_additionalNotes_number',
      label: 'Guidance notes',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CUSTOM,
      component: AdrGuidanceNotesComponent,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      width: FormNodeWidth.XS,
      value: [],
      options: getOptionsFromEnum(ADRAdditionalNotesNumber),
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
    {
      name: 'tankInspectionsSectionTitle',
      type: FormNodeTypes.TITLE,
      label: 'Tank Inspections',
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'tankInspectionsSectionSubheading',
      type: FormNodeTypes.TITLE,
      label: 'Initial',
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
    },
    {

      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      label: 'TC2: Inspection type',
      value: TC2Types.INITIAL, // TO-DO: replace with enum
      hide: true,
      groups: ['adr_details', 'dangerous_goods'],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
      label: 'TC2: Certificate Number',
      type: FormNodeTypes.CONTROL,
      hide: true,
      groups: ['adr_details', 'dangerous_goods'],
      validators: [
        { name: ValidatorNames.MaxLength, args: 70 },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate',
      label: 'TC2: Expiry Date',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.DATE,
      viewType: FormNodeViewTypes.DATE,
      hide: true,
      groups: ['adr_details', 'dangerous_goods'],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
      label: 'Subsequent Inspections',
      type: FormNodeTypes.ARRAY,
      editType: FormNodeEditTypes.CUSTOM,
      component: AdrTankDetailsSubsequentInspectionsComponent,
      hide: true,
      groups: ['adr_details', 'dangerous_goods'],
      children: [{
        name: '0',
        label: 'Subsequent',
        type: FormNodeTypes.GROUP,
        children: [
          {
            name: 'tc3Type',
            type: FormNodeTypes.CONTROL,
            label: 'TC3: Inspection Type',
            // TO-DO: replace with enum
            options: getOptionsFromEnum(TC3Types),
          },
          {
            name: 'tc3PeriodicNumber',
            label: 'TC3: Certificate Number',
            type: FormNodeTypes.CONTROL,
          },
          {
            name: 'tc3PeriodicExpiryDate',
            label: 'TC3: Expiry Date',
            type: FormNodeTypes.CONTROL,
            editType: FormNodeEditTypes.DATE,
            viewType: FormNodeViewTypes.DATE,
          },
        ],
      },
      ],
    },
  ],
};
