import {RouterReducerState} from '@ngrx/router-store';
import {initialVehicleTechRecordModelState, IVehicleTechRecordModelState} from '@app/store/state/VehicleTechRecordModel.state';

export interface IAppState {
  router?: RouterReducerState;
  vehicleTechRecordModel: IVehicleTechRecordModelState;
}

export const initialAppState: IAppState = {
  vehicleTechRecordModel: initialVehicleTechRecordModelState
};

export const getInitialState = (): IAppState => initialAppState;
