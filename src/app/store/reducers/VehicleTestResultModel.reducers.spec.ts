import { VehicleTestResultModelReducers } from './VehicleTestResultModel.reducers';
import { initialVehicleTestResultModelState } from '../state/VehicleTestResultModel.state';

import {
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  GetVehicleTestResultModelFailure,
  SetCurrentState,
  UpdateTestResult
} from '../actions/VehicleTestResultModel.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';

describe('VehicleTestResultModel Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as any;
      const result = VehicleTestResultModelReducers(undefined, action);

      expect(result).toBe(initialVehicleTestResultModelState);
    });
  });

  describe('[TestResultModel] Get TestResultModel', () => {
    it('should toggle loading state', () => {
      const action = new GetVehicleTestResultModel('3142435');
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toEqual({
        ...initialVehicleTestResultModelState
      });
    });
  });

  describe('[TestResultModel] Get TestResultModel Success', () => {
    it('should update the state with the payload', () => {
      const vehicleTestResult: TestResultModel[] = {} as TestResultModel[];
      const action = new GetVehicleTestResultModelSuccess(vehicleTestResult);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toEqual({
        ...initialVehicleTestResultModelState,
        vehicleTestResultModel: vehicleTestResult,
        selectedTestResultModel: null
      });
    });
  });

  describe('[TestResultModel] Get TestResultModel Failure', () => {
    test('should update the error state with the payload when called', () => {
      const action = new GetVehicleTestResultModelFailure('error');
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);

      expect(result).toMatchObject({
        ...initialVehicleTestResultModelState,
        error: 'error'
      });
    });
  });

  describe('[SetCurrentState]', () => {
    test('should update currentState', () => {
      const action = new SetCurrentState(VIEW_STATE.VIEW_ONLY);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);

      expect(result).toMatchObject({
        ...initialVehicleTestResultModelState,
        editState: VIEW_STATE.VIEW_ONLY
      });
    });
  });

  describe('[Update Test Result]', () => {
    test('should update testStations', () => {
      const testResultUpdated = {} as TestResultModel;
      const vehicleTestResultTestTypeNumber: TestResultTestTypeNumber = {
        testResultUpdated: testResultUpdated,
        testTypeNumber: '1'
      } as TestResultTestTypeNumber;
      const action = new UpdateTestResult(vehicleTestResultTestTypeNumber);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);

      expect(result).toMatchObject({
        ...initialVehicleTestResultModelState,
        vehicleTestResultModel: vehicleTestResultTestTypeNumber.testResultUpdated
      });
    });
  });
});
