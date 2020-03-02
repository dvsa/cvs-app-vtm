import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  SetSelectedTestResultModel,
  SetSelectedTestResultModelSuccess,
  UpdateTestResult
} from './VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TEST_MODEL_UTILS } from '../../utils/test-models.utils';

const testResultModelExample: TestResultModel = TEST_MODEL_UTILS.mockTestResult({
  testerStaffId: '21',
  testStartTimestamp: '2019-01-16T12:24:38.027Z',
  vin: '213',
  vehicleSize: '213'
} as TestResultModel);

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
    const actionInstance = new GetVehicleTestResultModelSuccess([testResultModelExample]);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess,
      payload: [testResultModelExample]
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

describe('SetTestViewState', () => {
  it('action should have correct type and state value as payload when the action is instantiated', () => {
    const actionInstance = new SetTestViewState(VIEW_STATE.VIEW_ONLY);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetTestViewState,
      editState: VIEW_STATE.VIEW_ONLY
    });
  });
});

describe('UpdateTestResult', () => {
  it('action should have correct type and test result updated payload when the action is instantiated', () => {
    const actionInstance = new UpdateTestResult({
      testResultUpdated: testResultModelExample,
      testTypeNumber: '1',
      testResultsUpdated: [testResultModelExample]
    });

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.UpdateTestResult,
      testResultTestTypeNumber: {
        testResultUpdated: testResultModelExample,
        testTypeNumber: '1',
        testResultsUpdated: [testResultModelExample]
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
    const actionInstance = new SetSelectedTestResultModelSuccess(testResultModelExample);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetSelectedTestResultModelSuccess,
      payload: testResultModelExample
    });
  });
});
