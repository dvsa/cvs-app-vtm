import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestStations, testStations } from '@store/test-stations';
import { map, skipWhile } from 'rxjs';

export const testStationsResolver: ResolveFn<boolean> = () => {
	const store: Store<State> = inject(Store<State>);
	store.dispatch(fetchTestStations());

	// Ensure test stations has been loaded before allowing navigation to the test create page
	return store.select(testStations).pipe(
		skipWhile((testStations) => Array.isArray(testStations) && testStations.length === 0),
		map(() => true)
	);
};
