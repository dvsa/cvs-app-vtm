import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from './required-standards.actions';

export interface RequiredStandardState {
	loading: boolean;
	error: string;
	requiredStandards: DefectGETRequiredStandards;
}

export const STORE_FEATURE_REQUIRED_STANDARDS_KEY = 'RequiredStandards';

export const requiredStandardsFeatureState = createFeatureSelector<RequiredStandardState>(
	STORE_FEATURE_REQUIRED_STANDARDS_KEY
);

export const initialRequiredStandardsState: RequiredStandardState = {
	loading: false,
	error: '',
	requiredStandards: {
		basic: [],
		normal: [],
		euVehicleCategories: [],
	},
};

export const requiredStandardsReducer = createReducer(
	initialRequiredStandardsState,

	on(getRequiredStandards, (state) => ({ ...state, loading: true })),
	on(getRequiredStandardsSuccess, (state, action) => ({
		...state,
		requiredStandards: orderRequiredStandards(action.requiredStandards),
		loading: false,
	})),
	on(getRequiredStandardsFailure, (state) => ({ ...state, loading: false }))
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
