import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { getRequiredStandards } from '@store/required-standards/required-standards.actions';
import { RequiredStandardState } from '@store/required-standards/required-standards.reducer';
import { testResultInEdit } from '@store/test-records/test-records.selectors';
import { take } from 'rxjs';

export const requiredStandardsResolver: ResolveFn<void> = () => {
	const store: Store<RequiredStandardState> = inject(Store<RequiredStandardState>);
	store.pipe(select(testResultInEdit), take(1)).subscribe((editingTestResult) => {
		store.dispatch(getRequiredStandards({ euVehicleCategory: editingTestResult?.euVehicleCategory ?? '' }));
	});
};
