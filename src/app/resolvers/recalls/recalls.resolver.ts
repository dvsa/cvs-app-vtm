import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { getRecalls, getRecallsFailure, getRecallsSuccess } from '../../store/test-records';

export const recallsResolver: ResolveFn<Observable<RecallsSchema | undefined>> = () => {
	const store = inject(Store);
	const actions$ = inject(Actions);

	store.dispatch(getRecalls());

	return actions$.pipe(
		ofType(getRecallsSuccess, getRecallsFailure),
		take(1),
		map((action) => (action.type === getRecallsSuccess.type ? action.recalls : undefined))
	);
};
