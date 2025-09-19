import { TestType } from '@models/test-types/testType';
import { TestTypeCategory } from '@models/test-types/testTypeCategory';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
	fetchTestTypes,
	fetchTestTypesComplete,
	fetchTestTypesFailed,
	fetchTestTypesSuccess,
} from './test-types.actions';

export const STORE_FEATURE_TEST_TYPES_KEY = 'testTypes';

export const testTypesAdapter: EntityAdapter<TestType | TestTypeCategory> = createEntityAdapter<
	TestType | TestTypeCategory
>();

interface Extras {
	loading: boolean;
}

export interface TestTypeState extends EntityState<TestType | TestTypeCategory>, Extras {}

export const initialTestTypeState: EntityState<TestType | TestTypeCategory> & Extras = testTypesAdapter.getInitialState(
	{ loading: false }
);

export const testTypesReducer = createReducer(
	initialTestTypeState,
	on(fetchTestTypes, (state) => ({ ...state, loading: true })),
	on(fetchTestTypesSuccess, (state, action) => ({ ...testTypesAdapter.setAll(action.payload, state), loading: false })),
	on(fetchTestTypesFailed, (state) => ({ ...state, loading: false })),
	on(fetchTestTypesComplete, (state) => ({ ...state, loading: false }))
);

export const testTypesFeatureState = createFeatureSelector<TestTypeState>(STORE_FEATURE_TEST_TYPES_KEY);
