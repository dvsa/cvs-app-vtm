import { RouterReducerState } from '@ngrx/router-store';

import {
  initialVehicleTechRecordModelState,
  IVehicleTechRecordModelState
} from './VehicleTechRecordModel.state';
import {
  initialVehicleTestResultModelState,
  IVehicleTestResultModelState
} from './VehicleTestResultModel.state';
import { initialLoaderState, ILoaderState } from './Loader.state';
import { VehicleTechRecordModelEffects } from '../effects/VehicleTechRecordModel.effects';
import { ErrorEffects } from './../effects/error.effects';

export interface IAppState {
  router?: RouterReducerState;
  loader: ILoaderState;
  vehicleTechRecordModel: IVehicleTechRecordModelState;
  vehicleTestResultModel: IVehicleTestResultModelState;
  error?: [string] | null;
}

export const initialAppState: IAppState = {
  loader: initialLoaderState,
  vehicleTechRecordModel: initialVehicleTechRecordModelState,
  vehicleTestResultModel: initialVehicleTestResultModelState
};

export const getInitialState = (): IAppState => initialAppState;

export const ROOT_EFFECTS = [VehicleTechRecordModelEffects, ErrorEffects];

/**
 * TODO: Content of app.reducers to be merged centrally with app.state.ts
 */
