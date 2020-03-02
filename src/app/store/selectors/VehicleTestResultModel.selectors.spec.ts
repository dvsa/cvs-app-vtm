import {
  getCurrentState,
  getVehicleTestResultModel,
  selectFeature,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';
import { initialVehicleTestResultModelState } from '@app/store/state/VehicleTestResultModel.state';

describe('vehicleTestResultModel selectors', () => {
  const vehicleTestResultModelState = {
    vehicleTestResultModel: {
      testResultId: '123'
    } as TestResultModel,
    selectedTestResultModel: {
      testResultId: '111',
      testTypes: [{ testNumber: '1' } as TestType]
    } as TestResultModel,
    editState: 1
  };

  it('should return the default state on initialization', () => {
    expect(selectFeature.projector(initialVehicleTestResultModelState)).toEqual({
      vehicleTestResultModel: null,
      selectedTestResultModel: null,
      editState: 0,
      error: null
    });
  });

  it('should return the vehicleTestResultModel from state', () => {
    expect(getVehicleTestResultModel.projector(vehicleTestResultModelState)).toEqual(
      vehicleTestResultModelState.vehicleTestResultModel
    );
  });

  it('should return the current state value from state', () => {
    expect(getCurrentState.projector(vehicleTestResultModelState)).toEqual(
      vehicleTestResultModelState.editState
    );
  });

  it('should return an object containing the selected test result and its test type having the specified id', () => {
    expect(selectTestTypeById('1').projector(vehicleTestResultModelState)).toEqual({
      testRecord: vehicleTestResultModelState.selectedTestResultModel,
      testType: vehicleTestResultModelState.selectedTestResultModel.testTypes[0]
    });
  });
});
