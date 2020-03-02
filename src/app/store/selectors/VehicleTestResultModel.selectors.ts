import {createSelector, createFeatureSelector} from '@ngrx/store';
import {IVehicleTestResultModelState} from '@app/store/state/VehicleTestResultModel.state';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

export const selectFeature = createFeatureSelector<IVehicleTestResultModelState>(
  'vehicleTestResultModel'
);

export const selectSelectedVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.vehicleTestResultModel
);

export const selectTestTypeById = (id: string) => createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => {
    let testType: TestType;
    let testRecord: TestResultModel;

    if (state.vehicleTestResultModel) {
      Object.keys(state.vehicleTestResultModel).forEach(function (tRIndex) {
        state.vehicleTestResultModel[tRIndex].testTypes.some( (tTypeRes) => {
          if (tTypeRes.testNumber === id) {
            testType   = tTypeRes;
            testRecord = state.vehicleTestResultModel[tRIndex];
          }
          return tTypeRes.testNumber === id;
        });
      });
    }

     return [testType, testRecord];
  }
);

