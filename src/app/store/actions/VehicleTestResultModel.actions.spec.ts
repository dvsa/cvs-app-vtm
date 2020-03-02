import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetCurrentState,
  SetSelectedTestResultModel,
  SetSelectedTestResultModelSuccess,
  UpdateTestResult
} from './VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

const expectedTestResultModel = {
  vrm: '123',
  testStationPNumber: '123',
  testerEmailAddress: '123@123.com',
  vin: '213',
  vehicleSize: '213'
} as TestResultModel;

describe('GetVehicleTestResultModel', () => {
  it('action should have the right type and system number payload when the action is instantiated', () => {
    const actionInstance = new GetVehicleTestResultModel('23434234');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.GetVehicleTestResultModel,
      payload: '23434234'
    });
  });
});

describe('GetVehicleTestResultModelSuccess', () => {
  it('action should have the right type and test results array payload when the action is instantiated', () => {
    const actionInstance = new GetVehicleTestResultModelSuccess([expectedTestResultModel]);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess,
      payload: [expectedTestResultModel]
    });
  });
});

describe('GetVehicleTestResultModelFailure', () => {
  it('action should have the right type and error payload when the action is instantiated', () => {
    const actionInstance = new GetVehicleTestResultModelFailure('test');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.GetVehicleTestResultModelFailure,
      payload: 'test'
    });
  });
});

describe('SetCurrentState', () => {
  it('action should have correct type and state value as payload when the action is instantiated', () => {
    const actionInstance = new SetCurrentState(VIEW_STATE.VIEW_ONLY);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetCurrentState,
      editState: VIEW_STATE.VIEW_ONLY
    });
  });
});

describe('UpdateTestResult', () => {
  it('action should have correct type and test result updated payload when the action is instantiated', () => {
    const actionInstance = new UpdateTestResult({
      testResultUpdated: expectedTestResultModel,
      testTypeNumber: '1'
    });

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.UpdateTestResult,
      testResultTestTypeNumber: {
        testResultUpdated: expectedTestResultModel,
        testTypeNumber: '1'
      }
    });
  });
});

describe('SetSelectedTestResultModel', () => {
  it('action should have correct type & payload', () => {
    const actionInstance = new SetSelectedTestResultModel('');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetSelectedTestResultModel,
      payload: ''
    });
  });
});

describe('SetSelectedTestResultModelSuccess', () => {
  it('action should have correct type & payload', () => {
    const actionInstance = new SetSelectedTestResultModelSuccess(expectedTestResultModel);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetSelectedTestResultModelSuccess,
      payload: expectedTestResultModel
    });
  });
});
