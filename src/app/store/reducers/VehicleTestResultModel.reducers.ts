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
        error: null
      };
    }

    case EVehicleTestResultModelActions.GetVehicleTestResultModelFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case EVehicleTestResultModelActions.SetCurrentState: {
      return {
        ...state,
        editState: action.editState
      };
    }

    case EVehicleTestResultModelActions.UpdateTestResultSuccess: {
      const updatedVehicleTestResults = state.vehicleTestResultModel.map((testResult) => {
        if (
          testResult.testTypes.some(
            (testType) => testType.testNumber === action.testResultTestTypeNumber.testTypeNumber
          )
        ) {
          return action.testResultTestTypeNumber.testResultUpdated;
        } else {
          return testResult;
        }
      });

      return {
        ...state,
        vehicleTestResultModel: updatedVehicleTestResults,
        selectedTestResultModel: action.testResultTestTypeNumber.testResultUpdated
      };
    }

    case EVehicleTestResultModelActions.SetSelectedTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload[0],
        error: null
      };
    }

    default:
      return state;
  }
}
