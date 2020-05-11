import {
  EVehicleTestResultModelActions, GetVehicleTestResultModel, GetVehicleTestResultModelSuccess, GetVehicleTestResultModelFailure
} from './VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';

const testResultModelExample: TestResultModel = {
  testerStaffId: '21',
  testStartTimestamp: new Date(),
  odometerReadingUnits: 'test',
  testEndTimestamp: new Date(),
  testStatus: 'new',
  testTypes: [],
  vehicleClass: null,
  testStationName: 'test',
  vehicleId: '213',
  noOfAxles: 2,
  vehicleType: 'none',
  countryOfRegistration: 'Ro',
  preparerId: '231',
  odometerReading: 123,
  vehicleConfiguration: 'none',
  testStationType: 'none',
  reasonForCancellation: 'none',
  testerName: '213',
  vrm: '123',
  testStationPNumber: '123',
  numberOfSeats: 123,
  testerEmailAddress: '123@123.com',
  euVehicleCategory: '123',
  vin: '213',
  vehicleSize: '213',
  preparerName: '213'
};

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
