import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  GetVehicleTestResultModelFailure
} from './VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { TEST_MODEL_UTILS } from '../../utils/test-models.utils';

const testResultModelExample: TestResultModel = TEST_MODEL_UTILS.mockTestResult({
  testerStaffId: '21',
  testStartTimestamp: '2019-01-16T12:24:38.027Z',
  vin: '213',
  vehicleSize: '213'
} as TestResultModel);

describe('GetVehicleTestResultModel', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModel(testResultModelExample);

    expect(actionInstance.type).toEqual(EVehicleTestResultModelActions.GetVehicleTestResultModel);
    expect(actionInstance.payload).toEqual(testResultModelExample);
  });
});

describe('GetVehicleTestResultModelSuccess', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModelSuccess(testResultModelExample);

    expect(actionInstance.type).toEqual(
      EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess
    );
    expect(actionInstance.payload).toEqual(testResultModelExample);
  });
});

describe('GetVehicleTestResultModelFailure', () => {
  test('action should have the right type and payload when used', () => {
    const actionInstance = new GetVehicleTestResultModelFailure(testResultModelExample);

    expect(actionInstance.type).toEqual(
      EVehicleTestResultModelActions.GetVehicleTestResultModelFailure
    );
    expect(actionInstance.payload).toEqual(testResultModelExample);
  });
});
