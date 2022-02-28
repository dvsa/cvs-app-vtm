import { TestResultModel } from '../../models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

export interface IVehicleTestResultModelState {
  vehicleTestResultModel: TestResultModel[];
  selectedTestResultModel: TestResultModel;
  editState: VIEW_STATE;
  error?: any;
}

export const initialVehicleTestResultModelState: IVehicleTestResultModelState = {
  vehicleTestResultModel: null,
  selectedTestResultModel: null,
  editState: VIEW_STATE.VIEW_ONLY,
  error: null
};
