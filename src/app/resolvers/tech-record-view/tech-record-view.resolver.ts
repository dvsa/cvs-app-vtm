import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { FeatureFlags, FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/router.selectors';
import { getTechRecordV3, getTechRecordV3Failure, getTechRecordV3Success, techRecord } from '@store/technical-records';
import {
	fetchTestResultsBySystemNumber,
	fetchTestResultsBySystemNumberFailed,
	fetchTestResultsBySystemNumberSuccess,
} from '@store/test-records';
import { count, map, of, take } from 'rxjs';

export const techRecordViewResolver: ResolveFn<boolean> = (route) => {
	const store: Store<State> = inject(Store<State>);
	const action$: Actions = inject(Actions);
	const featureToggleService = inject(FeatureToggleService);
	const cachedRecord = store.selectSignal(techRecord)();

	if (
		featureToggleService.isFeatureEnabled(FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS) &&
		route.data['isEditing'] &&
		cachedRecord?.systemNumber === route.params['systemNumber'] &&
		cachedRecord?.createdTimestamp === route.params['createdTimestamp']
	) {
		return of(true);
	}

	store.pipe(select(selectRouteNestedParams), take(1)).subscribe(({ systemNumber, createdTimestamp }) => {
		store.dispatch(getTechRecordV3({ systemNumber, createdTimestamp }));
		store.dispatch(fetchTestResultsBySystemNumber({ systemNumber }));
	});

	return action$.pipe(
		ofType(
			getTechRecordV3Success,
			fetchTestResultsBySystemNumberSuccess,
			getTechRecordV3Failure,
			fetchTestResultsBySystemNumberFailed
		),
		take(2),
		count(
			(action) =>
				action.type === getTechRecordV3Success.type || action.type === fetchTestResultsBySystemNumberSuccess.type
		),
		map((total) => total === 2)
	);
};
