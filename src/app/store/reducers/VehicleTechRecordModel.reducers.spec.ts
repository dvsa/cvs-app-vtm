import {VehicleTechRecordModelReducers} from './VehicleTechRecordModel.reducers';
import {initialVehicleTechRecordModelState} from '../state/VehicleTechRecordModel.state';
import {
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelSuccess,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess, GetVehicleTechRecordModelHavingStatusAllFailure
} from '../actions/VehicleTechRecordModel.actions';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

describe('VehicleTechRecordModel Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {type: 'NOOP'} as any;
      const result = VehicleTechRecordModelReducers(undefined, action);

      expect(result).toBe(initialVehicleTechRecordModelState);
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModel', () => {
    it('should toggle loading state', () => {
      const action = new GetVehicleTechRecordModel({techRecord: []});
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState
      });
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModel Success', () => {
    it('should update the state with the payload', () => {
      const vehicleTechRecord: VehicleTechRecordModel = {
        vrms: [
          {
            vrm: '53654645',
            isPrimary: true
          }],
        vin: '1234566',
        techRecord: [],
        metadata: {
          adrDetails: undefined
        },
        error: null
      };
      const action = new GetVehicleTechRecordModelSuccess(vehicleTechRecord);
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState,
        selectedVehicleTechRecordModel: vehicleTechRecord
      });
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll', () => {
    it('should toggle loading state', () => {
      const action = new GetVehicleTechRecordModelHavingStatusAll({techRecord: []});
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState
      });
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Success', () => {
    it('should update the state with the payload', () => {
      const vehicleTechRecord: VehicleTechRecordModel = {
        vrms: [
          {
            vrm: '53654645',
            isPrimary: true
          }],
        vin: '1234566',
        techRecord: [],
        metadata: {
          adrDetails: undefined
        }
      };
      const action = new GetVehicleTechRecordModelHavingStatusAllSuccess(vehicleTechRecord);
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState,
        vehicleTechRecordModel: vehicleTechRecord
      });
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Failure', () => {
    it('should update the state with the payload', () => {
      const mock = 'mock';
      const action = new GetVehicleTechRecordModelHavingStatusAllFailure(mock);
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState,
        error: mock
      });
    });
  });
});
