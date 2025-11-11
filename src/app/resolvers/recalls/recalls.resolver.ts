import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { techRecord } from '@store/technical-records';
import { getRecalls, getRecallsFailure, getRecallsSuccess } from '@store/test-records';
import { Observable, map, of, take } from 'rxjs';

export const recallsResolver: ResolveFn<Observable<RecallsSchema | undefined>> = () => {
	const store = inject(Store);
	const actions$ = inject(Actions);
	const record = store.selectSignal(techRecord)();

	if (
		!record ||
		!(
			record.techRecord_vehicleType === VehicleTypes.HGV ||
			record.techRecord_vehicleType === VehicleTypes.PSV ||
			record.techRecord_vehicleType === VehicleTypes.TRL
		)
	) {
		return of(undefined);
	}

	store.dispatch(getRecalls());

	// @TODO: Doing this causes a delay as it waits for success or failure -
	//  might be better to return undefined and capture this via an effect which doesn't block navigation
	return actions$.pipe(
		ofType(getRecallsSuccess, getRecallsFailure),
		take(1),
		map((action) => (action.type === getRecallsSuccess.type ? action.recalls : undefined))
	);
};
