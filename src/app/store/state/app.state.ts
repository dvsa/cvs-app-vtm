import { RouterReducerState } from '@ngrx/router-store';
import {
  initialVehicleTechRecordModelState,
  IVehicleTechRecordModelState
} from './VehicleTechRecordModel.state';
import {
  initialVehicleTestResultModelState,
  VehicleTestResultModelState
} from './VehicleTestResultModel.state';
import { initialLoaderState, ILoaderState } from './Loader.state';
import {
  initialReferenceDataState,
  ReferenceDataState
} from '@app/store/state/ReferenceDataState.state';

export interface IAppState {
  router?: RouterReducerState;
  loader: ILoaderState;
  vehicleTechRecordModel: IVehicleTechRecordModelState;
  vehicleTestResultModel: VehicleTestResultModelState;
  referenceData: ReferenceDataState;
  error?: [string] | null;
}

export const initialAppState: IAppState = {
  loader: initialLoaderState,
  vehicleTechRecordModel: initialVehicleTechRecordModelState,
  vehicleTestResultModel: initialVehicleTestResultModelState,
  referenceData: initialReferenceDataState
};

export const getInitialState = (): IAppState => initialAppState;
