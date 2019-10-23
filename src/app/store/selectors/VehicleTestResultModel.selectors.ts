import { createSelector } from '@ngrx/store';

import { IAppState } from '@app/store/state/app.state';
import {IVehicleTestResultModelState} from '@app/store/state/VehicleTestResultModel.state';

const selectTestResults = (state: IAppState) =>  state.vehicleTestResultModel;

export const selectSelectedVehicleTestResultModel = createSelector(
  selectTestResults,
  (state: IVehicleTestResultModelState) => state.selectedTestResultModel
);
