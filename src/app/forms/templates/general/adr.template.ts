import {
  ADRAdditionalNotesNumber,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import {
  ADRCompatibilityGroupJ,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import {
  AdrExaminerNotesHistoryEditComponent,
} from '@forms/custom-sections/adr-examiner-notes-history-edit/adr-examiner-notes-history.component-edit';
import {
  AdrExaminerNotesHistoryViewComponent,
} from '@forms/custom-sections/adr-examiner-notes-history-view/adr-examiner-notes-history-view.component';
import { AdrGuidanceNotesComponent } from '@forms/custom-sections/adr-guidance-notes/adr-guidance-notes.component';
import {
  AdrTankDetailsSubsequentInspectionsEditComponent,
} from '@forms/custom-sections/adr-tank-details-subsequent-inspections-edit/adr-tank-details-subsequent-inspections-edit.component';
import {
  AdrTankDetailsSubsequentInspectionsViewComponent,
} from '@forms/custom-sections/adr-tank-details-subsequent-inspections-view/adr-tank-details-subsequent-inspections-view.component';
import {
  AdrTankStatementUnNumberEditComponent,
} from '@forms/custom-sections/adr-tank-statement-un-number-edit/adr-tank-statement-un-number-edit.component';
import {
  AdrTankStatementUnNumberViewComponent,
} from '@forms/custom-sections/adr-tank-statement-un-number-view/adr-tank-statement-un-number-view.component';
import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { TC2Types } from '@models/adr.enum';
import {
  FormNode,
  FormNodeEditTypes,
  FormNodeTypes,
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
        { name: ValidatorNames.HideGroupsWhenEqualTo, args: { values: [false], groups: ['dangerous_goods', 'dangerous_goods_hide'] } },
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
            groups: ['tank_details', 'tank_details_hide'],
          },
        },
        {
          name: ValidatorNames.ShowGroupsWhenIncludes,
          args: {
            values: Object.values(ADRBodyType).filter((value) => value.includes('battery')) as string[],
            groups: ['battery_list'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenExcludes,
          args: {
            values: Object.values(ADRBodyType).filter((value) => value.includes('battery')) as string[],
            groups: ['battery_list', 'battery_list_hide'],
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
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] } },
        { name: ValidatorNames.PastDate },
        { name: ValidatorNames.DateIsInvalid },
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
      editComponent: AdrGuidanceNotesComponent,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      width: FormNodeWidth.XS,
      value: [],
      customErrorMessage: 'Guidance notes is required with Able to carry dangerous goods',
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
      name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted',
      label: 'Substances permitted',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: getOptionsFromEnum(ADRTankStatementSubstancePermitted),
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
        {
          name: ValidatorNames.ShowGroupsWhenEqualTo,
          args: {
            values: [ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER],
            groups: ['statement_select'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenEqualTo,
          args: {
            values: [ADRTankStatementSubstancePermitted.UNDER_TANK_CODE, null, undefined],
            groups: ['statement_select', 'statement_select_hide'],
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_select',
      label: 'Select',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      groups: ['statement_select', 'tank_details_hide', 'dangerous_goods'],
      hide: true,
      options: getOptionsFromEnum(ADRTankDetailsTankStatementSelect),
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted',
            value: [ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER],
          },
        },
        {
          name: ValidatorNames.ShowGroupsWhenIncludes,
          args: {
            values: [ADRTankDetailsTankStatementSelect.STATEMENT],
            groups: ['statement'],
          },
        },
        {
          name: ValidatorNames.ShowGroupsWhenIncludes,
          args: {
            values: [ADRTankDetailsTankStatementSelect.PRODUCT_LIST],
            groups: ['productList'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenExcludes,
          args: {
            values: [ADRTankDetailsTankStatementSelect.STATEMENT],
            groups: ['statement'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenExcludes,
          args: {
            values: [ADRTankDetailsTankStatementSelect.PRODUCT_LIST],
            groups: ['productList'],
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_statement',
      label: 'Reference number',
      type: FormNodeTypes.CONTROL,
      groups: ['statement', 'statement_select_hide', 'tank_details_hide', 'dangerous_goods'],
      hide: true,
      validators: [
        { name: ValidatorNames.MaxLength, args: 1500 },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
      label: 'Reference number',
      type: FormNodeTypes.CONTROL,
      groups: ['productList', 'statement_select_hide', 'tank_details_hide', 'dangerous_goods'],
      hide: true,
      customErrorMessage: 'Reference number or UN number 1 is required when selecting Product List',
      validators: [
        { name: ValidatorNames.MaxLength, args: 1500 },
        {
          name: ValidatorNames.requiredIfAllEquals,
          args: {
            sibling: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
            value: [[], [null], [''], null, undefined],
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
      label: 'UN number',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CUSTOM,
      viewType: FormNodeViewTypes.CUSTOM,
      editComponent: AdrTankStatementUnNumberEditComponent,
      viewComponent: AdrTankStatementUnNumberViewComponent,
      groups: ['productList', 'statement_select_hide', 'tank_details_hide', 'dangerous_goods'],
      hide: true,
      customErrorMessage: 'Reference number or UN number 1 is required when selecting Product List',
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: { sibling: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo', value: [null, undefined, ''] },
        },
        {
          name: ValidatorNames.IsArray,
          args: {
            ofType: 'string',
            whenEquals: {
              sibling: 'techRecord_adrDetails_tank_tankDetails_tankStatement_select',
              value: [ADRTankDetailsTankStatementSelect.PRODUCT_LIST],
            },
          },
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productList',
      label: 'Additional Details',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      groups: ['productList', 'statement_select_hide', 'tank_details_hide', 'dangerous_goods'],
      hide: true,
      validators: [
        { name: ValidatorNames.MaxLength, args: 1500 },
      ],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_specialProvisions',
      label: 'Special Provisions',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      hide: true,
      validators: [
        { name: ValidatorNames.MaxLength, args: 1024 },
      ],
      groups: ['dangerous_goods', 'tank_details'],
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
    // Note: this used only for the view mode for the ADR Tank Details initial inpsection controls
    // TODO: uncomment when needed
    /*
    {
      name: 'tankInspectionsInitialView',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.CUSTOM,
      viewComponent: AdrTankDetailsInitialInspectionViewComponent,
      groups: ['tank_details', 'dangerous_goods'],
      hide: true,
    },
    */
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      // viewType: FormNodeViewTypes.HIDDEN,
      label: 'TC2: Inspection type',
      value: TC2Types.INITIAL,
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
      label: 'TC2: Certificate Number',
      viewType: FormNodeViewTypes.HIDDEN,
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
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.DATE,
      isoDate: false,
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [],
    },
    {
      name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
      label: 'Subsequent Inspections',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.ADRINSPECTIONS, // TODO: replace with custom view type
      viewComponent: AdrTankDetailsSubsequentInspectionsViewComponent,
      editType: FormNodeEditTypes.CUSTOM,
      editComponent: AdrTankDetailsSubsequentInspectionsEditComponent,
      hide: true,
      groups: ['tank_details', 'dangerous_goods'],
      validators: [
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
    {
      name: 'techRecord_adrDetails_listStatementApplicable',
      label: 'Battery List Applicable',
      width: FormNodeWidth.XS,
      value: false,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
      validators: [
        { name: ValidatorNames.ShowGroupsWhenEqualTo, args: { values: [true], groups: ['battery_list_applicable'] } },
        { name: ValidatorNames.HideGroupsWhenEqualTo, args: { values: [false], groups: ['battery_list_applicable'] } },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_vehicleDetails_type',
            value: Object.values(ADRBodyType).filter((value) => value.includes('battery')) as string[],
          },
        },
      ],
      hide: true,
      groups: ['dangerous_goods', 'battery_list'],
    },
    {
      name: 'techRecord_adrDetails_batteryListNumber',
      label: 'Reference number',
      value: null,
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      groups: ['battery_list_applicable', 'battery_list_hide'],
      validators: [
        { name: ValidatorNames.MaxLength, args: 8 },
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_adrDetails_listStatementApplicable',
            value: [true],
          },
        },
      ],
      hide: true,
    },
    {
      name: 'DeclarationsSectionTitle',
      label: 'Declarations seen',
      type: FormNodeTypes.TITLE,
      groups: ['declarations_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_brakeDeclarationsSeen',
      label: 'Manufacturer brake declaration',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOX,
      groups: ['declarations_details', 'dangerous_goods'],
      value: false,
      hide: true,
      validators: [
        {
          name: ValidatorNames.ShowGroupsWhenEqualTo,
          args: {
            values: [true],
            groups: ['issuer_section'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenEqualTo,
          args: {
            values: [false],
            groups: ['issuer_section', 'issuer_section_hide'],
          },
        },
      ],

    },
    {
      name: 'techRecord_adrDetails_brakeDeclarationIssuer',
      label: 'Issuer',
      type: FormNodeTypes.CONTROL,
      hide: true,
      groups: ['issuer_section', 'dangerous_goods_hide'],
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [
        { name: ValidatorNames.MaxLength, args: 500 },
      ],
    },
    {
      name: 'techRecord_adrDetails_brakeEndurance',
      label: 'Brake endurance',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOX,
      groups: ['issuer_section', 'dangerous_goods_hide'],
      hide: true,
      validators: [
        {
          name: ValidatorNames.ShowGroupsWhenEqualTo,
          args: {
            values: [true],
            groups: ['weight_section'],
          },
        },
        {
          name: ValidatorNames.HideGroupsWhenEqualTo,
          args: {
            values: [false, null, undefined],
            groups: ['weight_section'],
          },
        },
      ],

    },
    {
      name: 'techRecord_adrDetails_weight',
      label: 'Weight (kg)',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.L,
      groups: ['weight_section', 'issuer_section_hide', 'dangerous_goods_hide'],
      hide: true,
      validators: [
        { name: ValidatorNames.MaxLength, args: 8 },
        { name: ValidatorNames.Numeric },
        {
          name: ValidatorNames.RequiredIfNotHidden,
        },
      ],
    },
    {
      name: 'techRecord_adrDetails_declarationsSeen',
      label: 'Owner/operator declaration',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.CHECKBOX,
      groups: ['declarations_details', 'dangerous_goods'],
      hide: true,
    },
    {
      name: 'techRecord_adrDetails_additionalExaminerNotes_note',
      label: 'Additional Examiner Notes',
      hint: 'Will not be present on the ADR certificate',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      viewType: FormNodeViewTypes.HIDDEN,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
      validators: [
        { name: ValidatorNames.MaxLength, args: 1024 },
      ],
    },
    {
      name: 'techRecord_adrDetails_additionalExaminerNotes',
      label: 'Additional examiner notes history',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.ADR_EXAMINER_NOTES, // TODO: replace with custom
      viewComponent: AdrExaminerNotesHistoryViewComponent,
      editType: FormNodeEditTypes.CUSTOM,
      editComponent: AdrExaminerNotesHistoryEditComponent,
      groups: ['adr_details', 'dangerous_goods'],
      hide: true,
    },
  ],
};
