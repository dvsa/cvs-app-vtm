import {initialVehicleTechRecordModelState, IVehicleTechRecordModelState} from '../state/VehicleTechRecordModel.state';
import {EVehicleTechRecordModelActions, VehicleTechRecordModelActions} from '../actions/VehicleTechRecordModel.actions';

export function VehicleTechRecordModelReducers(state = initialVehicleTechRecordModelState, action: VehicleTechRecordModelActions) {
  switch (action.type) {
    case EVehicleTechRecordModelActions.GetVehicleTechRecordModelSuccess: {
      return {
        ...state,
        selectedVehicleTechRecordModel: action.payload,
        error: null // clear error message
      };
    }

    case EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: action.payload,
        error: null // clear error message
      };
    }

    case EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllFailure: {
      return {
        ...state,
        error: action.payload  // capture error message
      }
    }

    default:
      return state;
  }
}
