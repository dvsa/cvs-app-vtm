import { createSelector } from '@ngrx/store';

import { IAppState } from '../../store/state/app.state';
import {IVehicleTestResultModelState} from '../../store/state/VehicleTestResultModel.state';

const selectTestResults = (state: IAppState) =>  state.vehicleTestResultModel;

export const selectSelectedVehicleTestResultModel = createSelector(
  selectTestResults,
  (state: IVehicleTestResultModelState) => state.selectedTestResultModel
);
