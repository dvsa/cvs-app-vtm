import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestStations } from '@store/test-stations';

export const testStationsResolver: ResolveFn<boolean> = () => {
  const store: Store<State> = inject(Store<State>);
  store.dispatch(fetchTestStations());
  return true;
};
