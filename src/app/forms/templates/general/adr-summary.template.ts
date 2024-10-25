import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyDeclarationTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyDeclarationType.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { AdrExaminerNotesHistoryEditComponent } from '@forms/custom-sections/adr-examiner-notes-history-edit/adr-examiner-notes-history.component-edit';
import { AdrExaminerNotesHistoryViewComponent } from '@forms/custom-sections/adr-examiner-notes-history-view/adr-examiner-notes-history-view.component';
import { AdrNewCertificateRequiredViewComponent } from '@forms/custom-sections/adr-new-certificate-required-view/adr-new-certificate-required-view.component';
import { AdrTankDetailsInitialInspectionViewComponent } from '@forms/custom-sections/adr-tank-details-initial-inspection-view/adr-tank-details-initial-inspection-view.component';
import { AdrTankDetailsM145ViewComponent } from '@forms/custom-sections/adr-tank-details-m145-view/adr-tank-details-m145-view.component';
import { AdrTankDetailsSubsequentInspectionsEditComponent } from '@forms/custom-sections/adr-tank-details-subsequent-inspections-edit/adr-tank-details-subsequent-inspections-edit.component';
import { AdrTankDetailsSubsequentInspectionsViewComponent } from '@forms/custom-sections/adr-tank-details-subsequent-inspections-view/adr-tank-details-subsequent-inspections-view.component';
import { AdrTankStatementUnNumberEditComponent } from '@forms/custom-sections/adr-tank-statement-un-number-edit/adr-tank-statement-un-number-edit.component';
import { AdrTankStatementUnNumberViewComponent } from '@forms/custom-sections/adr-tank-statement-un-number-view/adr-tank-statement-un-number-view.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { TC2Types } from '@models/adr.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const AdrSummaryTemplate: FormNode = {
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
				{
					name: ValidatorNames.AddWarningForAdrField,
					args: 'By selecting this field it will delete all previous ADR field inputs',
				},
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
			validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
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
				{
					name: ValidatorNames.RequiredIfEquals,
					args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] },
				},
				{
					name: ValidatorNames.ShowGroupsWhenIncludes,
					args: {
						values: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
						groups: ['tank_details'],
					},
				},
				{
					name: ValidatorNames.HideGroupsWhenExcludes,
					args: {
						values: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						groups: ['battery_list'],
					},
				},
			],
		},
		{
			name: 'techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys',
			label: 'Vehicle used on international journeys',
			type: FormNodeTypes.CONTROL,
			options: [
				{ value: 'yes', label: 'Yes' },
				{ value: 'no', label: 'No' },
				{ value: 'n/a', label: 'Not applicable' },
			],
			hide: true,
			groups: ['adr_details', 'dangerous_goods'],
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
				{
					name: ValidatorNames.RequiredIfEquals,
					args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] },
				},
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
						values: [ADRDangerousGood, ADRDangerousGood.EXPLOSIVES_TYPE_3],
						groups: ['body_declaration'],
					},
				},
				{
					name: ValidatorNames.HideGroupsWhenExcludes,
					args: {
						values: [ADRDangerousGood.EXPLOSIVES_TYPE_3],
						groups: ['body_declaration'],
					},
				},
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
				{
					name: ValidatorNames.RequiredIfEquals,
					args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] },
				},
			],
		},
		{
			name: 'techRecord_adrDetails_bodyDeclaration_type',
			label: 'Body declaration',
			type: FormNodeTypes.CONTROL,
			groups: ['body_declaration', 'adr_details', 'dangerous_goods'],
			hide: true,
			options: [
				{ value: ADRBodyDeclarationTypes.PRE_1ST_JULY_2005, label: ADRBodyDeclarationTypes.PRE_1ST_JULY_2005 },
				{
					value: ADRBodyDeclarationTypes.ON_OR_AFTER_1ST_JULY_2005,
					label: ADRBodyDeclarationTypes.ON_OR_AFTER_1ST_JULY_2005,
				},
				{ value: ADRBodyDeclarationTypes.UNKNOWN, label: ADRBodyDeclarationTypes.UNKNOWN },
			],
			validators: [
				{
					name: ValidatorNames.RequiredIfEquals,
					args: { sibling: 'techRecord_adrDetails_dangerousGoods', value: [true] },
				},
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
			editType: FormNodeEditTypes.CHECKBOXGROUP,
			groups: ['adr_details', 'dangerous_goods'],
			hide: true,
			width: FormNodeWidth.XS,
			value: [],
			options: getOptionsFromEnum(ADRAdditionalNotesNumber),
			validators: [],
		},
		{
			name: 'techRecord_adrDetails_adrTypeApprovalNo',
			label: 'ADR type approval number',
			value: '',
			type: FormNodeTypes.CONTROL,
			width: FormNodeWidth.L,
			groups: ['adr_details', 'dangerous_goods'],
			hide: true,
			validators: [{ name: ValidatorNames.MaxLength, args: 40 }],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
						sibling: 'techRecord_adrDetails_vehicleDetails_type',
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
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
			customErrorMessage: 'Reference number is required when selecting Statement',
			validators: [
				{ name: ValidatorNames.MaxLength, args: 1500 },
				{
					name: ValidatorNames.RequiredIfEquals,
					args: {
						sibling: 'techRecord_adrDetails_tank_tankDetails_tankStatement_select',
						value: [ADRTankDetailsTankStatementSelect.STATEMENT],
					},
				},
			],
		},
		{
			name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
			label: 'Reference number',
			type: FormNodeTypes.CONTROL,
			groups: ['productList', 'statement_select_hide', 'tank_details_hide', 'dangerous_goods'],
			hide: true,
			customErrorMessage: 'Reference number or UN number is required when selecting Product List',
			validators: [
				{ name: ValidatorNames.MaxLength, args: 1500 },
				{
					name: ValidatorNames.RequiredIfEquals,
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
			customErrorMessage: 'Reference number or UN number is required when selecting Product List',
			validators: [
				{
					name: ValidatorNames.RequiredIfEquals,
					args: {
						sibling: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
						value: [null, undefined, ''],
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
			validators: [{ name: ValidatorNames.MaxLength, args: 1500 }],
		},
		{
			name: 'techRecord_adrDetails_tank_tankDetails_specialProvisions',
			label: 'Special Provisions',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.TEXTAREA,
			hide: true,
			validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],
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
						value: Object.values(ADRBodyType).filter(
							(value) => value.includes('battery') || value.includes('tank')
						) as string[],
					},
				},
			],
		},
		{
			name: 'tankInspectionsInitialView',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.CUSTOM,
			viewComponent: AdrTankDetailsInitialInspectionViewComponent,
			groups: ['tank_details', 'dangerous_goods'],
			hide: true,
		},
		{
			name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			label: 'TC2: Inspection type',
			value: TC2Types.INITIAL,
			hide: true,
			groups: ['tank_details', 'dangerous_goods'],
			validators: [],
		},
		{
			name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
			label: 'TC2: Certificate Number',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			hide: true,
			groups: ['tank_details', 'dangerous_goods'],
			validators: [{ name: ValidatorNames.MaxLength, args: 70 }],
		},
		{
			name: 'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate',
			label: 'TC2: Expiry Date',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			isoDate: false,
			hide: true,
			groups: ['tank_details', 'dangerous_goods'],
			validators: [],
		},
		{
			name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
			label: 'Subsequent Inspections',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.CUSTOM,
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
			label: 'Memo 07/09 (3 month extension) can be applied',
			labelClass: 'govuk-!-font-weight-bold',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.CHECKBOXGROUP,
			groups: ['tank_details', 'dangerous_goods'],
			hide: true,
			options: [{ value: '07/09 3mth leak ext ', label: 'Yes' }],
			validators: [],
		},
		{
			name: 'techRecord_adrDetails_m145Statement',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.CUSTOM,
			viewComponent: AdrTankDetailsM145ViewComponent,
			editType: FormNodeEditTypes.CHECKBOX,
			groups: ['tank_details', 'dangerous_goods'],
			hide: true,
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
			groups: ['battery_list', 'battery_list_applicable', 'dangerous_goods'],
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
						groups: ['issuer_section', 'weight_section'],
					},
				},
			],
		},
		{
			name: 'techRecord_adrDetails_brakeDeclarationIssuer',
			label: 'Issuer',
			type: FormNodeTypes.CONTROL,
			hide: true,
			groups: ['issuer_section', 'dangerous_goods'],
			editType: FormNodeEditTypes.TEXTAREA,
			validators: [{ name: ValidatorNames.MaxLength, args: 500 }],
		},
		{
			name: 'techRecord_adrDetails_brakeEndurance',
			label: 'Brake endurance',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.CHECKBOX,

			groups: ['issuer_section', 'dangerous_goods'],
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
			label: 'Weight (tonnes)',
			type: FormNodeTypes.CONTROL,
			width: FormNodeWidth.L,
			groups: ['weight_section', 'dangerous_goods'],
			hide: true,
			validators: [
				{ name: ValidatorNames.Max, args: 999999999 },
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
			name: 'NewCertificateRequested',
			label: 'New Certificate required',
			type: FormNodeTypes.TITLE,
			groups: ['dangerous_goods'],
			hide: true,
		},
		{
			name: 'techRecord_adrDetails_newCertificateRequested',
			label: 'Yes',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.CHECKBOX,
			viewType: FormNodeViewTypes.CUSTOM,
			viewComponent: AdrNewCertificateRequiredViewComponent,
			value: false,
			groups: ['dangerous_goods'],
			hide: true,
		},
		{
			name: 'techRecord_adrDetails_additionalExaminerNotes_note',
			label: 'Additional Examiner Notes',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.TEXTAREA,
			groups: ['adr_details', 'dangerous_goods'],
			hide: true,
			validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],
		},
		{
			name: 'techRecord_adrDetails_additionalExaminerNotes',
			value: null,
			label: 'Additional Examiner Notes History',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.CUSTOM,
			viewComponent: AdrExaminerNotesHistoryViewComponent,
			editType: FormNodeEditTypes.CUSTOM,
			editComponent: AdrExaminerNotesHistoryEditComponent,
			groups: ['adr_details', 'dangerous_goods'],
			hide: true,
		},
		{
			name: 'techRecord_adrDetails_adrCertificateNotes',
			label: 'ADR Certificate Notes',
			value: null,
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.TEXTAREA,
			viewType: FormNodeViewTypes.STRING,
			groups: ['adrDetails', 'dangerous_goods'],
			hide: true,
			validators: [{ name: ValidatorNames.MaxLength, args: 1500 }],
		},
	],
};
