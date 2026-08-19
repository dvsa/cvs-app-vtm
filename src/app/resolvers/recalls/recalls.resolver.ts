import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { techRecord } from '@store/technical-records';
import { getRecalls } from '@store/test-records';
import { of } from 'rxjs';

export const recallsResolver: ResolveFn<void> = () => {
	const store = inject(Store);
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

	// Recalls are patched into the editing test result by TestResultsEffects.
	// Do not hold route activation open while the background request completes.
	return of(undefined);
};
