import { TestType } from '@models/test-types/testType';
import { TestTypeCategory } from '@models/test-types/testTypeCategory';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from './test-types.actions';

export const STORE_FEATURE_TEST_TYPES_KEY = 'testTypes';

export const testTypesAdapter: EntityAdapter<TestType | TestTypeCategory> = createEntityAdapter<
	TestType | TestTypeCategory
>();

export interface TestTypeState extends EntityState<TestType | TestTypeCategory> {
	loading: boolean;
}

export const initialTestTypeState = testTypesAdapter.getInitialState({ loading: false });

export const testTypesReducer = createReducer(
	initialTestTypeState,
	on(fetchTestTypes, (state) => ({ ...state, loading: true })),
	on(fetchTestTypesSuccess, (state, action) => ({ ...testTypesAdapter.setAll(action.payload, state), loading: false })),
	on(fetchTestTypesFailed, (state) => ({ ...state, loading: false }))
);

export const testTypesFeatureState = createFeatureSelector<TestTypeState>(STORE_FEATURE_TEST_TYPES_KEY);
