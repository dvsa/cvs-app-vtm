import { TestType } from '@models/test-types/testType';
import { TestTypeCategory } from '@models/test-types/testTypeCategory';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchTestTypesSuccess } from './test-types.actions';

export const STORE_FEATURE_TEST_TYPES_KEY = 'testTypes';

export const testTypesAdapter: EntityAdapter<TestType | TestTypeCategory> = createEntityAdapter<
	TestType | TestTypeCategory
>();

export interface TestTypeState extends EntityState<TestType | TestTypeCategory> {}

export const initialTestTypeState: EntityState<TestType | TestTypeCategory> = testTypesAdapter.getInitialState();

export const testTypesReducer = createReducer(
	initialTestTypeState,
	on(fetchTestTypesSuccess, (state, action) => ({ ...testTypesAdapter.setAll(action.payload, state) }))
);

export const testTypesFeatureState = createFeatureSelector<TestTypeState>(STORE_FEATURE_TEST_TYPES_KEY);
