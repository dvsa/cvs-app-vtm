import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelSuccess,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetVehicleTechRecordModelOnCreate
} from './VehicleTechRecordModel.actions';
import {
  VehicleIdentifiers,
  VehicleTechRecordModel
} from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { SearchParams } from '@app/models/search-params';

const vehicleTechRecordModel: VehicleTechRecordModel = {} as VehicleTechRecordModel;
const techRecord: TechRecord = {} as TechRecord;

describe('GetVehicleTechRecordModel', () => {
  it('the action should have the right type and payload', () => {
    const action = new GetVehicleTechRecordModel(techRecord);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModel,
      payload: techRecord
    });

  });
});

describe('GetVehicleTechRecordModelSuccess', () => {
  it('the action should have the right type and payload', () => {
    const action = new GetVehicleTechRecordModelSuccess([vehicleTechRecordModel]);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModelSuccess,
      payload: [vehicleTechRecordModel]
    });

  });
});

describe('GetVehicleTechRecordModelHavingStatusAll', () => {
  it('the action should have the right type and payload', () => {
    const searchParams: SearchParams = { searchIdentifier: '1234', searchCriteria: 'all' };
    const action = new GetVehicleTechRecordModelHavingStatusAll(searchParams);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll,
      payload: searchParams
    });
  });
});

describe('GetVehicleTechRecordModelHavingStatusAllSuccess', () => {
  it('the action should have the right type and payload', () => {
    const action = new GetVehicleTechRecordModelHavingStatusAllSuccess([vehicleTechRecordModel]);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess,
      payload: [vehicleTechRecordModel]
    });
  });
});

describe('SetVehicleTechRecordModelOnCreate', () => {
  it('the action should have the right type and payload', () => {
    const vehicleIdentifiers: VehicleIdentifiers = {
      vin: 'aaa',
      vrm: 'bbb',
      vType: 'PSV'
    } as VehicleIdentifiers;

    const action = new SetVehicleTechRecordModelOnCreate(vehicleIdentifiers);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.SetVehicleTechRecordModelOnCreate,
      payload: vehicleIdentifiers
    });
  });
});
