import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/router.selectors';
import { getTechRecordV3, getTechRecordV3Failure, getTechRecordV3Success } from '@store/technical-records';
import {
	fetchTestResultsBySystemNumber,
	fetchTestResultsBySystemNumberFailed,
	fetchTestResultsBySystemNumberSuccess,
} from '@store/test-records';
import { count, map, take } from 'rxjs';

export const techRecordViewResolver: ResolveFn<boolean> = () => {
	const store: Store<State> = inject(Store<State>);
	const action$: Actions = inject(Actions);
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
