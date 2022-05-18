import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { createMock } from 'ts-auto-mock';
import { getVehicleTechRecordState, initialState, TechnicalRecordServiceState } from '../reducers/technical-record-service.reducer';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, (state) => state.vehicleTechRecords);
export const technicalRecordsLoadingState = createSelector(getVehicleTechRecordState, (state) => state.loading);

describe('Tech Record Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return vehicleTechRecords state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, vehicleTechRecords: [createMock<VehicleTechRecordModel>()] };
      const selectedState = vehicleTechRecords.projector(state);
      expect(selectedState.length).toEqual(1);
    });
  });

  describe('technicalRecordsLoadingState', () => {
    it('should return loading state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, loading: true };
      const selectedState = technicalRecordsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });
});
