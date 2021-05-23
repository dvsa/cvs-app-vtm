import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  SetSelectedTestResultModel,
  SetSelectedTestResultModelSuccess,
  UpdateTestResult,
  UpdateSelectedTestResultModel,
  UpdateSelectedTestResultModelSuccess,
  ArchiveTestResult
} from './VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { DownloadCertificate } from './VehicleTestResultModel.actions';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';
import { KeyValue } from '@angular/common';

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
      type: EVehicleTestResultModelActions.GetVehicleTestResultModel,
      payload: '23434234'
    });
  });
});

describe('GetVehicleTestResultModelSuccess', () => {
  it('should create GetVehicleTestResultModelSuccess action', () => {
    const actionInstance = new GetVehicleTestResultModelSuccess([testResultModelExample]);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess,
      payload: [testResultModelExample]
    });
  });
});

describe('GetVehicleTestResultModelFailure', () => {
  it('should create GetVehicleTestResultModelFailure action', () => {
    const actionInstance = new GetVehicleTestResultModelFailure('test');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.GetVehicleTestResultModelFailure,
      payload: 'test'
    });
  });
});

describe('SetTestViewState', () => {
  it('should create SetTestViewState action', () => {
    const actionInstance = new SetTestViewState(VIEW_STATE.VIEW_ONLY);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetTestViewState,
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
  it('should create SetSelectedTestResultModel action', () => {
    const actionInstance = new SetSelectedTestResultModel('');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetSelectedTestResultModel,
      payload: ''
    });
  });
});

describe('SetSelectedTestResultModelSuccess', () => {
  it('should create SetSelectedTestResultModelSuccess action', () => {
    const actionInstance = new SetSelectedTestResultModelSuccess(testResultModelExample);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.SetSelectedTestResultModelSuccess,
      payload: testResultModelExample
    });
  });
});

describe('DownloadCertificate', () => {
  it('should create DownloadCertificate action', () => {
    const actionInstance = new DownloadCertificate('');

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.DownloadCertificate,
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
      type: EVehicleTestResultModelActions.UpdateSelectedTestResultModel,
      payload: testTreeNode
    });
  });
});

describe('UpdateSelectedTestResultModelSuccess', () => {
  it('should create UpdateSelectedTestResultModelSuccess action', () => {
    const actionInstance = new UpdateSelectedTestResultModelSuccess(testResultModelExample);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.UpdateSelectedTestResultModelSuccess,
      payload: testResultModelExample
    });
  });
});

describe('ArchiveCertificate', () => {
  it('action should have correct type & payload', () => {
    const actionInstance = new ArchiveTestResult({} as TestResultModel);

    expect({ ...actionInstance }).toEqual({
      type: EVehicleTestResultModelActions.ArchiveTestResult,
      payload: {}
    });
  });
});
