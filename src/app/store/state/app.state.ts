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
import { RouterEffects } from '../effects/router.effects';
import { ErrorState, initialErrorState } from '../reducers/error.reducers';
import { AppFormState, initialAppFormState } from '../reducers/app-form-state.reducers';
import { ModalState } from '@app/modal/modal.reducer';
import { initialModalState } from '../../modal/modal.reducer';
import { ModalEffects } from '@app/modal/modal.effects';
import { AppFormEffects } from '../effects/app-form.effects';

export interface IAppState {
  router?: RouterReducerState;
  loader: ILoaderState;
  vehicleTechRecordModel: IVehicleTechRecordModelState;
  vehicleTestResultModel: IVehicleTestResultModelState;
  referenceData: ReferenceDataState;
  error: ErrorState;
  appFormState: AppFormState;
  modalState: ModalState;
}

export const initialAppState: IAppState = {
  loader: initialLoaderState,
  vehicleTechRecordModel: initialVehicleTechRecordModelState,
  vehicleTestResultModel: initialVehicleTestResultModelState,
  referenceData: initialReferenceDataState,
  error: initialErrorState,
  appFormState: initialAppFormState,
  modalState: initialModalState,
};

export const getInitialState = (): IAppState => initialAppState;

export const ROOT_EFFECTS = [VehicleTechRecordModelEffects, ModalEffects, AppFormEffects, RouterEffects];
