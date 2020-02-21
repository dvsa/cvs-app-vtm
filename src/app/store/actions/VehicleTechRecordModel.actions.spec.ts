import {
  EVehicleTechRecordModelActions, GetVehicleTechRecordModel, GetVehicleTechRecordModelSuccess, GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess, GetVehicleTechRecordModelHavingStatusAllFailure, SetVehicleTechRecordModelVinOnCreate
} from './VehicleTechRecordModel.actions';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';

const techRecordModelExample: VehicleTechRecordModel = {
  vrms: null,
  vin: '1234',
  techRecord: [],
  metadata: { adrDetails: undefined },
  error: null,
};

describe('GetVehicleTechRecordModel', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModel(techRecordModelExample);

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.GetVehicleTechRecordModel);
    expect(actionInstance.payload).toBe(techRecordModelExample);
  });
});

describe('GetVehicleTechRecordModelSuccess', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModelSuccess(techRecordModelExample);

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.GetVehicleTechRecordModelSuccess);
    expect(actionInstance.payload).toBe(techRecordModelExample);
  });
});

describe('GetVehicleTechRecordModelHavingStatusAll', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModelHavingStatusAll(techRecordModelExample);

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll);
    expect(actionInstance.payload).toBe(techRecordModelExample);
  });
});

describe('GetVehicleTechRecordModelHavingStatusAllSuccess', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordModelExample);

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess);
    expect(actionInstance.payload).toBe(techRecordModelExample);
  });
});

describe('GetVehicleTechRecordModelHavingStatusAllFailure', () => {
  test('the action should have the right type and payload', () => {
    const actionInstance = new GetVehicleTechRecordModelHavingStatusAllFailure(techRecordModelExample);

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllFailure);
    expect(actionInstance.payload).toBe(techRecordModelExample);
  });
});

describe('SetVehicleTechRecordModelVinOnCreate', () => {
  test('the action should have the right type and payload', () => {

    const actionInstance = new SetVehicleTechRecordModelVinOnCreate({ vin: 'aaa', vrm: 'bbb', vType: 'PSV', error: [] });

    expect(actionInstance.type).toBe(EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate);
    expect(actionInstance.payload).toEqual({ vin: 'aaa', vrm: 'bbb', vType: 'PSV', error: [] });

  });
});
