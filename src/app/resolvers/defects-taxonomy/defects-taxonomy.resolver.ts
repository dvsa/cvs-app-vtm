import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { DefectsState, fetchDefects } from '@store/defects';

export const defectsTaxonomyResolver: ResolveFn<void> = () => {
	const store: Store<DefectsState> = inject(Store<DefectsState>);
	store.dispatch(fetchDefects());
};
