import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
	getRequiredStandards,
	getRequiredStandardsComplete,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from './required-standards.actions';

export interface RequiredStandardState extends EntityState<DefectGETRequiredStandards> {
	loading: boolean;
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
	loading: false,
	error: '',
});

export const requiredStandardsReducer = createReducer<RequiredStandardState>(
	initialRequiredStandardsState,

	on(getRequiredStandards, (state) => ({ ...state, loading: true })),
	on(getRequiredStandardsSuccess, (state, action) => {
		return requiredStandardsAdapter.upsertOne(orderRequiredStandards(action.requiredStandards), {
			...state,
			loading: false,
			error: '',
		});
	}),
	on(getRequiredStandardsFailure, (state) => ({ ...state, loading: false })),
	on(getRequiredStandardsComplete, (state) => ({ ...state, loading: false }))
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
