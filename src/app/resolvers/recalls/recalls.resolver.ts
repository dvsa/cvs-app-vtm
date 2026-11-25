import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { techRecord } from '@store/technical-records';
import { getRecalls, getRecallsFailure, getRecallsSuccess, selectRecallsState } from '@store/test-records';
import { filter, map, of, take } from 'rxjs';

export const recallsResolver: ResolveFn<RecallsSchema | undefined> = (route) => {
	const store = inject(Store);
	const actions$ = inject(Actions);
	const featureToggleService = inject(FeatureToggleService);
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

	if (!featureToggleService.shouldUseV2TestResults(route.queryParamMap?.get('testType') ?? undefined)) {
		store.dispatch(getRecalls({ vin: record.vin }));
		return of(undefined);
	}

	const recallsState = store.selectSignal(selectRecallsState)();
	if (recallsState.vin === record.vin && recallsState.recalls) {
		return of(recallsState.recalls);
	}

	if (recallsState.vin !== record.vin || !recallsState.loading) {
		store.dispatch(getRecalls({ vin: record.vin }));
	}

	return actions$.pipe(
		ofType(getRecallsSuccess, getRecallsFailure),
		filter((action) => action.vin === record.vin),
		take(1),
		map((action) => ('recalls' in action ? action.recalls : undefined))
	);
};
