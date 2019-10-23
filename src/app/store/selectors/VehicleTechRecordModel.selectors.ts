import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';


const selectTechRecords = (state: IAppState) =>  state.vehicleTechRecordModel;

export const selectVehicleTechRecordModelHavingStatusAll = createSelector(
  selectTechRecords,
  (state: IVehicleTechRecordModelState) => state.vehicleTechRecordModel
);

export const selectSelectedVehicleTechRecordModel = createSelector(
  selectTechRecords,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecordModel
);
