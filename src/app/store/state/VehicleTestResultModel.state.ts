import {TestResultModel} from '@app/models/test-result.model';

export interface IVehicleTestResultModelState {
  testResultModel: TestResultModel;
  selectedTestResultModel: TestResultModel;
}

export const initialVehicleTestResultModelState: IVehicleTestResultModelState = {
  testResultModel: null,
  selectedTestResultModel: null
}
