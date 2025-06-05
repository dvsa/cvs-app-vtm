import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DefectsState, fetchDefects, fetchDefectsFailed, fetchDefectsSuccess } from '@store/defects';
import { map, take } from 'rxjs';

export const defectsTaxonomyResolver: ResolveFn<boolean> = () => {
	const store: Store<DefectsState> = inject(Store<DefectsState>);
	const action$: Actions = inject(Actions);
	store.dispatch(fetchDefects());

	return action$.pipe(
		ofType(fetchDefectsSuccess, fetchDefectsFailed),
		take(1),
		map((action) => action.type === fetchDefectsSuccess.type)
	);
};
