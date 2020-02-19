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
        error: action.payload // capture error message
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

    case EVehicleTechRecordModelActions.SetVehicleTechRecordIdentifier: {
      return {
        ...state,
        selectedTechRecordIdentifier: action.techRecordIdentifier
      };
    }

    case EVehicleTechRecordModelActions.UpdateVehicleTechRecordsSuccess: {
      return {
        ...state,
        vehicleTechRecordModel: action.vehicleTechRecords
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
