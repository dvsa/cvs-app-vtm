import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetVehicleTechRecordModelVinOnCreate,
  SetVehicleTechRecordModelVinOnCreateSucess
} from './VehicleTechRecordModel.actions';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { CreateTechRecordVM } from '../state/VehicleTechRecordModel.state';
import { TechRecord } from '@app/models/tech-record.model';
import { SearchParams } from '@app/models/search-params';

const vehicleTechRecordModel: VehicleTechRecordModel = {} as VehicleTechRecordModel;
const techRecord: TechRecord = {} as TechRecord;

describe('GetVehicleTechRecordModel', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModel(techRecord);

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.GetVehicleTechRecordModel);
    expect(actionInstance.payload).toBe(techRecord);
  });
});

describe('GetVehicleTechRecordModelHavingStatusAll', () => {
  test('the action should have the right type and payload', () => {
    const searchParams: SearchParams = { searchIdentifier: '1234', searchCriteria: 'all' };
    const actionInstance = new GetVehicleTechRecordModelHavingStatusAll(searchParams);

    expect(actionInstance.type).toBe(
      EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll
    );
    expect(actionInstance.payload).toStrictEqual({
      searchIdentifier: '1234',
      searchCriteria: 'all'
    });
  });
});

describe('GetVehicleTechRecordModelHavingStatusAllSuccess', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModelHavingStatusAllSuccess([
      vehicleTechRecordModel
    ]);

    expect(actionInstance.type).toBe(
      EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess
    );
    expect(actionInstance.payload).toStrictEqual([vehicleTechRecordModel]);
  });
});

describe('SetVehicleTechRecordModelVinOnCreate', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new SetVehicleTechRecordModelVinOnCreate({
      vin: 'aaa',
      vrm: 'bbb',
      vType: 'PSV',
      error: []
    });

    expect(actionInstance.type).toBe(
      EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate
    );
    expect(actionInstance.payload).toEqual({ vin: 'aaa', vrm: 'bbb', vType: 'PSV', error: [] });
  });
});

describe('SetVehicleTechRecordModelVinOnCreateSucess', () => {
  test('the action should have the right type and payload', () => {
    const payload: CreateTechRecordVM = { vin: '', vrm: '', vType: '', error: [] };
    const action = new SetVehicleTechRecordModelVinOnCreateSucess(payload);

    expect(action.type).toBe(
      EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreateSucess
    );
    expect(action.payload).toBe(payload);
  });
});
