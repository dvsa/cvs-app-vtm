import {
  EVehicleTechRecordModelActions,
  SetVehicleTechRecordModelVinOnCreateSucess,
  VehicleTechRecordModelActions
} from '../actions/VehicleTechRecordModel.actions';
import { initialVehicleTechRecordModelState, IVehicleTechRecordModelState } from '@app/store/state/VehicleTechRecordModel.state';

export function VehicleTechRecordModelReducers(state = initialVehicleTechRecordModelState, action: VehicleTechRecordModelActions):
IVehicleTechRecordModelState {
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
      };
    }

    case EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate: {
      return {
        ...state,
        initialDetails: action.payload,
        error: null
      };
    }

    case EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreateSucess: {
      return {
        ...state,
        initialDetails: action.payload,
        error: null
      };
    }

    default:
      return state;
  }
}
