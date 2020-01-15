import {TestResultModel} from '../../models/test-result.model';

export interface IVehicleTestResultModelState {
  vehicleTestResultModel: TestResultModel;
  selectedTestResultModel: TestResultModel;
  error?: any;
}

export const initialVehicleTestResultModelState: IVehicleTestResultModelState = {
  vehicleTestResultModel: null,
  selectedTestResultModel: null,
  error: null
};
