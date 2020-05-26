import { createSelector, createFeatureSelector } from '@ngrx/store';

import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
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

export const getSelectedVehicleTechRecord = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecord
);

export const getVehicleTechRecordMetaData = createSelector(
  getSelectedVehicleTechRecord,
  (state: VehicleTechRecordModel) => state.metadata
);

export const getTechViewState = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.viewState
);
