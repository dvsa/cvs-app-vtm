import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { RadioButtonOptions } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/radioButtonOptions.enum.js';
import type { TechRecordPUTHGVComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/complete';
import dayjs from 'dayjs';

export type AdrDetails = Pick<
	TechRecordPUTHGVComplete,
	Extract<keyof TechRecordPUTHGVComplete, `techRecord_adrDetails_${string}`>
>;

export function createADRApplicantDetails() {
	return {
		techRecord_adrDetails_applicantDetails_name: 'Test ADR Applicant',
		techRecord_adrDetails_applicantDetails_street: '1 Test Street',
		techRecord_adrDetails_applicantDetails_town: 'Test Town',
		techRecord_adrDetails_applicantDetails_city: 'Swansea',
		techRecord_adrDetails_applicantDetails_postcode: 'SA1 1AA',
	};
}

export function createADRDetails(): AdrDetails {
	const receivedDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
	return {
		techRecord_adrDetails_dangerousGoods: true,
		techRecord_adrDetails_receivedDate: receivedDate,
		techRecord_adrDetails_applicationNumber: 'APP-0124958-0426-1',
		...createADRApplicantDetails(),
		techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_SHEETED_LOAD,
		techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: RadioButtonOptions.yes,
		techRecord_adrDetails_vehicleDetails_approvalDate: receivedDate,
		techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.FP],
		techRecord_adrDetails_additionalNotes_number: [ADRAdditionalNotesNumber.ONE],
		techRecord_adrDetails_approved: true,
	};
}

export function createADRTankDetails(): AdrDetails {
	return {
		techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_TANK,
		techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.FP],
		techRecord_adrDetails_bodyDeclaration_type: null,
		techRecord_adrDetails_compatibilityGroupJ: null,
		techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'Test Tank Manufacturer',
		techRecord_adrDetails_tank_tankDetails_yearOfManufacture: dayjs().subtract(2, 'year').year(),
		techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: 'TANK-12345',
		techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: 'TANK-APP-123',
		techRecord_adrDetails_tank_tankDetails_tankCode: 'L4BH',
		techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted:
			ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER,
		techRecord_adrDetails_tank_tankDetails_tankStatement_select: ADRTankDetailsTankStatementSelect.PRODUCT_LIST,
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: 'PRODUCT-REF-123',
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['1202', '1203'],
		techRecord_adrDetails_tank_tankDetails_tankStatement_productList: 'Products listed in the tank approval',
		techRecord_adrDetails_tank_tankDetails_specialProvisions: 'Special provisions recorded for inspection',
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: 'initial',
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: 'TC2-12345',
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: dayjs()
			.add(1, 'year')
			.format('YYYY-MM-DD'),
	};
}

export function createADRBatteryDetails(): AdrDetails {
	return {
		...createADRTankDetails(),
		techRecord_adrDetails_vehicleDetails_type: ADRBodyType.SEMI_TRAILER_BATTERY,
		techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.HYDROGEN],
		techRecord_adrDetails_tank_tankDetails_tankStatement_select: ADRTankDetailsTankStatementSelect.STATEMENT,
		techRecord_adrDetails_tank_tankDetails_tankStatement_statement: 'BATTERY-STATEMENT-123',
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: null,
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null,
		techRecord_adrDetails_tank_tankDetails_tankStatement_productList: null,
		techRecord_adrDetails_listStatementApplicable: true,
		techRecord_adrDetails_batteryListNumber: 'BAT12345',
	};
}
