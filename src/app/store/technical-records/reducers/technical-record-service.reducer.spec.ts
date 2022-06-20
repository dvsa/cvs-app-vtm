import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { mockVehicleTechnicalRecordList } from '../../../../mocks/mock-vehicle-technical-record.mock';
import { getByPartialVin, getByPartialVinFailure, getByPartialVinSuccess, getByTrailerId, getByTrailerIdFailure, getByTrailerIdSuccess, getByVin, getByVinFailure, getByVinSuccess, getByVrm, getByVrmFailure, getByVrmSuccess } from '../actions/technical-record-service.actions';
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

  describe('getByPartialVIN', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        loading: true
      };
      const action = getByPartialVin({ partialVin: 'somevin' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    })
  })

  describe('getByPartialVINSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByPartialVinSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  })

  describe('getByPartialVINFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByPartialVinFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVIN', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        loading: true
      };
      const action = getByVin({ vin: 'somevin' });
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
      const action = getByVinSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVINFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByVinFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVrm', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getByVrm({ vrm: 'someVrm' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVrmSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByVrmSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVrmFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByVrmFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByTrailerId', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getByTrailerId({ trailerId: 'someTrailerId' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByTrailerIdSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByTrailerIdSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByTrailerIdFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByTrailerIdFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });
});
