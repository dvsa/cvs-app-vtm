import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestTypes } from '@store/test-types/actions/test-types.actions';

export const testTypeTaxonomyResolver: ResolveFn<boolean> = () => {
  const store: Store<State> = inject(Store<State>);
  store.dispatch(fetchTestTypes());
  return true;
};
