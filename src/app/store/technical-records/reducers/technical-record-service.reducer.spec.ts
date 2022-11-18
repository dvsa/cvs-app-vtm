import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { mockVehicleTechnicalRecordList, mockVehicleTechnicalRecord } from '../../../../mocks/mock-vehicle-technical-record.mock';
import {
  getByAll,
  getByAllFailure,
  getByAllSuccess,
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getBySystemNumberAndVin,
  getBySystemNumberAndVinFailure,
  getBySystemNumberAndVinSuccess,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess,
  updateEditingTechRecord,
  updateEditingTechRecordCancel
} from '../actions/technical-record-service.actions';
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
    });
  });

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
  });

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

  describe('getBySystemNumber', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getBySystemNumberAndVin({ systemNumber: '001', vin: '1' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getBySystemNumberSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getBySystemNumberAndVinSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getBySystemNumberFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getBySystemNumberAndVinFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByAll', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getByAll({ all: '001' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByAllSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByAllSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByAllFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByAllFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('putUpdateTechRecords', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1),
        loading: true
      };
      const action = updateTechRecords({ systemNumber: '001' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(newState).toEqual(state);
      expect(newState).not.toBe(state);
      expect(newState.vehicleTechRecords.length).toBeGreaterThan(0);
    });
  });

  describe('putUpdateTechRecordsSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: oldRecord
      };
      const action = updateTechRecordsSuccess({ vehicleTechRecords: [...newRecord] });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecords).toEqual(newRecord);
    });
  });

  describe('putUpdateTechRecordsFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const action = updateTechRecordsFailure({ error });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.error).toEqual(error);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('postProvisionalTechRecord', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1),
        loading: true
      };
      const action = createProvisionalTechRecord({ systemNumber: '001' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
      expect(state.vehicleTechRecords.length).toBeGreaterThan(0);
    });
  });

  describe('postProvisionalTechRecordSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: oldRecord
      };
      const action = createProvisionalTechRecordSuccess({ vehicleTechRecords: [...newRecord] });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecords).toEqual(newRecord);
    });
  });

  describe('archiveTechRecord', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1),
        loading: true
      };
      const action = archiveTechRecord({ systemNumber: '001', reasonForArchiving: 'some reason' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
      expect(state.vehicleTechRecords.length).toBeGreaterThan(0);
    });
  });

  describe('archiveTechRecordSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: oldRecord
      };
      const action = archiveTechRecordSuccess({ vehicleTechRecords: [...newRecord] });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecords).toEqual(newRecord);
    });
  });

  describe('archiveTechRecordFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const action = archiveTechRecordFailure({ error });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.error).toEqual(error);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('postProvisionalTechRecordFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const action = createProvisionalTechRecordFailure({ error });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.error).toEqual(error);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('updateEditingTechRecord', () => {
    it('should set the editingTechRecord', () => {
      const techRecord: TechRecordModel = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord[0];
      const action = updateEditingTechRecord({ techRecord: techRecord });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.editingTechRecord).toEqual(techRecord);
      expect(initialState).not.toBe(newState);
    });
  });
  describe('updateEditingTechRecordCancel', () => {
    it('should clear the state', () => {
      initialState.editingTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord[0];
      const action = updateEditingTechRecordCancel();
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.editingTechRecord).toBeUndefined();
      expect(initialState).not.toBe(newState);
    });
  });
});
