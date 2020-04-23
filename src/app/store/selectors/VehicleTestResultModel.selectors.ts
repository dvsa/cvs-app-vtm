import { createSelector, createFeatureSelector } from '@ngrx/store';
import { VehicleTestResultModelState } from '@app/store/state/VehicleTestResultModel.state';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';

export const selectFeature = createFeatureSelector<VehicleTestResultModelState>(
  'vehicleTestResultModel'
);

export const selectSelectedVehicleTestResultModel = createSelector(
  selectFeature,
  (state: VehicleTestResultModelState) => state.vehicleTestResultModel
);

export const selectTestTypeById = (id: string) =>
  createSelector(selectFeature, (state: VehicleTestResultModelState) => {
    let testType: TestType;
    let testRecord: TestResultModel;

    if (state.vehicleTestResultModel) {
      Object.keys(state.vehicleTestResultModel).forEach(function (tRIndex) {
        state.vehicleTestResultModel[tRIndex].testTypes.some((tTypeRes) => {
          if (tTypeRes.testNumber === id) {
            testType = tTypeRes;
            testRecord = state.vehicleTestResultModel[tRIndex];
          }
          return tTypeRes.testNumber === id;
        });
      });
    }
    const test: TestRecordTestType = { testType, testRecord };
    return test;
  });

export const getCurrentState = createSelector(
  selectFeature,
  (state: VehicleTestResultModelState) => state.editState
);

