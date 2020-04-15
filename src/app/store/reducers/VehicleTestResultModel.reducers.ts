import { initialVehicleTestResultModelState } from '@app/store/state/VehicleTestResultModel.state';
import {
  EVehicleTestResultModelActions, SetSelectedTestResultModelSuccess,
  VehicleTestResultModelActions
} from '../actions/VehicleTestResultModel.actions';

export function VehicleTestResultModelReducers(
  state = initialVehicleTestResultModelState,
  action: VehicleTestResultModelActions
) {
  switch (action.type) {
    case EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess: {
      return {
        ...state,
        vehicleTestResultModel: action.payload,
      };
    }

    case EVehicleTestResultModelActions.GetVehicleTestResultModelFailure: {
      return {
        ...state,
        vehicleTestResultModel: null,
      };
    }

    case EVehicleTestResultModelActions.SetTestViewState: {
      return {
        ...state,
        editState: action.editState
      };
    }

    case EVehicleTestResultModelActions.UpdateTestResultSuccess: {
      return {
        ...state,
        vehicleTestResultModel: action.testResultTestTypeNumber.testResultsUpdated,
        selectedTestResultModel: action.testResultTestTypeNumber.testResultUpdated
      };
    }

    case EVehicleTestResultModelActions.SetSelectedTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload[0]
      };
    }

    case EVehicleTestResultModelActions.UpdateSelectedTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload
      };
    }

    default:
      return state;
  }
}
