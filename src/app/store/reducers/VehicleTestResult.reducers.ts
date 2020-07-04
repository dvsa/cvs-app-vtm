import { initialVehicleTestResultModelState } from '@app/store/state/VehicleTestResult.state';
import {
  EVehicleTestResultActions,
  VehicleTestResultActions
} from '../actions/VehicleTestResult.actions';

export function VehicleTestResultReducers(
  state = initialVehicleTestResultModelState,
  action: VehicleTestResultActions
) {
  switch (action.type) {
    case EVehicleTestResultActions.GetVehicleTestResultModelSuccess: {
      return {
        ...state,
        vehicleTestResultModel: action.payload
      };
    }

    case EVehicleTestResultActions.GetVehicleTestResultModelFailure: {
      return {
        ...state,
        vehicleTestResultModel: null
      };
    }

    case EVehicleTestResultActions.SetTestViewState: {
      return {
        ...state,
        editState: action.editState
      };
    }

    case EVehicleTestResultActions.UpdateTestResultSuccess: {
      return {
        ...state,
        vehicleTestResultModel: action.testResultTestTypeNumber.testResultsUpdated,
        selectedTestResultModel: action.testResultTestTypeNumber.testResultUpdated
      };
    }

    case EVehicleTestResultActions.SetSelectedTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload[0]
      };
    }

    case EVehicleTestResultActions.UpdateSelectedTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload
      };
    }

    case EVehicleTestResultActions.CreateTestResultSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.vTestResultUpdated
      };
    }

    default:
      return state;
  }
}
