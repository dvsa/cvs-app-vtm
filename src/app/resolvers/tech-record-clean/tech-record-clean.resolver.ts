import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { selectTechRecord, updateEditingTechRecord } from '@store/technical-records';
import _ from 'lodash';
import { Observable, map, take, tap } from 'rxjs';

export const techRecordCleanResolver: ResolveFn<Observable<boolean>> = (route) => {
	const store = inject(Store<State>);

	return store.select(selectTechRecord).pipe(
		take(1),
		map((vehicleTechRecord) => vehicleTechRecord as TechRecordType<'put'>),
		map((vehicleTechRecord) => sortAdditionalExaminerNotes(vehicleTechRecord, route)),
		map((vehicleTechRecord) => cleanseApprovalType(vehicleTechRecord, route)),
		map((vehicleTechRecord) => cleanseADRDetails(vehicleTechRecord, route)),
		tap((vehicleTechRecord) => store.dispatch(updateEditingTechRecord({ vehicleTechRecord }))),
		map(() => true)
	);
};

const sortAdditionalExaminerNotes = (record: TechRecordType<'put'>, route: ActivatedRouteSnapshot) => {
	if (!route.data['isEditing']) return record;

	const type = record.techRecord_vehicleType;
	if (type === VehicleTypes.HGV || type === VehicleTypes.LGV || type === VehicleTypes.TRL) {
		if (Array.isArray(record.techRecord_adrDetails_additionalExaminerNotes)) {
			record.techRecord_adrDetails_additionalExaminerNotes = _.orderBy(
				record.techRecord_adrDetails_additionalExaminerNotes,
				['createdAtDate'],
				['desc']
			);
		}
	}

	return record;
};

export const cleanseApprovalType = (record: TechRecordType<'put'>, route: ActivatedRouteSnapshot) => {
	if (!route.data['isEditing']) return record;

	const type = record.techRecord_vehicleType;
	if (type === VehicleTypes.HGV || type === VehicleTypes.PSV || type === VehicleTypes.TRL) {
		const approvalType = record.techRecord_approvalType;
		const approvalNumber = record.techRecord_approvalTypeNumber;
		if (approvalType?.toString() === 'Small series' && approvalNumber) {
			// infer new approval type based on format of approval type number
			const patterns = new Map<ApprovalType, RegExp>([
				[ApprovalType.SMALL_SERIES_NKSXX, /^(.?)11\*NKS(.{0,2})\/(.{0,4})\*(.{0,6})$/i],
				[ApprovalType.SMALL_SERIES_NKS, /^(.?)11\*NKS\*(.{0,6})$/i],
			]);

			patterns.forEach((value, key) => {
				if (value.test(approvalNumber)) {
					record.techRecord_approvalType = key;
				}
			});
		}
	}

	return record;
};

export const cleanseADRDetails = (record: TechRecordType<'put'>, route: ActivatedRouteSnapshot) => {
	if (!route.data['isEditing']) return record;

	const type = record.techRecord_vehicleType;
	if (type === VehicleTypes.HGV || type === VehicleTypes.LGV || type === VehicleTypes.TRL) {
		// If the vehicle record includes 'Class 5.1 Hydrogen Peroxide (OX)' as a permitted dangerous good, remove it
		if (Array.isArray(record.techRecord_adrDetails_permittedDangerousGoods)) {
			const oxIndex = record.techRecord_adrDetails_permittedDangerousGoods.indexOf('Class 5.1 Hydrogen Peroxide (OX)');
			if (oxIndex !== -1) {
				record.techRecord_adrDetails_permittedDangerousGoods.splice(oxIndex, 1);
			}
		}
	}

	return record;
};
