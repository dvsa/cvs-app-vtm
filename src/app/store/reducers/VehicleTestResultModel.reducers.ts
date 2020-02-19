import { initialVehicleTestResultModelState } from '../../store/state/VehicleTestResultModel.state';
import { EVehicleTestResultModelActions, VehicleTestResultModelActions } from '../actions/VehicleTestResultModel.actions';

export function VehicleTestResultModelReducers(state = initialVehicleTestResultModelState, action: VehicleTestResultModelActions) {
  switch (action.type) {
    case EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload,
        error: null // clear error message
      };
    }

    case EVehicleTestResultModelActions.GetVehicleTestResultModelFailure: {
      return {
        ...state,
        error: action.payload  // capture error message
      };
    }

    default:
      return state;
  }
}
