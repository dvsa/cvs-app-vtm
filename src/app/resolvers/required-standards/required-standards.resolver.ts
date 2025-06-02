import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getRequiredStandards } from '@store/required-standards/required-standards.actions';
import { RequiredStandardState } from '@store/required-standards/required-standards.reducer';
import { getRequiredStandardsState } from '@store/required-standards/required-standards.selector';
import { testResultInEdit } from '@store/test-records/test-records.selectors';
import { map, skipWhile, take } from 'rxjs';

export const requiredStandardsResolver: ResolveFn<boolean> = () => {
	const store: Store<RequiredStandardState> = inject(Store<RequiredStandardState>);
	store.pipe(select(testResultInEdit), take(1)).subscribe((editingTestResult) => {
		store.dispatch(getRequiredStandards({ euVehicleCategory: editingTestResult?.euVehicleCategory ?? '' }));
	});

	// Ensure that the required standards are loaded before resolving
	return store.select(getRequiredStandardsState).pipe(
		skipWhile((state) => state.basic.length === 0 && state.normal.length === 0),
		map(() => true)
	);
};
