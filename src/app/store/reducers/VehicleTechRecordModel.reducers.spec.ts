import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { VehicleTechRecordModelReducers } from '@app/store/reducers/VehicleTechRecordModel.reducers';
import {
  GetVehicleTechRecordModel, GetVehicleTechRecordModelHavingStatusAll, GetVehicleTechRecordModelHavingStatusAllFailure,
  GetVehicleTechRecordModelHavingStatusAllSuccess, GetVehicleTechRecordModelSuccess, SetVehicleTechRecordModelVinOnCreate
} from '../actions/VehicleTechRecordModel.actions';
import { initialVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';


describe('VehicleTechRecordModel Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as any;
      const result = VehicleTechRecordModelReducers(undefined, action);

      expect(result).toBe(initialVehicleTechRecordModelState);
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModel', () => {
    it('should toggle loading state', () => {
      const action = new GetVehicleTechRecordModel({ techRecord: [] });
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
      const action = new GetVehicleTechRecordModelHavingStatusAll({ techRecord: [] });
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

  describe('GetVehicleTechRecordModelHavingStatusAllFailure', () => {
    test('should return state with error', () => {
      const action = new GetVehicleTechRecordModelHavingStatusAllFailure('error');
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);

      expect(result).toMatchObject({
        ...initialVehicleTechRecordModelState,
        error: 'error'
      });
    });
  });

  describe('[SetVehicleTechRecordModelVinOnCreate] SetVehicleTechRecordModelVinOnCreate', () => {
    it('should update state with first tech record creating details', () => {
      const action = new SetVehicleTechRecordModelVinOnCreate({ vin: 'aaa', vrm: 'bbb', vType: 'PSV' });
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState,
        initialDetails: { vin: 'aaa', vrm: 'bbb', vType: 'PSV' }
      });
    });
  });

});
