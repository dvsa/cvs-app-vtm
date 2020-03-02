import {
  EVehicleTestResultModelActions, GetVehicleTestResultModel, GetVehicleTestResultModelSuccess, GetVehicleTestResultModelFailure
} from './VehicleTestResultModel.actions';
import {TestResultModel} from '@app/models/test-result.model';

const testResultModelExample = {
  vrm: '123',
  testStationPNumber: '123',
  testerEmailAddress: '123@123.com',
  vin: '213',
  vehicleSize: '213'
} as TestResultModel;

describe('GetVehicleTestResultModel', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModel(testResultModelExample);

    expect(actionInstance.type).toBe(EVehicleTestResultModelActions.GetVehicleTestResultModel);
    expect(actionInstance.payload).toBe(testResultModelExample);
  });
});

describe('GetVehicleTestResultModelSuccess', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModelSuccess(testResultModelExample);

    expect(actionInstance.type).toBe(EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess);
    expect(actionInstance.payload).toBe(testResultModelExample);
  });
});

describe('GetVehicleTestResultModelFailure', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModelFailure(testResultModelExample);

    expect(actionInstance.type).toBe(EVehicleTestResultModelActions.GetVehicleTestResultModelFailure);
    expect(actionInstance.payload).toBe(testResultModelExample);
  });
});
