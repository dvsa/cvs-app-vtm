import {
  EVehicleTestResultActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  SetSelectedTestResultModel,
  SetSelectedTestResultModelSuccess,
  UpdateTestResult,
  UpdateSelectedTestResultModel,
  UpdateSelectedTestResultModelSuccess,
  CreateTestResult,
  CreateTestResultSuccess
} from './VehicleTestResult.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { DownloadCertificate } from './VehicleTestResult.actions';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';
import { KeyValue } from '@angular/common';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';

const testResultModelExample: TestResultModel = TEST_MODEL_UTILS.mockTestRecord({
  testerStaffId: '21',
  testStartTimestamp: '2019-01-16T12:24:38.027Z',
  vin: '213',
  vehicleSize: '213'
} as TestResultModel);

describe('GetVehicleTestResultModel', () => {
  it('should create GetVehicleTestResultModel action', () => {
    const actionInstance = new GetVehicleTestResultModel('23434234');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.GetVehicleTestResultModel,
      payload: '23434234'
    });
  });
});

describe('GetVehicleTestResultModelSuccess', () => {
  it('should create GetVehicleTestResultModelSuccess action', () => {
    const actionInstance = new GetVehicleTestResultModelSuccess([testResultModelExample]);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.GetVehicleTestResultModelSuccess,
      payload: [testResultModelExample]
    });
  });
});

describe('GetVehicleTestResultModelFailure', () => {
  it('should create GetVehicleTestResultModelFailure action', () => {
    const actionInstance = new GetVehicleTestResultModelFailure('test');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.GetVehicleTestResultModelFailure,
      payload: 'test'
    });
  });
});

describe('SetTestViewState', () => {
  it('should create SetTestViewState action', () => {
    const actionInstance = new SetTestViewState(VIEW_STATE.VIEW_ONLY);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.SetTestViewState,
      editState: VIEW_STATE.VIEW_ONLY
    });
  });
});

describe('UpdateTestResult', () => {
  it('should create UpdateTestResult action', () => {
    const actionInstance = new UpdateTestResult({
      testResultUpdated: testResultModelExample,
      testTypeNumber: '1',
      testResultsUpdated: [testResultModelExample]
    });

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.UpdateTestResult,
      testResultTestTypeNumber: {
        testResultUpdated: testResultModelExample,
        testTypeNumber: '1',
        testResultsUpdated: [testResultModelExample]
      }
    });
  });
});

describe('SetSelectedTestResultModel', () => {
  it('should create SetSelectedTestResultModel action', () => {
    const actionInstance = new SetSelectedTestResultModel('');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.SetSelectedTestResultModel,
      payload: ''
    });
  });
});

describe('SetSelectedTestResultModelSuccess', () => {
  it('should create SetSelectedTestResultModelSuccess action', () => {
    const actionInstance = new SetSelectedTestResultModelSuccess(testResultModelExample);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.SetSelectedTestResultModelSuccess,
      payload: testResultModelExample
    });
  });
});

describe('DownloadCertificate', () => {
  it('should create DownloadCertificate action', () => {
    const actionInstance = new DownloadCertificate('');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.DownloadCertificate,
      payload: ''
    });
  });
});

describe('UpdateSelectedTestResultModel', () => {
  const testTreeNode = {
    key: '1',
    value: 'test'
  } as KeyValue<string, string>;

  it('should create UpdateSelectedTestResultModel action', () => {
    const actionInstance = new UpdateSelectedTestResultModel(testTreeNode);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.UpdateSelectedTestResultModel,
      payload: testTreeNode
    });
  });
});

describe('UpdateSelectedTestResultModelSuccess', () => {
  it('should create UpdateSelectedTestResultModelSuccess action', () => {
    const actionInstance = new UpdateSelectedTestResultModelSuccess(testResultModelExample);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.UpdateSelectedTestResultModelSuccess,
      payload: testResultModelExample
    });
  });
});

describe('CreateTestResult', () => {
  it('should create CreateTestResult action', () => {
    const actionInstance = new CreateTestResult({} as VehicleTestResultUpdate);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.CreateTestResult,
      vTestResultUpdated: {} as VehicleTestResultUpdate
    });
  });
});

describe('CreateTestResultSuccess', () => {
  it('should create CreateTestResultSuccess action', () => {
    const actionInstance = new CreateTestResultSuccess({} as VehicleTestResultUpdate);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultActions.CreateTestResultSuccess,
      vTestResultUpdated: {} as VehicleTestResultUpdate
    });
  });
});
