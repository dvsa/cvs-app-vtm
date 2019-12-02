import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';

export const selectFeature = createFeatureSelector<IVehicleTechRecordModelState>(
  'vehicleTechRecordModel'
);

export const selectTechRecords = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.vehicleTechRecordModel
);

export const selectVehicleTechRecordModelHavingStatusAll = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.vehicleTechRecordModel
);

export const selectSelectedVehicleTechRecordModel = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecordModel
);
