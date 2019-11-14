import {initialVehicleTechRecordModelState, IVehicleTechRecordModelState} from '../state/VehicleTechRecordModel.state';
import {EVehicleTechRecordModelActions, VehicleTechRecordModelActions} from '../actions/VehicleTechRecordModel.actions';

export function VehicleTechRecordModelReducers(state = initialVehicleTechRecordModelState, action: VehicleTechRecordModelActions):
  IVehicleTechRecordModelState {
  switch (action.type) {
    case EVehicleTechRecordModelActions.GetVehicleTechRecordModelSuccess: {
      return {
        ...state,
        selectedVehicleTechRecordModel: action.payload
      };
    }

    case EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: action.payload
      };
    }

    default:
      return state;
  }
}
