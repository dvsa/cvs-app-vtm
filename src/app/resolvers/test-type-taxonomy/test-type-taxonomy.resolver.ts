import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '@store/test-types/test-types.actions';
import { map, take } from 'rxjs';

export const testTypeTaxonomyResolver: ResolveFn<boolean> = () => {
	const store: Store<State> = inject(Store<State>);
	const action$: Actions = inject(Actions);
	store.dispatch(fetchTestTypes());

	return action$.pipe(
		ofType(fetchTestTypesSuccess, fetchTestTypesFailed),
		take(1),
		map((action) => action.type === fetchTestTypesSuccess.type)
	);
};
