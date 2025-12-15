import { Injectable, inject } from '@angular/core';
import { TechRecordType as TechRecordTypeVehicle } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { get, isEqual } from 'lodash';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';
import { FeatureToggleService } from '../feature-toggle-service/feature-toggle-service';

@Injectable({
	providedIn: 'root',
})
export class TechnicalRecordChangesService {
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);
	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	private _isNotEqual(a: unknown, b: unknown): boolean {
		// Do not count the following edge cases as changes

		// null/undefined->'' or '' -> null/undefined
		if ((a == null && b === '') || (a === '' && b == null)) return false;

		// null/undefined -> undefined/null
		if (a == null && b == null) return false;

		// null/undefined -> []
		if (a == null && Array.isArray(b) && b.length === 0) return false;

		// null/undefined -> false TODO: remove this if it becomes problematic
		if (a == null && b === false) return false;

		// [] -> null/undefined
		if (Array.isArray(a) && a.length === 0 && b != null) return false;

		// If array -> array, then re-run edge case check against each value
		if (Array.isArray(a) && Array.isArray(b)) {
			return a.some((value, index) => this._isNotEqual(value, b[index]));
		}

		return !isEqual(a, b);
	}

	private _hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		const a = get(current, property);
		const b = get(amended, property);

		return this._isNotEqual(a, b);
	}

	hasChanged(...properties: string[]) {
		return properties.some((property) => this._hasChanged(property));
	}

	hasSectionChanged(sectionName: string): boolean {
		switch (sectionName) {
			case 'requiredSection':
			case 'reasonForCreationSection':
				return true;
			case 'notesSection':
				return this.hasNotesSectionChanged();
			case 'techRecordSummary':
				return this.hasVehicleSummarySectionChanged();
			case 'bodySection':
				return this.hasBodySectionChanged();
			case 'dimensionsSection':
				return this.hasDimensionsSectionChanged();
			case 'purchaserSection':
				return this.hasPurchaserSectionChanged();
			case 'approvalSection':
				return this.hasApprovalSectionChanged();
			case 'psvBrakesSection':
			case 'trlBrakesSection':
				return this.hasBrakesSectionChanged();
			case 'dda':
				return this.hasDDASectionChanged();
			case 'tyreSection':
				return this.hasTyresSectionChanged();
			case 'weightsSection':
				return this.hasWeightSectionChanged();
			case 'adrSection':
				return this.hasADRSectionChanged();
			case 'techRecord':
				return this.hasLastApplicantSectionChanged();
			case 'documentsSection':
				return this.hasDocumentsSectionChanged();
			case 'platesSection':
				return this.hasPlatesSectionChanged();
			case 'adrCertificateSection':
				return this.hasADRCertificateSectionChanged();
			case 'lettersSection':
				return this.hasLettersSectionChanged();
			case 'authorizationIntoServiceSection':
				return this.hasAuthorisationIntoServiceSectionChanged();
			case 'manufacturerSection':
				return this.hasManufacturerSectionChanged();
			case 'audit':
				return this.hasAuditSectionChanged();
			default:
				return true;
		}
	}

	hasNotesSectionChanged(): boolean {
		return this.hasChanged('techRecord_notes', 'techRecord_remarks', 'techRecord_dispensations');
	}

	hasVehicleSummarySectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_euVehicleCategory',
			'techRecord_manufactureYear',
			'techRecord_statusCode',
			'techRecord_vehicleType',
			'techRecord_alterationMarker',
			'techRecord_departmentalVehicleMarker',
			'techRecord_drawbarCouplingFitted',
			'techRecord_vehicleConfiguration',
			'techRecord_emissionsLimit',
			'techRecord_euroStandard',
			'techRecord_fuelPropulsionSystem',
			'techRecord_offRoad',
			'techRecord_roadFriendly',
			'techRecord_speedLimiterMrk',
			'techRecord_tachoExemptMrk',
			'techRecord_vehicleClass_description',
			'techRecord_regnDate',
			'techRecord_noOfAxles',
			'techRecord_seatsUpperDeck',
			'techRecord_seatsLowerDeck',
			'techRecord_standingCapacity',
			'techRecord_vehicleSize',
			'techRecord_numberOfSeatbelts',
			'techRecord_seatbeltInstallationApprovalDate',
			'techRecord_regnDate',
			'techRecord_firstUseDate',
			'techRecord_suspensionType',
			'techRecord_couplingType',
			'techRecord_maxLoadOnCoupling',
			'techRecord_frameDescription',
			'techRecord_manufactureMonth',
			'techRecord_numberOfWheelsDriven'
		);
	}

	hasBodySectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_make',
			'techRecord_model',
			'techRecord_bodyType_description',
			'techRecord_bodyType_code',
			'techRecord_brakes_dtpNumber',
			'techRecord_functionCode',
			'techRecord_conversionRefNo',
			'techRecord_chassisMake',
			'techRecord_chassisModel',
			'techRecord_bodyMake',
			'techRecord_bodyModel',
			'techRecord_bodyType_code',
			'techRecord_bodyType_description',
			'techRecord_modelLiteral'
		);
	}

	hasDimensionsSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_dimensions_length',
			'techRecord_dimensions_width',
			'techRecord_dimensions_axleSpacing',
			'techRecord_frontAxleToRearAxle',
			'techRecord_frontVehicleTo5thWheelCouplingMin',
			'techRecord_frontVehicleTo5thWheelCouplingMax',
			'techRecord_frontAxleTo5thWheelMin',
			'techRecord_frontAxleTo5thWheelMax',
			'techRecord_frontAxleToRearAxle',
			'techRecord_rearAxleToRearTrl',
			'techRecord_centreOfRearmostAxleToRearOfTrl',
			'techRecord_couplingCenterToRearAxleMin',
			'techRecord_couplingCenterToRearAxleMax',
			'techRecord_couplingCenterToRearTrlMin',
			'techRecord_couplingCenterToRearTrlMax'
		);
	}

	hasPurchaserSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_purchaserDetails_name',
			'techRecord_purchaserDetails_address1',
			'techRecord_purchaserDetails_address2',
			'techRecord_purchaserDetails_postTown',
			'techRecord_purchaserDetails_address3',
			'techRecord_purchaserDetails_postCode',
			'techRecord_purchaserDetails_telephoneNumber',
			'techRecord_purchaserDetails_emailAddress',
			'techRecord_purchaserDetails_faxNumber',
			'techRecord_purchaserDetails_purchaserNotes'
		);
	}

	hasApprovalSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_approvalType',
			'techRecord_approvalTypeNumber',
			'techRecord_ntaNumber',
			'techRecord_variantNumber',
			'techRecord_variantVersionNumber',
			'techRecord_coifSerialNumber',
			'techRecord_coifCertifierName',
			'techRecord_coifDate'
		);
	}

	hasBrakesSectionChanged(): boolean {
		// Edge case 1: Only detect parking brake changes when axles are modified (HGV/TRL/PSV)
		if (this.hasParkingBrakesSectionChanged()) return true;

		// Edge case 2: Only detect brake changes when axles are modified (TRL)
		if (this.hasTRLAxleBrakesChanged()) return true;

		return this.hasChanged(
			'techRecord_brakes_brakeCode',
			'techRecord_brakes_brakeCodeOriginal',
			'techRecord_brakes_dataTrBrakeOne',
			'techRecord_brakes_dataTrBrakeTwo',
			'techRecord_brakes_dataTrBrakeThree',
			'techRecord_brakes_retarderBrakeOne',
			'techRecord_brakes_retarderBrakeTwo',
			'techRecord_brakes_loadSensingValve',
			'techRecord_brakes_antilockBrakingSystem'
		);
	}

	hasParkingBrakesSectionChanged(): boolean {
		if (!this.hasChanged('techRecord_axles')) return false;

		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		return (amended as TechRecordTypeVehicle<'hgv' | 'psv' | 'trl'>).techRecord_axles!.some((_, index) => {
			return this._hasChanged(`techRecord_axles.${index}.parkingBrakeMrk`);
		});
	}

	hasDDASectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_dda_certificateIssued',
			'techRecord_dda_wheelchairCapacity',
			'techRecord_dda_wheelchairFittings',
			'techRecord_dda_wheelchairLiftPresent',
			'techRecord_dda_wheelchairLiftInformation',
			'techRecord_dda_wheelchairRampPresent',
			'techRecord_dda_wheelchairRampInformation',
			'techRecord_dda_minEmergencyExits',
			'techRecord_dda_outswing',
			'techRecord_dda_ddaSchedules',
			'techRecord_dda_seatbeltsFitted',
			'techRecord_dda_ddaNotes'
		);
	}

	hasTyresSectionChanged(): boolean {
		// Edge case 1: Only detect tyre changes when axles are modified
		if (this.hasAxleTyresChanged()) return true;

		return this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
			? this.hasChanged('techRecord_tyreUseCode')
			: this.hasChanged('techRecord_tyreUseCode', 'techRecord_speedRestriction');
	}

	hasWeightSectionChanged(): boolean {
		// Edge case 1: Only detect weight changes when axles are modified
		if (this.hasAxleWeightsChanged()) return true;

		return this.hasChanged(
			'techRecord_grossGbWeight',
			'techRecord_grossEecWeight',
			'techRecord_grossDesignWeight',
			'techRecord_trainGbWeight',
			'techRecord_trainEecWeight',
			'techRecord_trainDesignWeight',
			'techRecord_maxTrainGbWeight',
			'techRecord_maxTrainEecWeight',
			'techRecord_maxTrainDesignWeight',
			'techRecord_unladenWeight',
			'techRecord_grossKerbWeight',
			'techRecord_grossLadenWeight'
		);
	}

	hasADRSectionChanged(): boolean {
		// Edge case 1: Only detect UN numbers as a change when not null -> [null]
		if (this.hasUNNumbersChanged()) return true;

		return this.hasChanged(
			'techRecord_adrDetails_dangerousGoods',
			'techRecord_adrDetails_applicantDetails_name',
			'techRecord_adrDetails_applicantDetails_street',
			'techRecord_adrDetails_applicantDetails_town',
			'techRecord_adrDetails_applicantDetails_city',
			'techRecord_adrDetails_applicantDetails_postcode',
			'techRecord_adrDetails_vehicleDetails_type',
			'techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys',
			'techRecord_adrDetails_vehicleDetails_approvalDate',
			'techRecord_adrDetails_permittedDangerousGoods',
			'techRecord_adrDetails_bodyDeclaration_type',
			'techRecord_adrDetails_compatibilityGroupJ',
			'techRecord_adrDetails_additionalNotes_number',
			'techRecord_adrDetails_adrTypeApprovalNo',
			'techRecord_adrDetails_tank_tankDetails_tankManufacturer',
			'techRecord_adrDetails_tank_tankDetails_yearOfManufacture',
			'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo',
			'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo',
			'techRecord_adrDetails_tank_tankDetails_tankCode',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_select',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_statement',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productList',
			'techRecord_adrDetails_tank_tankDetails_specialProvisions',
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type',
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate',
			'techRecord_adrDetails_tank_tankDetails_tc3Details',
			'techRecord_adrDetails_memosApply',
			'techRecord_adrDetails_m145Statement',
			'techRecord_adrDetails_listStatementApplicable',
			'techRecord_adrDetails_batteryListNumber',
			'techRecord_adrDetails_brakeDeclarationsSeen',
			'techRecord_adrDetails_brakeDeclarationIssuer',
			'techRecord_adrDetails_brakeEndurance',
			'techRecord_adrDetails_weight',
			'techRecord_adrDetails_declarationsSeen',
			'techRecord_adrDetails_newCertificateRequested',
			'techRecord_adrDetails_additionalExaminerNotes_note',
			'techRecord_adrDetails_additionalExaminerNotes',
			'techRecord_adrDetails_adrCertificateNotes'
		);
	}

	hasUNNumbersChanged(): boolean {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		const b = get(amended, 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo');
		if (Array.isArray(b) && b.filter(Boolean).length === 0) return false;

		return this._hasChanged('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo');
	}

	hasADRApplicantSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_adrDetails_applicantDetails_name',
			'techRecord_adrDetails_applicantDetails_street',
			'techRecord_adrDetails_applicantDetails_town',
			'techRecord_adrDetails_applicantDetails_city',
			'techRecord_adrDetails_applicantDetails_postcode',
			'techRecord_adrDetails_applicantDetails_telephoneNumber',
			'techRecord_adrDetails_applicantDetails_emailAddress'
		);
	}

	hasADRTankDetailsSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_adrDetails_tank_tankDetails_tankManufacturer',
			'techRecord_adrDetails_tank_tankDetails_yearOfManufacture',
			'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo',
			'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo',
			'techRecord_adrDetails_tank_tankDetails_tankCode',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_select',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_statement',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productList',
			'techRecord_adrDetails_tank_tankDetails_specialProvisions'
		);
	}

	hasADRTankInspectionsSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate',
			'techRecord_adrDetails_tank_tankDetails_tc3Details'
		);
	}

	hasLastApplicantSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_applicantDetails_name',
			'techRecord_applicantDetails_address1',
			'techRecord_applicantDetails_address2',
			'techRecord_applicantDetails_postTown',
			'techRecord_applicantDetails_address3',
			'techRecord_applicantDetails_postCode',
			'techRecord_applicantDetails_telephoneNumber',
			'techRecord_applicantDetails_emailAddress'
		);
	}

	hasDocumentsSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_microfilm_microfilmDocumentType',
			'techRecord_microfilm_microfilmRollNumber',
			'techRecord_microfilm_microfilmSerialNumber'
		);
	}

	hasPlatesSectionChanged(): boolean {
		return this.hasChanged('techRecord_plates');
	}

	hasADRCertificateSectionChanged(): boolean {
		return this.hasChanged('techRecord_adrDetails_certificates');
	}

	hasLettersSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_letterOfAuth_letterIssuer',
			'techRecord_letterOfAuth_letterType',
			'techRecord_letterOfAuth_letterDateRequested',
			'techRecord_letterOfAuth_paragraphId',
			'techRecord_letterOfAuth_letterContents'
		);
	}

	hasAuthorisationIntoServiceSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_authIntoService_cocIssueDate',
			'techRecord_authIntoService_dateReceived',
			'techRecord_authIntoService_datePending',
			'techRecord_authIntoService_dateAuthorised',
			'techRecord_authIntoService_dateRejected'
		);
	}

	hasManufacturerSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_manufacturerDetails_name',
			'techRecord_manufacturerDetails_address1',
			'techRecord_manufacturerDetails_address2',
			'techRecord_manufacturerDetails_postTown',
			'techRecord_manufacturerDetails_address3',
			'techRecord_manufacturerDetails_postCode',
			'techRecord_manufacturerDetails_telephoneNumber',
			'techRecord_manufacturerDetails_emailAddress',
			'techRecord_manufacturerDetails_faxNumber',
			'techRecord_manufacturerDetails_manufacturerNotes'
		);
	}

	hasAuditSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_reasonForCreation',
			'techRecord_createdAt',
			'techRecord_createdByName',
			'techRecord_createdById',
			'techRecord_lastUpdatedAt',
			'techRecord_lastUpdatedByName',
			'techRecord_lastUpdatedById'
		);
	}

	haveAnyApplicantDetailItemsChanged() {
		return this.hasChanged(
			'techRecord_adrDetails_applicantDetails_city',
			'techRecord_adrDetails_applicantDetails_name',
			'techRecord_adrDetails_applicantDetails_postcode',
			'techRecord_adrDetails_applicantDetails_street',
			'techRecord_adrDetails_applicantDetails_town'
		);
	}

	hasInitialInspectionChanged() {
		return this.hasChanged(
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate'
		);
	}

	haveAnyADRDetailItemsChanged() {
		return this.hasChanged(
			'techRecord_adrDetails_vehicleDetails_type',
			'techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys',
			'techRecord_adrDetails_vehicleDetails_approvalDate',
			'techRecord_adrDetails_permittedDangerousGoods',
			'techRecord_adrDetails_bodyDeclaration_type',
			'techRecord_adrDetails_compatibilityGroupJ',
			'techRecord_adrDetails_additionalNotes_number',
			'techRecord_adrDetails_adrTypeApprovalNo'
		);
	}

	haveAnyTankDetailItemsChanged() {
		return this.hasChanged(
			'techRecord_adrDetails_tank_tankDetails_tankManufacturer',
			'techRecord_adrDetails_tank_tankDetails_yearOfManufacture',
			'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo',
			'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo',
			'techRecord_adrDetails_tank_tankDetails_tankCode',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_statement',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productList',
			'techRecord_adrDetails_tank_tankDetails_specialProvisions'
		);
	}

	haveAnyTankInspectionItemsChanged() {
		return this.hasChanged(
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo',
			'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate',
			'techRecord_adrDetails_tank_tankDetails_tc3Details'
		);
	}

	haveAnyMiscellaneousItemsChanged() {
		return this.hasChanged('techRecord_adrDetails_memosApply', 'techRecord_adrDetails_m145Statement');
	}

	haveAnyBatteryListItemsChanged() {
		return this.hasChanged('techRecord_adrDetails_listStatementApplicable', 'techRecord_adrDetails_batteryListNumber');
	}

	haveAnyDeclarationsSeenItemsChanged() {
		return this.hasChanged(
			'techRecord_adrDetails_brakeDeclarationsSeen',
			'techRecord_adrDetails_brakeDeclarationIssuer',
			'techRecord_adrDetails_brakeEndurance',
			'techRecord_adrDetails_weight',
			'techRecord_adrDetails_declarationsSeen'
		);
	}

	hasGeneralVehicleDetailsSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_vehicleType',
			'techRecord_vehicleClass_description',
			'techRecord_regnDate',
			'techRecord_manufactureYear',
			'techRecord_brakes_dtpNumber',
			'techRecord_make',
			'techRecord_model',
			'techRecord_vehicleConfiguration',
			'techRecord_bodyType_code',
			'techRecord_bodyType_description',
			'techRecord_functionCode',
			'techRecord_conversionRefNo',
			'techRecord_euVehicleCategory',
			'techRecord_noOfAxles',
			'techRecord_chassisMake',
			'techRecord_chassisModel',
			'techRecord_bodyMake',
			'techRecord_bodyModel',
			'techRecord_modelLiteral',
			'techRecord_manufactureMonth',
			'techRecord_firstUseDate',
			'techRecord_frameDescription',
			'techRecord_vehicleSubclass',
			'techRecord_numberOfWheelsDriven'
		);
	}

	hasConfigurationSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_offRoad',
			'techRecord_departmentalVehicleMarker',
			'techRecord_alterationMarker',
			'techRecord_fuelPropulsionSystem',
			'techRecord_roadFriendly',
			'techRecord_speedRestriction',
			'techRecord_suspensionType'
		);
	}

	hasEmissionsAndExemptionsSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_drawbarCouplingFitted',
			'techRecord_euroStandard',
			'techRecord_emissionsLimit',
			'techRecord_speedLimiterMrk',
			'techRecord_tachoExemptMrk'
		);
	}

	hasSeatsAndVehicleSizeSectionChanged(): boolean {
		return this.hasChanged(
			'techRecord_seatsUpperDeck',
			'techRecord_seatsLowerDeck',
			'techRecord_standingCapacity',
			'techRecord_dda_wheelchairCapacity',
			'techRecord_vehicleClass_description',
			'techRecord_vehicleSize',
			'techRecord_numberOfSeatbelts',
			'techRecord_seatbeltInstallationApprovalDate'
		);
	}

	hasTyreChanged(i: number): boolean {
		return this.hasChanged(
			`techRecord_axles.${i}.tyres_tyreCode`,
			`techRecord_axles.${i}.tyres_tyreSize`,
			`techRecord_axles.${i}.tyres_plyRating`,
			`techRecord_axles.${i}.tyres_dataTrAxles`,
			`techRecord_axles.${i}.tyres_fitmentCode`,
			`techRecord_axles.${i}.tyres_speedCategorySymbol`
		);
	}

	hasWeightChanged(i: number): boolean {
		return this.hasChanged(
			`techRecord_axles.${i}.weights_gbWeight`,
			`techRecord_axles.${i}.weights_eecWeight`,
			`techRecord_axles.${i}.weights_designWeight`,
			`techRecord_axles.${i}.weights_ladenWeight`,
			`techRecord_axles.${i}.weights_kerbWeight`
		);
	}

	hasAxleWeightsChanged(): boolean {
		if (!this.hasChanged('techRecord_axles')) return false;

		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		return (amended as TechRecordTypeVehicle<'hgv' | 'psv' | 'trl'>).techRecord_axles!.some((_, index) => {
			return this.hasWeightChanged(index);
		});
	}

	hasAxleTyresChanged(): boolean {
		if (!this.hasChanged('techRecord_axles')) return false;

		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		return (amended as TechRecordTypeVehicle<'hgv' | 'psv' | 'trl'>).techRecord_axles!.some((_, index) => {
			return this.hasTyreChanged(index);
		});
	}

	hasTRLAxleBrakeChanged(i: number) {
		return this.hasChanged(
			`techRecord_axles.${i}.brakes_brakeActuator`,
			`techRecord_axles.${i}.brakes_leverLength`,
			`techRecord_axles.${i}.brakes_springBrakeParking`
		);
	}

	hasTRLAxleBrakesChanged() {
		if (!this.hasChanged('techRecord_axles')) return false;

		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;
		if (amended.techRecord_vehicleType !== VehicleTypes.TRL) return false;

		return (amended as TechRecordTypeVehicle<'hgv' | 'psv' | 'trl'>).techRecord_axles!.some((_, index) => {
			return this.hasTRLAxleBrakeChanged(index);
		});
	}
}
