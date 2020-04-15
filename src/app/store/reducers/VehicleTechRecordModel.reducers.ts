import {
  EVehicleTechRecordModelActions,
  VehicleTechRecordModelActions
} from '../actions/VehicleTechRecordModel.actions';
import {
  initialVehicleTechRecordModelState,
  IVehicleTechRecordModelState
} from '@app/store/state/VehicleTechRecordModel.state';

export function VehicleTechRecordModelReducers(
  state = initialVehicleTechRecordModelState,
  action: VehicleTechRecordModelActions
): IVehicleTechRecordModelState {
  switch (action.type) {
    case EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: action.vehicleTechRecords
      };
    }

    case EVehicleTechRecordModelActions.UpdateVehicleTechRecordSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: state.vehicleTechRecordModel.map((vehicleRecord) =>
          vehicleRecord.systemNumber === action.vehicleTechRecord.systemNumber
            ? action.vehicleTechRecord
            : vehicleRecord
        )
      };
    }

    case EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecordSucess: {
      return {
        ...state,
        selectedVehicleTechRecord: action.vehicleTechRecord
      };
    }

    case EVehicleTechRecordModelActions.SetViewState: {
      return {
        ...state,
        viewState: action.viewState
      };
    }

    default:
      return state;
  }
}
