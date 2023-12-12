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
import { TC2Types } from '@models/adr.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth,
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
      validators: [
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } },
        {
          name: ValidatorNames.ShowGroupsWhenIncludes,
          args: {
            values: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
            groups: ['tank_details'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenExcludes,
          args: {
            values: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
            groups: ['tank_details'],
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_vehicleDetails_approvalDate',
      label: 'Date processed',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.DATE,
      viewType: FormNodeViewTypes.DATE,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      isoDate: false,
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
      groups: ['compatibility_group_j', 'adr_details', 'dangerous_goods'],
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
      customValidatorErrorName: 'Guidance notes is required with Able to carry dangerous goods',
      options: getOptionsFromEnum(ADRAdditionalNotesNumber),
      validators: [
        {
          name: ValidatorNames.IsArray,
          args: { requiredIndices: [0], whenEquals: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } },
        },
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
    {
      name: 'tankDetailsSectionTitle',
      type: FormNodeTypes.TITLE,
      label: 'Tank Details',
      groups: ['tank_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankManufacturer',
      label: 'Tank Make',
      value: null,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
        { name: ValidatorNames.MaxLength, args: 70 },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_yearOfManufacture',
      label: 'Tank Year of manufacture',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      width: FormNodeWidth.XS,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
        { name: ValidatorNames.Max, args: 9999 },
        { name: ValidatorNames.Min, args: 1000 },
        { name: ValidatorNames.PastYear },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo',
      label: 'Manufacturer serial number',
      value: null,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
        { name: ValidatorNames.MaxLength, args: 50 },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo',
      label: 'Tank type approval number',
      value: null,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
        { name: ValidatorNames.MaxLength, args: 65 },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankCode',
      label: 'Code',
      value: null,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
        { name: ValidatorNames.MaxLength, args: 30 },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
      hide: true,
    },
    {
      name: 'tankInspectionsSectionTitle',
      type: FormNodeTypes.TITLE,
      label: 'Tank Inspections',
      groups: ['tank_details', 'dangerous_goods'],
      hide: true,
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
    },
    {
      name: 'tankInspectionsSectionSubheading',
      type: FormNodeTypes.TITLE,
      label: 'Initial',
      groups: ['tank_details', 'dangerous_goods'],
      hide: true,
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
      ],
    },
    {

      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      label: 'TC2: Inspection type',
      value: TC2Types.INITIAL, // TO-DO: replace with enum
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
      label: 'TC2: Certificate Number',
      type: FormNodeTypes.CONTROL,
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
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
      isoDate: false,
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
      label: 'Subsequent Inspections',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CUSTOM,
      viewType: FormNodeViewTypes.ADRINSPECTIONS,
      component: AdrTankDetailsSubsequentInspectionsComponent,
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery') || value.includes('tank')) as string[],
          },
        },
        {
          name: ValidatorNames.Tc3TestValidator,
          args: { inspectionNumber: 0 },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_memosApply',
      label: 'Memo 7/9 (3 month extension) applied',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOXGROUP,
      groups: ['tank_details', 'dangerous_goods'],
      hide: true,
      options: [
        { value: '07/09 3mth leak ext ', label: 'Yes' },
      ],
      validators: [],
    },
  ],
};
