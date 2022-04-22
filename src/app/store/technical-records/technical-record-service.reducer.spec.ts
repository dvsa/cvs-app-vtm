import { mockVehicleTecnicalRecord, mockVehicleTecnicalRecordList } from '../../../mocks/mock-vehicle-technical-record.mock';
import { getByVIN, getByVINSuccess, getByVINFailure } from './technical-record-service.actions';
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

  describe('getByVINSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTecnicalRecordList(5);
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
      const newState = { ...initialState, message: error };
      const action = getByVINFailure({ message: error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });
});
