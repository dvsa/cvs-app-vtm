import { VehicleTestResultReducers } from './VehicleTestResult.reducers';
import { initialVehicleTestResultModelState } from '../state/VehicleTestResult.state';

import {
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  GetVehicleTestResultModelFailure,
  SetTestViewState,
  UpdateTestResult,
  UpdateSelectedTestResultModelSuccess,
  CreateTestResultSuccess,
  CreateTestResult
} from '../actions/VehicleTestResult.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { TEST_MODEL_UTILS } from '@app/utils';
import { UserDetails } from '@app/models/user-details';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';

describe('VehicleTestResult Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as any;
      const result = VehicleTestResultReducers(undefined, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[GetTestResultModel]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once GetTestResultModel is dispatched', () => {
      const action = new GetVehicleTestResultModel('3142435');
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[GetTestResultModelSuccess]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once GetTestResultModelSuccess is dispatched', () => {
      const vehicleTestResult: TestResultModel[] = [TEST_MODEL_UTILS.mockTestRecord()];
      const action = new GetVehicleTestResultModelSuccess(vehicleTestResult);
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[GetTestResultModelFailure]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once GetTestResultModelFailure is dispatched', () => {
      const action = new GetVehicleTestResultModelFailure('error');
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[SetCurrentState]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once SetCurrentState is dispatched', () => {
      const action = new SetTestViewState(VIEW_STATE.VIEW_ONLY);
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[UpdateTestResult]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once UpdateTestResult is dispatched', () => {
      const vehicleTestResultTestTypeNumber: TestResultTestTypeNumber = {
        testResultUpdated: {} as TestResultModel,
        testTypeNumber: '1',
        testResultsUpdated: {} as TestResultModel[]
      } as TestResultTestTypeNumber;

      initialVehicleTestResultModelState.vehicleTestResultModel = [
        { testTypes: [{ testNumber: '1' }] } as TestResultModel,
        { testTypes: [{ testNumber: '2' }] } as TestResultModel
      ];

      const action = new UpdateTestResult(vehicleTestResultTestTypeNumber);
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[UpdateSelectedTestResultModelSuccess]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once UpdateSelectedTestResultModelSuccess is dispatched', () => {
      const testRecordPayload: TestResultModel = TEST_MODEL_UTILS.mockTestRecord();

      initialVehicleTestResultModelState.selectedTestResultModel = {} as TestResultModel;

      const action = new UpdateSelectedTestResultModelSuccess(testRecordPayload);
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[CreateTestResultSuccess]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once CreateTestResultSuccess is dispatched', () => {
      const testResult: TestResultModel = TEST_MODEL_UTILS.mockTestRecord();
      const msUserDetails = { msUser: 'test' } as UserDetails;

      initialVehicleTestResultModelState.selectedTestResultModel = {} as TestResultModel;

      const action = new CreateTestResultSuccess({
        msUserDetails: msUserDetails,
        testResult: testResult
      });
      const result = VehicleTestResultReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });
});
