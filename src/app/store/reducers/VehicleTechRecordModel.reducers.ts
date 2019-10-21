import {initialVehicleTechRecordModelState, IVehicleTechRecordModelState} from '@app/store/state/VehicleTechRecordModel.state';
import {EVehicleTechRecordModelActions, VehicleTechRecordModelActions} from '@app/store/actions/VehicleTechRecordModel.actions';
import {IAppState} from '@app/store/state/app.state';

export const VehicleTechRecordModelReducers = (state = initialVehicleTechRecordModelState, action: VehicleTechRecordModelActions):
  IVehicleTechRecordModelState => {
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
