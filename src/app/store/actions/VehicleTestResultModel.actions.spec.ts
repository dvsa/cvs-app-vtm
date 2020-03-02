import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetCurrentState,
  UpdateTestResult
} from './VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

const testResultModelExample = {
  vrm: '123',
  testStationPNumber: '123',
  testerEmailAddress: '123@123.com',
  vin: '213',
  vehicleSize: '213'
} as TestResultModel;

describe('GetVehicleTestResultModel', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModel('23434234');

    expect(actionInstance.type).toBe(EVehicleTestResultModelActions.GetVehicleTestResultModel);
    expect(actionInstance.payload).toBe('23434234');
  });
});

describe('GetVehicleTestResultModelSuccess', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModelSuccess([testResultModelExample]);

    expect(actionInstance.type).toBe(
      EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess
    );
    expect(actionInstance.payload).toStrictEqual([testResultModelExample]);
  });
});

describe('GetVehicleTestResultModelFailure', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModelFailure('test');

    expect(actionInstance.type).toBe(
      EVehicleTestResultModelActions.GetVehicleTestResultModelFailure
    );
    expect(actionInstance.payload).toBe('test');
  });
});

describe('SetCurrentState', () => {
  test('action should have correct type & payload', () => {
    const actionInstance = new SetCurrentState(VIEW_STATE.VIEW_ONLY);

    expect(actionInstance.type).toBe(EVehicleTestResultModelActions.SetCurrentState);
    expect(actionInstance.editState).toBe(VIEW_STATE.VIEW_ONLY);
  });
});

describe('UpdateTestResult', () => {
  test('action should have correct type & payload', () => {
    const actionInstance = new UpdateTestResult({testResultUpdated: testResultModelExample, testTypeNumber: '1'});

    expect(actionInstance.type).toBe(EVehicleTestResultModelActions.UpdateTestResult);
    expect(actionInstance.testResultTestTypeNumber.testResultUpdated).toStrictEqual(testResultModelExample);
    expect(actionInstance.testResultTestTypeNumber.testTypeNumber).toStrictEqual('1');
  });
});
