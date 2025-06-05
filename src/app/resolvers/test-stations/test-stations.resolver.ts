import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestStations, fetchTestStationsFailed, fetchTestStationsSuccess } from '@store/test-stations';
import { map, take } from 'rxjs';

export const testStationsResolver: ResolveFn<boolean> = () => {
	const store: Store<State> = inject(Store<State>);
	const action$: Actions = inject(Actions);
	store.dispatch(fetchTestStations());

	return action$.pipe(
		ofType(fetchTestStationsSuccess, fetchTestStationsFailed),
		take(1),
		map((action) => action.type === fetchTestStationsSuccess.type)
	);
};
