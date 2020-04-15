import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { VehicleTechRecordModelReducers } from '@app/store/reducers/VehicleTechRecordModel.reducers';
import {
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetVehicleTechRecordModelOnCreate
} from '../actions/VehicleTechRecordModel.actions';
import { initialVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';
import { TechRecord } from '@app/models/tech-record.model';
import { SearchParams } from '@app/models/search-params';

const techRecord: TechRecord = {} as TechRecord;
const vehicleTechRecord: VehicleTechRecordModel = {} as VehicleTechRecordModel;

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
      const action = new GetVehicleTechRecordModel(techRecord);
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState
      });
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll', () => {
    it('should toggle loading state', () => {
      const searchParams: SearchParams = { searchIdentifier: '1234', searchCriteria: 'all' };
      const action = new GetVehicleTechRecordModelHavingStatusAll(searchParams);
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState
      });
    });
  });

  describe('[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Success', () => {
    it('should update the state with the payload', () => {
      const action = new GetVehicleTechRecordModelHavingStatusAllSuccess([vehicleTechRecord]);
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState,
        vehicleTechRecordModel: [vehicleTechRecord]
      });
    });
  });

  describe('[SetVehicleTechRecordModelOnCreate] SetVehicleTechRecordModelVinOnCreate', () => {
    it('should update state with first tech record creating details', () => {
      const action = new SetVehicleTechRecordModelOnCreate({
        vin: 'aaa',
        vrm: 'bbb',
        vType: 'PSV'
      });
      const result = VehicleTechRecordModelReducers(initialVehicleTechRecordModelState, action);
      expect(result).toEqual({
        ...initialVehicleTechRecordModelState
      });
    });
  });
});
