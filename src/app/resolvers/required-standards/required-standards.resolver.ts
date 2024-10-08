import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '@store/required-standards/required-standards.actions';
import { RequiredStandardState } from '@store/required-standards/required-standards.reducer';
import { testResultInEdit } from '@store/test-records/test-records.selectors';
import { map, take } from 'rxjs';

export const requiredStandardsResolver: ResolveFn<boolean> = () => {
	const store: Store<RequiredStandardState> = inject(Store<RequiredStandardState>);
	const action$: Actions = inject(Actions);
	store.pipe(select(testResultInEdit), take(1)).subscribe((editingTestResult) => {
		store.dispatch(getRequiredStandards({ euVehicleCategory: editingTestResult?.euVehicleCategory ?? '' }));
	});

	return action$.pipe(
		ofType(getRequiredStandardsSuccess, getRequiredStandardsFailure),
		take(1),
		map((action) => action.type === getRequiredStandardsSuccess.type)
	);
};
