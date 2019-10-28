import {RouterReducerState} from '@ngrx/router-store';
import {initialVehicleTechRecordModelState, IVehicleTechRecordModelState} from './VehicleTechRecordModel.state';
import {initialVehicleTestResultModelState, IVehicleTestResultModelState} from './VehicleTestResultModel.state';

export interface IAppState {
  router?: RouterReducerState;
  vehicleTechRecordModel: IVehicleTechRecordModelState;
  vehicleTestResultModel: IVehicleTestResultModelState;
}

export const initialAppState: IAppState = {
  vehicleTechRecordModel: initialVehicleTechRecordModelState,
  vehicleTestResultModel: initialVehicleTestResultModelState
};

export const getInitialState = (): IAppState => initialAppState;
