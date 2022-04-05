import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';
import * as TestRecordServiceActions from './test-record-service.actions';

export interface TestRecordServiceState {
  testRecords?: TestResultModel[];
}

const initialState: TestRecordServiceState = {
  testRecords: [],
};

const getVehicleTestRecordState = createFeatureSelector<TestRecordServiceState>('testRecords');

export const testRecords = createSelector(getVehicleTestRecordState, (state) => state);

const _vehicleTestRecordReducer = createReducer(
  initialState,
  on(TestRecordServiceActions.getBySystemId, (state) => state),
  on(TestRecordServiceActions.getBySystemIdSuccess, (state, props) => ({ testRecords: props.testRecords })),
);

export function testRecordServiceReducer(state: TestRecordServiceState, action: any) {
  return _vehicleTestRecordReducer(state, action);
}
