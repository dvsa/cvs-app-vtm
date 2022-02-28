import {
  EVehicleTechRecordActions,
  VehicleTechRecordActions
} from '../actions/VehicleTechRecordModel.actions';
import {
  initialVehicleTechRecordModelState,
  VehicleTechRecordState
} from '@app/store/state/VehicleTechRecordModel.state';

export function VehicleTechRecordReducers(
  state = initialVehicleTechRecordModelState,
  action: VehicleTechRecordActions
): VehicleTechRecordState {
  switch (action.type) {
    case EVehicleTechRecordActions.GetVehicleTechRecordHavingStatusAllSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: action.vehicleTechRecords
      };
    }

    case EVehicleTechRecordActions.UpdateVehicleTechRecordSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: state.vehicleTechRecordModel.map((vehicleRecord) =>
          vehicleRecord.systemNumber === action.vehicleTechRecord.systemNumber
            ? action.vehicleTechRecord
            : vehicleRecord
        )
      };
    }

    case EVehicleTechRecordActions.SetSelectedVehicleTechRecordSuccess: {
      return {
        ...state,
        selectedVehicleTechRecord: action.vehicleTechRecord
      };
    }

    case EVehicleTechRecordActions.SetViewState: {
      return {
        ...state,
        viewState: action.viewState
      };
    }

    default:
      return state;
  }
}
