import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { mockVehicleTechnicalRecordList } from '../../../../mocks/mock-vehicle-technical-record.mock';
import { getByVIN, getByVINFailure, getByVINSuccess } from '../actions/technical-record-service.actions';
import { initialState, TechnicalRecordServiceState, vehicleTechRecordReducer } from './technical-record-service.reducer';

describe('Vehicle Technical Record Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('getByVIN', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        loading: true
      };
      const action = getByVIN({ vin: 'somevin' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVINSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByVINSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVINFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByVINFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });
});
