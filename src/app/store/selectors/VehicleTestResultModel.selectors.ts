import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IVehicleTestResultModelState } from '@app/store/state/VehicleTestResultModel.state';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';

export const selectFeature = createFeatureSelector<IVehicleTestResultModelState>(
  'vehicleTestResultModel'
);

export const getVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.vehicleTestResultModel
);

export const selectTestTypeById = (id: string) =>
  createSelector(selectFeature, (state: IVehicleTestResultModelState) => {
    let testType: TestType;
    let testRecord: TestResultModel;

    if (state.selectedTestResultModel) {
      testRecord = state.selectedTestResultModel;
      testRecord.testTypes.some((tTypeRes) => {
        if (tTypeRes.testNumber === id) {
          testType = tTypeRes;
        }
        return tTypeRes.testNumber === id;
      });
    }
    const test: TestRecordTestType = { testType, testRecord };
    return test;
  });

export const getCurrentState = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.editState
);

export const getSelectedVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.selectedTestResultModel
);

