import { RouterReducerState } from '@ngrx/router-store';
import { initialVehicleTechRecordModelState, IVehicleTechRecordModelState } from './VehicleTechRecordModel.state';
import { initialVehicleTestResultModelState, IVehicleTestResultModelState } from './VehicleTestResultModel.state';
import { initialLoaderState, ILoaderState } from './Loader.state';
export interface IAppState {
  router?: RouterReducerState;
  loader: ILoaderState,
  vehicleTechRecordModel: IVehicleTechRecordModelState;
  vehicleTestResultModel: IVehicleTestResultModelState;
  error?: string | null; // track errors
}

export const initialAppState: IAppState = {
  loader: initialLoaderState,
  vehicleTechRecordModel: initialVehicleTechRecordModelState,
  vehicleTestResultModel: initialVehicleTestResultModelState,
};

export const getInitialState = (): IAppState => initialAppState;
