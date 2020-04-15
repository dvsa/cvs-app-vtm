import { VehicleTestResultModelReducers } from './VehicleTestResultModel.reducers';
import { initialVehicleTestResultModelState } from '../state/VehicleTestResultModel.state';

import {
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  GetVehicleTestResultModelFailure,
  SetTestViewState,
  UpdateTestResult,
  UpdateSelectedTestResultModelSuccess
} from '../actions/VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { TEST_MODEL_UTILS } from '@app/utils';

describe('VehicleTestResultModel Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as any;
      const result = VehicleTestResultModelReducers(undefined, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[GetTestResultModel]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once GetTestResultModel is dispatched', () => {
      const action = new GetVehicleTestResultModel('3142435');
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[GetTestResultModelSuccess]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once GetTestResultModelSuccess is dispatched', () => {
      const vehicleTestResult: TestResultModel[] = [TEST_MODEL_UTILS.mockTestRecord()];
      const action = new GetVehicleTestResultModelSuccess(vehicleTestResult);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[GetTestResultModelFailure]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once GetTestResultModelFailure is dispatched', () => {
      const action = new GetVehicleTestResultModelFailure('error');
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[SetCurrentState]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once SetCurrentState is dispatched', () => {
      const action = new SetTestViewState(VIEW_STATE.VIEW_ONLY);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
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
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });

  describe('[UpdateSelectedTestResultModelSuccess]', () => {
    it('should update the VehicleTestResult reducer state with the correct payload once UpdateSelectedTestResultModelSuccess is dispatched', () => {
      const testRecordPayload: TestResultModel = TEST_MODEL_UTILS.mockTestRecord();

      initialVehicleTestResultModelState.selectedTestResultModel = {} as TestResultModel;

      const action = new UpdateSelectedTestResultModelSuccess(testRecordPayload);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toMatchSnapshot();
    });
  });
});
