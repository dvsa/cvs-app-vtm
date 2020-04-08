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
        vehicleTechRecordModel: action.payload
      };
    }

    case EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate: {
      return {
        ...state,
        initialDetails: action.payload
      };
    }

    case EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreateSucess: {
      return {
        ...state,
        initialDetails: action.payload
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

    /**
     * TODO: This reducer as well as corresponding effect and action
     * should be extracted to an app wide implementation. The implementation should
     * not be relevant to only TechRecord
     */
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
