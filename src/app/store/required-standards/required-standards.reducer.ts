import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { getRequiredStandardsSuccess } from './required-standards.actions';

export interface RequiredStandardState extends EntityState<DefectGETRequiredStandards> {
	error: string;
}

export const STORE_FEATURE_REQUIRED_STANDARDS_KEY = 'RequiredStandards';

export const requiredStandardsFeatureState = createFeatureSelector<RequiredStandardState>(
	STORE_FEATURE_REQUIRED_STANDARDS_KEY
);

export const requiredStandardsAdapter = createEntityAdapter<DefectGETRequiredStandards>({
	selectId: (standards) => standards.euVehicleCategories[0],
});

export const initialRequiredStandardsState: RequiredStandardState = requiredStandardsAdapter.getInitialState({
	error: '',
});

export const requiredStandardsReducer = createReducer<RequiredStandardState>(
	initialRequiredStandardsState,

	on(getRequiredStandardsSuccess, (state, action) => {
		return requiredStandardsAdapter.upsertOne(orderRequiredStandards(action.requiredStandards), {
			...state,
			error: '',
		});
	})
);

function orderRequiredStandards(requiredStandards: DefectGETRequiredStandards) {
	if (requiredStandards.basic.length) {
		requiredStandards.basic.sort((current, next) =>
			current.sectionNumber.localeCompare(next.sectionNumber, 'en', { numeric: true })
		);
	}
	if (requiredStandards.normal.length) {
		requiredStandards.normal.sort((current, next) =>
			current.sectionNumber.localeCompare(next.sectionNumber, 'en', { numeric: true })
		);
	}
	return requiredStandards;
}
