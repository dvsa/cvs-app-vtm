import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { selectTechRecord, updateEditingTechRecord } from '@store/technical-records';
import { Observable, map, take, tap } from 'rxjs';

export const techRecordCleanResolver: ResolveFn<Observable<boolean>> = (route) => {
	const store = inject(Store<State>);

	return store.select(selectTechRecord).pipe(
		take(1),
		map((vehicleTechRecord) => vehicleTechRecord as TechRecordType<'put'>),
		map((vehicleTechRecord) => cleanseApprovalType(vehicleTechRecord, route)),
		tap((vehicleTechRecord) => store.dispatch(updateEditingTechRecord({ vehicleTechRecord }))),
		map(() => true)
	);
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
