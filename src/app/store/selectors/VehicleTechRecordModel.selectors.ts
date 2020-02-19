import { createSelector, createFeatureSelector } from '@ngrx/store';
import { VehicleTechRecordModel } from './../../models/vehicle-tech-record.model';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';

export const selectFeature = createFeatureSelector<IVehicleTechRecordModelState>(
  'vehicleTechRecordModel'
);

export const selectVehicleTechRecordModelHavingStatusAll = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.vehicleTechRecordModel
);

export const selectSelectedVehicleTechRecordModel = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecordModel
);

export const getVehicleTechRecordModelError = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.error
);

export const getVehicleTechRecordIdentifier = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.selectedTechRecordIdentifier
);

export const getSelectedVehicleTechRecord = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecord
);

export const getVehicleTechRecordAdrMetaData = createSelector(
  getSelectedVehicleTechRecord,
  (state: VehicleTechRecordModel) => {
    return state.metadata;
  }
);

export const getViewState = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.viewState
);
