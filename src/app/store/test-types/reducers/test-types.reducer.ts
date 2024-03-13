import { TestType, TestTypeCategory } from '@api/test-types';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { setTestStationsLoading } from '@store/test-stations';
import { fetchTestTypesFailed, fetchTestTypesSuccess } from '../actions/test-types.actions';

export const STORE_FEATURE_TEST_TYPES_KEY = 'testTypes';

export const testTypesAdapter: EntityAdapter<TestType | TestTypeCategory> = createEntityAdapter<TestType | TestTypeCategory>();

export interface TestTypeState extends EntityState<TestType | TestTypeCategory> {
  loading: boolean;
}

export const initialTestTypeState = testTypesAdapter.getInitialState({ loading: false });

export const testTypesReducer = createReducer(
  initialTestTypeState,
  on(fetchTestTypesSuccess, (state, action) => ({ ...testTypesAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestTypesFailed, (state) => ({ ...state, loading: false })),
  on(setTestStationsLoading, (state, { loading }) => ({ ...state, loading })),
);

export const testTypesFeatureState = createFeatureSelector<TestTypeState>(STORE_FEATURE_TEST_TYPES_KEY);
