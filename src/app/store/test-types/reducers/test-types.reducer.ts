import { state } from '@angular/animations';
import { TestType, TestTypeCategory } from '@api/test-types';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchTestTypesFailed, fetchTestTypesSuccess, fetchTestTypes } from '../actions/test-types.actions';

export const STORE_FEATURE_TEST_TYPES_KEY = 'testTypes';

export const testTypesAdapter: EntityAdapter<TestType | TestTypeCategory> = createEntityAdapter<TestType | TestTypeCategory>();

export interface TestTypeState extends EntityState<TestType | TestTypeCategory> {
  loading: boolean;
}

export const initialTestTypeState = testTypesAdapter.getInitialState({ loading: false });

export const testTypesReducer = createReducer(
  initialTestTypeState,
  on(fetchTestTypes, state => ({ ...state, loading: true })),
  on(fetchTestTypesSuccess, (state, action) => ({ ...testTypesAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestTypesFailed, state => ({ ...state, loading: false }))
);

export const testTypesFeatureState = createFeatureSelector<TestTypeState>(STORE_FEATURE_TEST_TYPES_KEY);
