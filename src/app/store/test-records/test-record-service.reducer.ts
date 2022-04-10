import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';
import * as TestRecordServiceActions from './test-record-service.actions';

export const STORE_FEATURE_TEST_RECORD_KEY = "testRecords";

export interface TestRecordServiceState {
  testRecords?: TestResultModel[];
}

export const initialState: TestRecordServiceState = {
  testRecords: [],
};

const getVehicleTestRecordState = createFeatureSelector<TestRecordServiceState>(STORE_FEATURE_TEST_RECORD_KEY);

export const testRecords = createSelector(getVehicleTestRecordState, (state) => state);

const _vehicleTestRecordReducer = createReducer(
  initialState,
  on(TestRecordServiceActions.getBySystemId, (state) => {console.log(state); return state}),
  on(TestRecordServiceActions.getBySystemIdSuccess, (state, props) => ({ testRecords: props.testRecords })),
);

export function testRecordServiceReducer(state: TestRecordServiceState, action: any) {
  return _vehicleTestRecordReducer(state, action);
}
