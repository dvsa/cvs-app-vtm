import { RouterReducerState } from '@ngrx/router-store';

import {
  initialVehicleTechRecordModelState,
  IVehicleTechRecordModelState
} from './VehicleTechRecordModel.state';
import {
  initialVehicleTestResultModelState,
  IVehicleTestResultModelState
} from './VehicleTestResultModel.state';
import {
  initialReferenceDataState,
  ReferenceDataState
} from '@app/store/state/ReferenceDataState.state';
import { initialLoaderState, ILoaderState } from './Loader.state';
import { VehicleTechRecordModelEffects } from '../effects/VehicleTechRecordModel.effects';
import { ErrorEffects } from './../effects/error.effects';
import { RouterEffects } from '../effects/router.effects';
import { ErrorState, initialErrorState } from '../reducers/error.reducers';

export interface IAppState {
  router?: RouterReducerState;
  loader: ILoaderState;
  vehicleTechRecordModel: IVehicleTechRecordModelState;
  vehicleTestResultModel: IVehicleTestResultModelState;
  referenceData: ReferenceDataState;
  error: ErrorState;
}

export const initialAppState: IAppState = {
  loader: initialLoaderState,
  vehicleTechRecordModel: initialVehicleTechRecordModelState,
  vehicleTestResultModel: initialVehicleTestResultModelState,
  referenceData: initialReferenceDataState,
  error: initialErrorState
};

export const getInitialState = (): IAppState => initialAppState;

export const ROOT_EFFECTS = [VehicleTechRecordModelEffects, ErrorEffects, RouterEffects];
