import { createSelector } from '@ngrx/store';

import { IAppState } from '@app/store/state/app.state';
import { IVehicleTechRecordModelState } from '@app/store/state/VehicleTechRecordModel.state';

const selectTechRecords = (state: IAppState) =>  state.vehicleTechRecordModel;

export const selectVehicleTechRecordModelHavingStatusAll = createSelector(
  selectTechRecords,
  (state: IVehicleTechRecordModelState) => state.vehicleTechRecordModel
);

export const selectSelectedVehicleTechRecordModel = createSelector(
  selectTechRecords,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecordModel
);
