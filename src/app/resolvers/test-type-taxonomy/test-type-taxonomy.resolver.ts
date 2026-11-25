import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestTypes } from '@store/test-types/test-types.actions';
import { selectTestTypesTotal } from '@store/test-types/test-types.selectors';

export const testTypeTaxonomyResolver: ResolveFn<void> = () => {
	const store: Store<State> = inject(Store<State>);
	if (store.selectSignal(selectTestTypesTotal)() === 0) {
		store.dispatch(fetchTestTypes());
	}
};
