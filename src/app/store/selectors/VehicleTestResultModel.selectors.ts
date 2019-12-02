import { createSelector, createFeatureSelector } from '@ngrx/store';

import {IVehicleTestResultModelState} from '../../store/state/VehicleTestResultModel.state';

export const selectFeature = createFeatureSelector<IVehicleTestResultModelState>(
  'vehicleTechRecordModel'
);

export const selectSelectedVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.selectedTestResultModel
);
