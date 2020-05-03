import {VehicleTestResultModelReducers} from './VehicleTestResultModel.reducers';
import {initialVehicleTestResultModelState} from '../state/VehicleTestResultModel.state';

import {
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  GetVehicleTestResultModelFailure
} from '../actions/VehicleTestResultModel.actions';

describe('VehicleTestResultModel Reducer', () => {

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {type: 'NOOP'} as any;
      const result = VehicleTestResultModelReducers(undefined, action);

      expect(result).toBe(initialVehicleTestResultModelState);
    });
  });

  describe('[TestResultModel] Get TestResultModel', () => {
    it('should toggle loading state', () => {
      const action = new GetVehicleTestResultModel({testResult: {}});
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toEqual({
        ...initialVehicleTestResultModelState
      });
    });
  });

  describe('[TestResultModel] Get TestResultModel Success', () => {
    it('should update the state with the payload', () => {
      const vehicleTestResult: any = {test: 'mock'};
      const action = new GetVehicleTestResultModelSuccess(vehicleTestResult);
      const result = VehicleTestResultModelReducers(initialVehicleTestResultModelState, action);
      expect(result).toEqual({
        ...initialVehicleTestResultModelState,
        vehicleTestResultModel: vehicleTestResult,

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

});

