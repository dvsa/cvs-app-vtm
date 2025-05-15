import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

type ADRTechRecord = TechRecordType<'hgv' | 'trl' | 'lgv'> & {
	techRecord_adrDetails_additionalExaminerNotes_note: string;
};

@Component({
	selector: 'app-adr-section-summary',
	templateUrl: './adr-section-summary.component.html',
	styleUrls: ['./adr-section-summary.component.scss'],
	imports: [PaginationComponent, DatePipe, DefaultNullOrEmpty],
})
export class AdrSectionSummaryComponent {
	store = inject(Store);
	adrService = inject(AdrService);

	currentTechRecord = this.store.selectSignal(techRecord) as Signal<ADRTechRecord>;
	amendedTechRecord = this.store.selectSignal(editingTechRecord) as Signal<ADRTechRecord>;

	// TODO update this method so its consistent with some of the more recent changes
	hasChanged(property: keyof ADRTechRecord) {
		const current = this.currentTechRecord() as ADRTechRecord;
		const amended = this.amendedTechRecord() as ADRTechRecord;
		if (!current || !amended) return true;

		const cp = current[property];
		const ap = amended[property];

		// If the property is edited, exclude certain changes
		if (cp == null && Array.isArray(ap) && ap.length === 0) return false;

		return !isEqual(cp, ap);
	}

	haveAnyApplicantDetailItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_applicantDetails_city'),
			this.hasChanged('techRecord_adrDetails_applicantDetails_name'),
			this.hasChanged('techRecord_adrDetails_applicantDetails_postcode'),
			this.hasChanged('techRecord_adrDetails_applicantDetails_street'),
			this.hasChanged('techRecord_adrDetails_applicantDetails_town'),
		].some((hasChanged) => hasChanged);
	}

	hasInitialInspectionChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate'),
		].some((hasChanged) => hasChanged);
	}

	haveAnyADRDetailItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_vehicleDetails_type'),
			this.hasChanged('techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys'),
			this.hasChanged('techRecord_adrDetails_vehicleDetails_approvalDate'),
			this.hasChanged('techRecord_adrDetails_permittedDangerousGoods'),
			this.hasChanged('techRecord_adrDetails_bodyDeclaration_type'),
			this.hasChanged('techRecord_adrDetails_compatibilityGroupJ'),
			this.hasChanged('techRecord_adrDetails_additionalNotes_number'),
			this.hasChanged('techRecord_adrDetails_adrTypeApprovalNo'),
		].some((hasChanged) => hasChanged);
	}

	haveAnyTankDetailItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankManufacturer'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_yearOfManufacture'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankTypeAppNo'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankCode'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankStatement_statement'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tankStatement_productList'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_specialProvisions'),
		].some((hasChanged) => hasChanged);
	}

	haveAnyTankInspectionItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate'),
			this.hasChanged('techRecord_adrDetails_tank_tankDetails_tc3Details'),
		].some((hasChanged) => hasChanged);
	}

	haveAnyMiscellaneousItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_memosApply'),
			this.hasChanged('techRecord_adrDetails_m145Statement'),
		].some((hasChanged) => hasChanged);
	}

	haveAnyBatteryListItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_listStatementApplicable'),
			this.hasChanged('techRecord_adrDetails_batteryListNumber'),
		].some((hasChanged) => hasChanged);
	}

	haveAnyDeclarationsSeenItemsChanged() {
		return [
			this.hasChanged('techRecord_adrDetails_brakeDeclarationsSeen'),
			this.hasChanged('techRecord_adrDetails_brakeDeclarationIssuer'),
			this.hasChanged('techRecord_adrDetails_brakeEndurance'),
			this.hasChanged('techRecord_adrDetails_weight'),
			this.hasChanged('techRecord_adrDetails_declarationsSeen'),
		].some((hasChanged) => hasChanged);
	}

	hasUNNumberChanged(index: number) {
		const current = this.currentTechRecord() as ADRTechRecord;
		const amended = this.amendedTechRecord() as ADRTechRecord;
		if (!current || !amended) return true;

		return !isEqual(
			current.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo?.[index],
			amended.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo?.[index]
		);
	}
}
